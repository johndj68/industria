import { Test } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import { AppModule } from '../../src/app.module.js';

export async function createTestApp(
  opts: { disableThrottle?: boolean } = {},
): Promise<INestApplication> {
  const disableThrottle = opts.disableThrottle ?? true;
  const builder = Test.createTestingModule({ imports: [AppModule] });

  if (disableThrottle) {
    builder.overrideProvider(APP_GUARD).useValue({ canActivate: () => true });
  }

  const moduleFixture = await builder.compile();

  const app = moduleFixture.createNestApplication({ rawBody: true });
  app.useGlobalPipes(
    new ValidationPipe({ whitelist: true, transform: true, forbidNonWhitelisted: true }),
  );
  await app.init();
  return app;
}

const prisma = new PrismaClient();

export async function limparBanco() {
  await prisma.$transaction([
    prisma.userBadge.deleteMany(),
    prisma.lessonProgress.deleteMany(),
    prisma.enrollment.deleteMany(),
    prisma.passwordResetToken.deleteMany(),
    prisma.lesson.deleteMany(),
    prisma.module.deleteMany(),
    prisma.course.deleteMany(),
    prisma.badge.deleteMany(),
    prisma.user.deleteMany(),
  ]);
}

export async function desconectarBanco() {
  await prisma.$disconnect();
}

export async function registrar(
  app: INestApplication,
  overrides: { email?: string; senha?: string; nome?: string } = {},
) {
  const dados = {
    email: overrides.email ?? `usuario-${Date.now()}-${Math.random().toString(36).slice(2)}@teste.com`,
    senha: overrides.senha ?? '123456',
    nome: overrides.nome ?? 'Usuário Teste',
  };
  const res = await request(app.getHttpServer()).post('/auth/register').send(dados).expect(201);
  return { ...dados, accessToken: res.body.accessToken, refreshToken: res.body.refreshToken };
}

export async function registrarAdmin(
  app: INestApplication,
  overrides: { email?: string; senha?: string; nome?: string } = {},
) {
  const user = await registrar(app, overrides);
  await prisma.user.update({ where: { email: user.email }, data: { role: 'ADMIN' } });

  const login = await request(app.getHttpServer())
    .post('/auth/login')
    .send({ email: user.email, senha: user.senha })
    .expect(201);

  return { ...user, accessToken: login.body.accessToken };
}

export { prisma };
