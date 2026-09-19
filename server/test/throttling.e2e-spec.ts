import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, beforeAll, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, limparBanco, desconectarBanco } from './utils/test-app.js';

describe('Rate limiting (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    app = await createTestApp({ disableThrottle: false });
  });

  beforeEach(async () => {
    await limparBanco();
  });

  afterAll(async () => {
    await app.close();
    await desconectarBanco();
  });

  it('bloqueia login após 5 tentativas em menos de 1 minuto', async () => {
    const tentativa = () =>
      request(app.getHttpServer())
        .post('/auth/login')
        .send({ email: 'naoexiste@teste.com', senha: 'x' });

    for (let i = 0; i < 5; i++) {
      const res = await tentativa();
      expect(res.status).toBe(401);
    }

    const sexta = await tentativa();
    expect(sexta.status).toBe(429);
  });

  it('bloqueia forgot-password após 3 tentativas em menos de 1 minuto', async () => {
    const tentativa = () =>
      request(app.getHttpServer())
        .post('/auth/forgot-password')
        .send({ email: 'qualquer@teste.com' });

    for (let i = 0; i < 3; i++) {
      const res = await tentativa();
      expect(res.status).toBe(201);
    }

    const quarta = await tentativa();
    expect(quarta.status).toBe(429);
  });
});
