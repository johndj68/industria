import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import nodemailer, { Transporter } from 'nodemailer';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly transporter: Transporter | null;
  private readonly from: string;

  constructor(private readonly config: ConfigService) {
    const host = this.config.get<string>('SMTP_HOST');
    const port = this.config.get<string>('SMTP_PORT');
    const user = this.config.get<string>('SMTP_USER');
    const pass = this.config.get<string>('SMTP_PASS');
    this.from = this.config.get<string>('SMTP_FROM') ?? 'no-reply@plataforma.local';

    this.transporter =
      host && port && user && pass
        ? nodemailer.createTransport({
            host,
            port: Number(port),
            secure: Number(port) === 465,
            auth: { user, pass },
          })
        : null;
  }

  async enviarRedefinicaoSenha(destinatario: string, linkRedefinicao: string) {
    const assunto = 'Redefinição de senha — Simulador Industrial';
    const corpo = `Recebemos uma solicitação para redefinir sua senha.\n\nClique no link abaixo (válido por 1 hora):\n${linkRedefinicao}\n\nSe você não pediu isso, ignore este email.`;

    if (!this.transporter) {
      this.logger.warn(
        `SMTP não configurado — link de redefinição para ${destinatario}: ${linkRedefinicao}`,
      );
      return;
    }

    await this.transporter.sendMail({
      from: this.from,
      to: destinatario,
      subject: assunto,
      text: corpo,
    });
  }
}
