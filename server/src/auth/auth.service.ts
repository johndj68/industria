import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import * as bcrypt from 'bcrypt';
import { randomBytes, createHash } from 'node:crypto';
import { UsersService } from '../users/users.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MailService } from '../mail/mail.service.js';
import type { RegisterDto } from './dto/register.dto.js';
import type { LoginDto } from './dto/login.dto.js';
import type { ForgotPasswordDto } from './dto/forgot-password.dto.js';
import type { ResetPasswordDto } from './dto/reset-password.dto.js';

const RESET_TOKEN_TTL_MS = 60 * 60 * 1000; // 1h

@Injectable()
export class AuthService {
  constructor(
    private readonly users: UsersService,
    private readonly jwt: JwtService,
    private readonly config: ConfigService,
    private readonly prisma: PrismaService,
    private readonly mail: MailService,
  ) {}

  private async issueTokens(user: { id: string; email: string; role: string }) {
    const payload = { sub: user.id, email: user.email, role: user.role };
    const [accessToken, refreshToken] = await Promise.all([
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_SECRET'),
        expiresIn: this.config.get<string>('JWT_EXPIRES_IN') as `${number}${'s' | 'm' | 'h' | 'd'}`,
      }),
      this.jwt.signAsync(payload, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
        expiresIn: this.config.get<string>('JWT_REFRESH_EXPIRES_IN') as `${number}${'s' | 'm' | 'h' | 'd'}`,
      }),
    ]);
    return { accessToken, refreshToken };
  }

  async register(dto: RegisterDto) {
    const existente = await this.users.findByEmail(dto.email);
    if (existente) throw new ConflictException('Email já cadastrado');

    const passwordHash = await bcrypt.hash(dto.senha, 10);
    const user = await this.users.create({
      email: dto.email,
      passwordHash,
      nome: dto.nome,
    });

    return this.issueTokens(user);
  }

  async login(dto: LoginDto) {
    const user = await this.users.findByEmail(dto.email);
    if (!user) throw new UnauthorizedException('Credenciais inválidas');

    const senhaOk = await bcrypt.compare(dto.senha, user.passwordHash);
    if (!senhaOk) throw new UnauthorizedException('Credenciais inválidas');

    return this.issueTokens(user);
  }

  async refresh(refreshToken: string) {
    try {
      const payload = await this.jwt.verifyAsync(refreshToken, {
        secret: this.config.get<string>('JWT_REFRESH_SECRET'),
      });
      const user = await this.users.findById(payload.sub);
      if (!user) throw new UnauthorizedException();
      return this.issueTokens(user);
    } catch {
      throw new UnauthorizedException('Refresh token inválido ou expirado');
    }
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.users.findByEmail(dto.email);
    // Sempre responde igual, exista ou não o email — evita enumerar contas.
    if (!user) return { ok: true };

    const tokenBruto = randomBytes(32).toString('hex');
    const tokenHash = createHash('sha256').update(tokenBruto).digest('hex');

    await this.prisma.passwordResetToken.create({
      data: {
        userId: user.id,
        tokenHash,
        expiraEm: new Date(Date.now() + RESET_TOKEN_TTL_MS),
      },
    });

    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const link = `${frontendUrl}/redefinir-senha?token=${tokenBruto}`;
    await this.mail.enviarRedefinicaoSenha(user.email, link);

    return { ok: true };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const tokenHash = createHash('sha256').update(dto.token).digest('hex');

    const registro = await this.prisma.passwordResetToken.findUnique({ where: { tokenHash } });
    if (!registro || registro.usadoEm || registro.expiraEm < new Date()) {
      throw new BadRequestException('Link de redefinição inválido ou expirado');
    }

    const passwordHash = await bcrypt.hash(dto.novaSenha, 10);
    await this.prisma.$transaction([
      this.prisma.user.update({ where: { id: registro.userId }, data: { passwordHash } }),
      this.prisma.passwordResetToken.update({
        where: { id: registro.id },
        data: { usadoEm: new Date() },
      }),
    ]);

    return { ok: true };
  }
}
