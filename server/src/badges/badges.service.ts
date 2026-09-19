import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';

export enum CriterioBadge {
  PRIMEIRA_AULA = 'PRIMEIRA_AULA',
  CURSO_CONCLUIDO = 'CURSO_CONCLUIDO',
  DEZ_AULAS = 'DEZ_AULAS',
}

@Injectable()
export class BadgesService {
  constructor(private readonly prisma: PrismaService) {}

  private async awardIfNotHas(userId: string, criterio: CriterioBadge) {
    const badge = await this.prisma.badge.findFirst({ where: { criterio } });
    if (!badge) return null;

    const jaTem = await this.prisma.userBadge.findUnique({
      where: { userId_badgeId: { userId, badgeId: badge.id } },
    });
    if (jaTem) return null;

    await this.prisma.userBadge.create({ data: { userId, badgeId: badge.id } });
    return badge;
  }

  async checkAndAwardAfterProgress(userId: string, courseId: string) {
    const concedidas = [];

    const totalConcluidasGeral = await this.prisma.lessonProgress.count({
      where: { userId, concluida: true },
    });

    if (totalConcluidasGeral === 1) {
      const badge = await this.awardIfNotHas(userId, CriterioBadge.PRIMEIRA_AULA);
      if (badge) concedidas.push(badge);
    }

    if (totalConcluidasGeral === 10) {
      const badge = await this.awardIfNotHas(userId, CriterioBadge.DEZ_AULAS);
      if (badge) concedidas.push(badge);
    }

    const totalAulasCurso = await this.prisma.lesson.count({
      where: { module: { courseId } },
    });
    const concluidasCurso = await this.prisma.lessonProgress.count({
      where: { userId, concluida: true, lesson: { module: { courseId } } },
    });

    if (totalAulasCurso > 0 && concluidasCurso === totalAulasCurso) {
      const badge = await this.awardIfNotHas(userId, CriterioBadge.CURSO_CONCLUIDO);
      if (badge) concedidas.push(badge);
    }

    return concedidas;
  }
}
