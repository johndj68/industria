import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { EnrollmentsService } from '../enrollments/enrollments.service.js';
import { BadgesService } from '../badges/badges.service.js';
import type { MarkProgressDto } from './dto/mark-progress.dto.js';

function calcularNivel(xp: number): number {
  return Math.floor(xp / 100) + 1;
}

@Injectable()
export class ProgressService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly enrollments: EnrollmentsService,
    private readonly badges: BadgesService,
  ) {}

  async markLessonComplete(userId: string, lessonId: string, dto: MarkProgressDto) {
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
      include: { module: { include: { course: true } } },
    });
    if (!lesson) throw new NotFoundException('Aula não encontrada');

    const courseId = lesson.module.course.id;
    await this.enrollments.assertPago(userId, courseId);

    const progressoExistente = await this.prisma.lessonProgress.findUnique({
      where: { userId_lessonId: { userId, lessonId } },
    });

    if (progressoExistente?.concluida) {
      if (dto.segundosAssistidos !== undefined) {
        await this.prisma.lessonProgress.update({
          where: { userId_lessonId: { userId, lessonId } },
          data: { segundosAssistidos: dto.segundosAssistidos },
        });
      }
      const user = await this.prisma.user.findUniqueOrThrow({ where: { id: userId } });
      return {
        concluida: true,
        jaEstavaConcluida: true,
        xpGanho: 0,
        xpTotal: user.xp,
        nivel: user.nivel,
        badgesConquistadas: [],
      };
    }

    await this.prisma.lessonProgress.upsert({
      where: { userId_lessonId: { userId, lessonId } },
      create: {
        userId,
        lessonId,
        concluida: true,
        segundosAssistidos: dto.segundosAssistidos ?? 0,
      },
      update: {
        concluida: true,
        segundosAssistidos: dto.segundosAssistidos ?? 0,
      },
    });

    const userAtualizado = await this.prisma.user.update({
      where: { id: userId },
      data: { xp: { increment: lesson.xpRecompensa } },
    });
    const novoNivel = calcularNivel(userAtualizado.xp);
    if (novoNivel !== userAtualizado.nivel) {
      await this.prisma.user.update({ where: { id: userId }, data: { nivel: novoNivel } });
    }

    const badgesConquistadas = await this.badges.checkAndAwardAfterProgress(userId, courseId);

    return {
      concluida: true,
      jaEstavaConcluida: false,
      xpGanho: lesson.xpRecompensa,
      xpTotal: userAtualizado.xp,
      nivel: novoNivel,
      badgesConquistadas,
    };
  }

  async getGamificacao(userId: string) {
    const user = await this.prisma.user.findUniqueOrThrow({
      where: { id: userId },
      select: {
        xp: true,
        nivel: true,
        badges: { include: { badge: true }, orderBy: { conquistadoEm: 'desc' } },
      },
    });
    return {
      xp: user.xp,
      nivel: user.nivel,
      badges: user.badges.map((ub) => ({
        nome: ub.badge.nome,
        icone: ub.badge.icone,
        conquistadoEm: ub.conquistadoEm,
      })),
    };
  }

  async getProgressoCurso(userId: string, courseId: string) {
    const progresso = await this.prisma.lessonProgress.findMany({
      where: { userId, lesson: { module: { courseId } } },
      select: { lessonId: true, concluida: true, segundosAssistidos: true },
    });
    return progresso;
  }
}
