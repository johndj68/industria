import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { afterAll, afterEach, beforeEach, describe, expect, it } from 'vitest';
import { createTestApp, limparBanco, desconectarBanco, registrar, registrarAdmin } from './utils/test-app.js';

describe('Courses (e2e)', () => {
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

  it('aluno comum não consegue criar curso', async () => {
    const aluno = await registrar(app);
    await request(app.getHttpServer())
      .post('/admin/courses')
      .set('Authorization', `Bearer ${aluno.accessToken}`)
      .send({ titulo: 'X', slug: 'x', descricao: '1234567890', precoCentavos: 100 })
      .expect(403);
  });

  it('admin cria curso, não aparece público até publicar', async () => {
    const admin = await registrarAdmin(app);

    const criado = await request(app.getHttpServer())
      .post('/admin/courses')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({
        titulo: 'Curso Teste',
        slug: 'curso-teste',
        descricao: 'Descrição de teste do curso',
        precoCentavos: 9900,
      })
      .expect(201);

    const listaPublica = await request(app.getHttpServer()).get('/courses').expect(200);
    expect(listaPublica.body.find((c: { slug: string }) => c.slug === 'curso-teste')).toBeUndefined();

    await request(app.getHttpServer())
      .patch(`/admin/courses/${criado.body.id}`)
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({ publicado: true })
      .expect(200);

    const listaDepois = await request(app.getHttpServer()).get('/courses').expect(200);
    expect(listaDepois.body.find((c: { slug: string }) => c.slug === 'curso-teste')).toBeDefined();
  });

  it('bloqueia slug duplicado', async () => {
    const admin = await registrarAdmin(app);
    const dados = {
      titulo: 'Curso A',
      slug: 'slug-repetido',
      descricao: 'Descrição válida aqui',
      precoCentavos: 1000,
    };
    await request(app.getHttpServer())
      .post('/admin/courses')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send(dados)
      .expect(201);

    await request(app.getHttpServer())
      .post('/admin/courses')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({ ...dados, titulo: 'Curso B' })
      .expect(409);
  });

  it('detalhe público não expõe cfVideoId da aula', async () => {
    const admin = await registrarAdmin(app);

    const curso = await request(app.getHttpServer())
      .post('/admin/courses')
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({
        titulo: 'Curso Vídeo',
        slug: 'curso-video',
        descricao: 'Descrição válida aqui',
        precoCentavos: 5000,
        publicado: true,
      })
      .expect(201);

    const modulo = await request(app.getHttpServer())
      .post(`/admin/courses/${curso.body.id}/modules`)
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({ titulo: 'Módulo 1', ordem: 1 })
      .expect(201);

    await request(app.getHttpServer())
      .post(`/admin/modules/${modulo.body.id}/lessons`)
      .set('Authorization', `Bearer ${admin.accessToken}`)
      .send({ titulo: 'Aula 1', ordem: 1, cfVideoId: 'segredo-video-uid' })
      .expect(201);

    const detalhe = await request(app.getHttpServer()).get('/courses/curso-video').expect(200);
    const aula = detalhe.body.modulos[0].aulas[0];
    expect(aula.cfVideoId).toBeUndefined();
    expect(aula.titulo).toBe('Aula 1');
  });
});
