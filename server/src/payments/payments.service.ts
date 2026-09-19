import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Stripe from 'stripe';
import { StatusPagamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class PaymentsService {
  private readonly stripe: Stripe;

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) {
    this.stripe = new Stripe(this.config.get<string>('STRIPE_SECRET_KEY') || 'sk_test_not_configured');
  }

  async createCheckoutSession(userId: string, courseId: string) {
    const course = await this.prisma.course.findFirst({ where: { id: courseId, publicado: true } });
    if (!course) throw new NotFoundException('Curso não encontrado');

    const jaComprado = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (jaComprado?.statusPagamento === StatusPagamento.PAGO) {
      throw new ConflictException('Você já possui este curso');
    }

    const enrollment = await this.prisma.enrollment.upsert({
      where: { userId_courseId: { userId, courseId } },
      create: {
        userId,
        courseId,
        statusPagamento: StatusPagamento.PENDENTE,
        valorPagoCentavos: course.precoCentavos,
      },
      update: { statusPagamento: StatusPagamento.PENDENTE, valorPagoCentavos: course.precoCentavos },
    });

    const frontendUrl = this.config.get<string>('FRONTEND_URL');
    const session = await this.stripe.checkout.sessions.create({
      mode: 'payment',
      payment_method_types: ['card', 'boleto'],
      line_items: [
        {
          price_data: {
            currency: 'brl',
            product_data: { name: course.titulo },
            unit_amount: course.precoCentavos,
          },
          quantity: 1,
        },
      ],
      metadata: { enrollmentId: enrollment.id },
      success_url: `${frontendUrl}/pagamento/sucesso?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontendUrl}/pagamento/cancelado`,
    });

    await this.prisma.enrollment.update({
      where: { id: enrollment.id },
      data: { stripeSessionId: session.id },
    });

    return { checkoutUrl: session.url };
  }

  constructWebhookEvent(rawBody: Buffer, signature: string) {
    const secret = this.config.get<string>('STRIPE_WEBHOOK_SECRET') ?? '';
    try {
      return this.stripe.webhooks.constructEvent(rawBody, signature, secret);
    } catch {
      throw new BadRequestException('Assinatura do webhook inválida');
    }
  }

  async handleWebhookEvent(event: Stripe.Event) {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        const enrollmentId = session.metadata?.enrollmentId;
        if (enrollmentId) {
          await this.prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { statusPagamento: StatusPagamento.PAGO },
          });
        }
        break;
      }
      case 'checkout.session.expired': {
        const session = event.data.object as Stripe.Checkout.Session;
        const enrollmentId = session.metadata?.enrollmentId;
        if (enrollmentId) {
          await this.prisma.enrollment.update({
            where: { id: enrollmentId },
            data: { statusPagamento: StatusPagamento.CANCELADO },
          });
        }
        break;
      }
    }
    return { received: true };
  }
}
