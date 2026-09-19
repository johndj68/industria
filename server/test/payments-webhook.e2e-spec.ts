import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import Stripe from 'stripe';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, limparBanco, desconectarBanco, registrar, prisma } from './utils/test-app.js';

async function criarCursoEMatricula(userId: string) {
  const course = await prisma.course.create({
    data: {
      titulo: 'Curso Webhook',
      slug: `curso-webhook-${Date.now()}`,
      descricao: 'Descrição válida aqui',
      precoCentavos: 19900,
      publicado: true,
    },
  });
  const enrollment = await prisma.enrollment.create({
    data: { userId, courseId: course.id, statusPagamento: 'PENDENTE' },
  });
  return { course, enrollment };
}

function assinar(payloadObj: unknown) {
  const payload = JSON.stringify(payloadObj);
  const signature = Stripe.webhooks.generateTestHeaderString({
    payload,
    secret: process.env.STRIPE_WEBHOOK_SECRET!,
  });
  return { payload: payloadObj, signature };
}

describe('Payments webhook (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    await limparBanco();
    app = await createTestApp();
  });

  afterEach(async () => {
    await app.close();
  });

  afterAll(async () => {
    await desconectarBanco();
  });

  it('rejeita webhook sem header de assinatura', async () => {
    await request(app.getHttpServer())
      .post('/payments/webhook')
      .send({ type: 'checkout.session.completed', data: { object: {} } })
      .expect(400);
  });

  it('rejeita webhook com assinatura forjada', async () => {
    await request(app.getHttpServer())
      .post('/payments/webhook')
      .set('stripe-signature', 't=1,v1=forjado')
      .send({ type: 'checkout.session.completed', data: { object: {} } })
      .expect(400);
  });

  it('checkout.session.completed libera a matrícula', async () => {
    const user = await registrar(app);
    const dbUser = await prisma.user.findUniqueOrThrow({ where: { email: user.email } });
    const { enrollment } = await criarCursoEMatricula(dbUser.id);

    const { payload, signature } = assinar({
      id: 'evt_test',
      type: 'checkout.session.completed',
      data: { object: { metadata: { enrollmentId: enrollment.id } } },
    });

    await request(app.getHttpServer())
      .post('/payments/webhook')
      .set('stripe-signature', signature)
      .send(payload)
      .expect(201);

    const atualizado = await prisma.enrollment.findUniqueOrThrow({ where: { id: enrollment.id } });
    expect(atualizado.statusPagamento).toBe('PAGO');
  });

  it('checkout.session.expired cancela a matrícula', async () => {
    const user = await registrar(app);
    const dbUser = await prisma.user.findUniqueOrThrow({ where: { email: user.email } });
    const { enrollment } = await criarCursoEMatricula(dbUser.id);

    const { payload, signature } = assinar({
      id: 'evt_test_2',
      type: 'checkout.session.expired',
      data: { object: { metadata: { enrollmentId: enrollment.id } } },
    });

    await request(app.getHttpServer())
      .post('/payments/webhook')
      .set('stripe-signature', signature)
      .send(payload)
      .expect(201);

    const atualizado = await prisma.enrollment.findUniqueOrThrow({ where: { id: enrollment.id } });
    expect(atualizado.statusPagamento).toBe('CANCELADO');
  });
});
