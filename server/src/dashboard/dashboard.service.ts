import { Injectable } from '@nestjs/common';
import { StatusPagamento } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';

@Injectable()
export class DashboardService {
  constructor(private readonly prisma: PrismaService) {}

  async getResumo() {
    const [totalUsuarios, totalCursos, agregadoPago, vendasRecentes, porCurso] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.course.count(),
      this.prisma.enrollment.aggregate({
        where: { statusPagamento: StatusPagamento.PAGO },
        _count: { _all: true },
        _sum: { valorPagoCentavos: true },
      }),
      this.prisma.enrollment.findMany({
        where: { statusPagamento: StatusPagamento.PAGO },
        orderBy: { atualizadoEm: 'desc' },
        take: 10,
        select: {
          id: true,
          valorPagoCentavos: true,
          atualizadoEm: true,
          user: { select: { nome: true, email: true } },
          course: { select: { titulo: true } },
        },
      }),
      this.prisma.enrollment.groupBy({
        by: ['courseId'],
        where: { statusPagamento: StatusPagamento.PAGO },
        _count: { _all: true },
        _sum: { valorPagoCentavos: true },
      }),
    ]);

    const cursos = await this.prisma.course.findMany({
      where: { id: { in: porCurso.map((p) => p.courseId) } },
      select: { id: true, titulo: true },
    });
    const tituloPorId = new Map(cursos.map((c) => [c.id, c.titulo]));

    return {
      totalUsuarios,
      totalCursos,
      totalMatriculasPagas: agregadoPago._count._all,
      receitaTotalCentavos: agregadoPago._sum.valorPagoCentavos ?? 0,
      vendasRecentes: vendasRecentes.map((v) => ({
        id: v.id,
        userNome: v.user.nome,
        userEmail: v.user.email,
        cursoTitulo: v.course.titulo,
        valorPagoCentavos: v.valorPagoCentavos ?? 0,
        dataPagamento: v.atualizadoEm,
      })),
      receitaPorCurso: porCurso
        .map((p) => ({
          cursoId: p.courseId,
          cursoTitulo: tituloPorId.get(p.courseId) ?? 'Curso removido',
          totalVendas: p._count._all,
          receitaCentavos: p._sum.valorPagoCentavos ?? 0,
        }))
        .sort((a, b) => b.receitaCentavos - a.receitaCentavos),
    };
  }
}
