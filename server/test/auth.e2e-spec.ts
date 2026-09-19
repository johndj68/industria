import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, limparBanco, desconectarBanco } from './utils/test-app.js';

describe('Auth (e2e)', () => {
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

  it('cadastra um usuário e retorna tokens', async () => {
    const res = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'novo@teste.com', senha: '123456', nome: 'Novo Usuário' })
      .expect(201);

    expect(res.body.accessToken).toBeTypeOf('string');
    expect(res.body.refreshToken).toBeTypeOf('string');
  });

  it('bloqueia cadastro com email duplicado', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'dup@teste.com', senha: '123456', nome: 'Um' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'dup@teste.com', senha: '123456', nome: 'Dois' })
      .expect(409);
  });

  it('rejeita cadastro com senha curta', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'curta@teste.com', senha: '123', nome: 'Curta' })
      .expect(400);
  });

  it('login com senha errada retorna 401', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'login@teste.com', senha: '123456', nome: 'Login' })
      .expect(201);

    await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'login@teste.com', senha: 'errada' })
      .expect(401);
  });

  it('login correto e acesso a rota protegida', async () => {
    await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'protegida@teste.com', senha: '123456', nome: 'Protegida' })
      .expect(201);

    const login = await request(app.getHttpServer())
      .post('/auth/login')
      .send({ email: 'protegida@teste.com', senha: '123456' })
      .expect(201);

    const me = await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${login.body.accessToken}`)
      .expect(200);

    expect(me.body.email).toBe('protegida@teste.com');
    expect(me.body.passwordHash).toBeUndefined();
  });

  it('rejeita rota protegida sem token', async () => {
    await request(app.getHttpServer()).get('/auth/me').expect(401);
  });

  it('refresh emite novos tokens válidos', async () => {
    const registro = await request(app.getHttpServer())
      .post('/auth/register')
      .send({ email: 'refresh@teste.com', senha: '123456', nome: 'Refresh' })
      .expect(201);

    const refreshed = await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: registro.body.refreshToken })
      .expect(201);

    await request(app.getHttpServer())
      .get('/auth/me')
      .set('Authorization', `Bearer ${refreshed.body.accessToken}`)
      .expect(200);
  });

  it('rejeita refresh token inválido', async () => {
    await request(app.getHttpServer())
      .post('/auth/refresh')
      .send({ refreshToken: 'token-forjado' })
      .expect(401);
  });
});
