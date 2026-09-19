import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, limparBanco, desconectarBanco, registrar, registrarAdmin, prisma } from './utils/test-app.js';

async function criarCursoComAula(app: INestApplication, admin: { accessToken: string }) {
  const curso = await request(app.getHttpServer())
    .post('/admin/courses')
    .set('Authorization', `Bearer ${admin.accessToken}`)
    .send({
      titulo: 'Curso Gating',
      slug: `curso-gating-${Date.now()}`,
      descricao: 'Descrição válida aqui',
      precoCentavos: 19900,
      publicado: true,
    })
    .expect(201);

  const modulo = await request(app.getHttpServer())
    .post(`/admin/courses/${curso.body.id}/modules`)
    .set('Authorization', `Bearer ${admin.accessToken}`)
    .send({ titulo: 'Módulo único', ordem: 1 })
    .expect(201);

  const aula = await request(app.getHttpServer())
    .post(`/admin/modules/${modulo.body.id}/lessons`)
    .set('Authorization', `Bearer ${admin.accessToken}`)
    .send({ titulo: 'Aula única', ordem: 1, cfVideoId: 'video-uid-teste', xpRecompensa: 10 })
    .expect(201);

  return { curso: curso.body, aula: aula.body };
}

describe('Video playback e Progress (e2e)', () => {
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

  it('bloqueia playback sem matrícula paga', async () => {
    const admin = await registrarAdmin(app);
    const aluno = await registrar(app);
    const { aula } = await criarCursoComAula(app, admin);

    await request(app.getHttpServer())
      .get(`/lessons/${aula.id}/playback`)
      .set('Authorization', `Bearer ${aluno.accessToken}`)
      .expect(403);
  });

  it('libera playback com matrícula paga e gera token assinado', async () => {
    const admin = await registrarAdmin(app);
    const aluno = await registrar(app);
    const { curso, aula } = await criarCursoComAula(app, admin);

    const dbAluno = await prisma.user.findUniqueOrThrow({ where: { email: aluno.email } });
    await prisma.enrollment.create({
      data: { userId: dbAluno.id, courseId: curso.id, statusPagamento: 'PAGO' },
    });

    const res = await request(app.getHttpServer())
      .get(`/lessons/${aula.id}/playback`)
      .set('Authorization', `Bearer ${aluno.accessToken}`)
      .expect(200);

    expect(res.body.hlsUrl).toContain('video-uid-teste');
    expect(res.body.hlsUrl).toContain('token=');
  });

  it('bloqueia marcar progresso sem matrícula paga', async () => {
    const admin = await registrarAdmin(app);
    const aluno = await registrar(app);
    const { aula } = await criarCursoComAula(app, admin);

    await request(app.getHttpServer())
      .post(`/lessons/${aula.id}/progress`)
      .set('Authorization', `Bearer ${aluno.accessToken}`)
      .send({})
      .expect(403);
  });

  it('credita XP uma vez e é idempotente na segunda chamada', async () => {
    const admin = await registrarAdmin(app);
    const aluno = await registrar(app);
    const { curso, aula } = await criarCursoComAula(app, admin);

    const dbAluno = await prisma.user.findUniqueOrThrow({ where: { email: aluno.email } });
    await prisma.enrollment.create({
      data: { userId: dbAluno.id, courseId: curso.id, statusPagamento: 'PAGO' },
    });

    const primeira = await request(app.getHttpServer())
      .post(`/lessons/${aula.id}/progress`)
      .set('Authorization', `Bearer ${aluno.accessToken}`)
      .send({ segundosAssistidos: 120 })
      .expect(201);

    expect(primeira.body.xpGanho).toBe(10);
    expect(primeira.body.xpTotal).toBe(10);
    expect(primeira.body.jaEstavaConcluida).toBe(false);

    const segunda = await request(app.getHttpServer())
      .post(`/lessons/${aula.id}/progress`)
      .set('Authorization', `Bearer ${aluno.accessToken}`)
      .send({ segundosAssistidos: 120 })
      .expect(201);

    expect(segunda.body.xpGanho).toBe(0);
    expect(segunda.body.xpTotal).toBe(10);
    expect(segunda.body.jaEstavaConcluida).toBe(true);
  });

  it('concede badges de primeira aula e curso concluído', async () => {
    await prisma.badge.createMany({
      data: [
        { nome: 'Primeira Aula', icone: '🎬', criterio: 'PRIMEIRA_AULA' },
        { nome: 'Curso Concluído', icone: '🏆', criterio: 'CURSO_CONCLUIDO' },
      ],
    });

    const admin = await registrarAdmin(app);
    const aluno = await registrar(app);
    const { curso, aula } = await criarCursoComAula(app, admin);

    const dbAluno = await prisma.user.findUniqueOrThrow({ where: { email: aluno.email } });
    await prisma.enrollment.create({
      data: { userId: dbAluno.id, courseId: curso.id, statusPagamento: 'PAGO' },
    });

    const res = await request(app.getHttpServer())
      .post(`/lessons/${aula.id}/progress`)
      .set('Authorization', `Bearer ${aluno.accessToken}`)
      .send({})
      .expect(201);

    const nomes = res.body.badgesConquistadas.map((b: { nome: string }) => b.nome);
    expect(nomes).toContain('Primeira Aula');
    expect(nomes).toContain('Curso Concluído');
  });
});
