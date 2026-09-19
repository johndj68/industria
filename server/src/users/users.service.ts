import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import type { Role } from '@prisma/client';

const USER_LIST_SELECT = {
  id: true,
  nome: true,
  email: true,
  role: true,
  xp: true,
  nivel: true,
  criadoEm: true,
};

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  findByEmail(email: string) {
    return this.prisma.user.findUnique({ where: { email } });
  }

  findById(id: string) {
    return this.prisma.user.findUnique({ where: { id } });
  }

  create(data: { email: string; passwordHash: string; nome: string; role?: Role }) {
    return this.prisma.user.create({ data });
  }

  listAll(busca?: string) {
    return this.prisma.user.findMany({
      where: busca
        ? {
            OR: [
              { nome: { contains: busca, mode: 'insensitive' } },
              { email: { contains: busca, mode: 'insensitive' } },
            ],
          }
        : undefined,
      orderBy: { criadoEm: 'desc' },
      select: USER_LIST_SELECT,
    });
  }

  async getDetalhe(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      select: {
        ...USER_LIST_SELECT,
        enrollments: {
          select: {
            statusPagamento: true,
            valorPagoCentavos: true,
            criadoEm: true,
            course: { select: { id: true, titulo: true } },
          },
        },
      },
    });
    if (!user) throw new NotFoundException('Usuário não encontrado');
    return user;
  }

  async updateRole(id: string, novoRole: Role, solicitanteId: string) {
    if (id === solicitanteId && novoRole !== 'ADMIN') {
      throw new BadRequestException('Você não pode remover seu próprio acesso de admin');
    }
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) throw new NotFoundException('Usuário não encontrado');

    return this.prisma.user.update({
      where: { id },
      data: { role: novoRole },
      select: USER_LIST_SELECT,
    });
  }
}
