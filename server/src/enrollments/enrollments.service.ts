import { ForbiddenException, Injectable } from '@nestjs/common';
import { StatusPagamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class EnrollmentsService {
  constructor(private readonly prisma: PrismaService) {}

  async assertPago(userId: string, courseId: string) {
    const enrollment = await this.prisma.enrollment.findUnique({
      where: { userId_courseId: { userId, courseId } },
    });
    if (!enrollment || enrollment.statusPagamento !== StatusPagamento.PAGO) {
      throw new ForbiddenException('Você precisa comprar este curso para acessar este conteúdo');
    }
    return enrollment;
  }

  listMinhas(userId: string) {
    return this.prisma.enrollment.findMany({
      where: { userId },
      orderBy: { criadoEm: 'desc' },
      select: {
        statusPagamento: true,
        criadoEm: true,
        course: { select: { id: true, titulo: true, slug: true, capaUrl: true, descricao: true } },
      },
    });
  }
}
