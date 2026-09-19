import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const badges = [
  { nome: 'Primeira Aula', icone: '🎬', criterio: 'PRIMEIRA_AULA' },
  { nome: 'Curso Concluído', icone: '🏆', criterio: 'CURSO_CONCLUIDO' },
  { nome: 'Maratonista', icone: '🔥', criterio: 'DEZ_AULAS' },
];

for (const badge of badges) {
  const existente = await prisma.badge.findFirst({ where: { criterio: badge.criterio } });
  if (!existente) {
    await prisma.badge.create({ data: badge });
    console.log(`Badge criada: ${badge.nome}`);
  } else {
    console.log(`Badge já existe: ${badge.nome}`);
  }
}

await prisma.$disconnect();
