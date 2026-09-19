import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service.js';
import type { CreateCourseDto } from './dto/create-course.dto.js';
import type { UpdateCourseDto } from './dto/update-course.dto.js';
import type { CreateModuleDto } from './dto/create-module.dto.js';
import type { UpdateModuleDto } from './dto/update-module.dto.js';
import type { CreateLessonDto } from './dto/create-lesson.dto.js';
import type { UpdateLessonDto } from './dto/update-lesson.dto.js';

const LESSON_PUBLIC_SELECT = {
  id: true,
  titulo: true,
  ordem: true,
  duracaoSeg: true,
};

@Injectable()
export class CoursesService {
  constructor(private readonly prisma: PrismaService) {}

  private async handleUniqueSlug<T>(fn: () => Promise<T>): Promise<T> {
    try {
      return await fn();
    } catch (err) {
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('slug já está em uso');
      }
      throw err;
    }
  }

  // ---------- público ----------

  listPublicados() {
    return this.prisma.course.findMany({
      where: { publicado: true },
      orderBy: { criadoEm: 'desc' },
      select: {
        id: true,
        titulo: true,
        slug: true,
        descricao: true,
        precoCentavos: true,
        capaUrl: true,
      },
    });
  }

  async getPublicadoBySlug(slug: string) {
    const course = await this.prisma.course.findFirst({
      where: { slug, publicado: true },
      include: {
        modulos: {
          orderBy: { ordem: 'asc' },
          select: {
            id: true,
            titulo: true,
            ordem: true,
            aulas: { orderBy: { ordem: 'asc' }, select: LESSON_PUBLIC_SELECT },
          },
        },
      },
    });
    if (!course) throw new NotFoundException('Curso não encontrado');
    return course;
  }

  // ---------- admin: cursos ----------

  listTodos() {
    return this.prisma.course.findMany({ orderBy: { criadoEm: 'desc' } });
  }

  async getCompletoById(id: string) {
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: { modulos: { orderBy: { ordem: 'asc' }, include: { aulas: { orderBy: { ordem: 'asc' } } } } },
    });
    if (!course) throw new NotFoundException('Curso não encontrado');
    return course;
  }

  createCourse(dto: CreateCourseDto) {
    return this.handleUniqueSlug(() => this.prisma.course.create({ data: dto }));
  }

  async updateCourse(id: string, dto: UpdateCourseDto) {
    await this.getCompletoById(id);
    return this.handleUniqueSlug(() => this.prisma.course.update({ where: { id }, data: dto }));
  }

  async deleteCourse(id: string) {
    await this.getCompletoById(id);
    await this.prisma.course.delete({ where: { id } });
    return { ok: true };
  }

  // ---------- admin: módulos ----------

  private async getModuleOrThrow(id: string) {
    const module = await this.prisma.module.findUnique({ where: { id } });
    if (!module) throw new NotFoundException('Módulo não encontrado');
    return module;
  }

  async createModule(courseId: string, dto: CreateModuleDto) {
    await this.getCompletoById(courseId);
    return this.prisma.module.create({ data: { ...dto, courseId } });
  }

  async updateModule(id: string, dto: UpdateModuleDto) {
    await this.getModuleOrThrow(id);
    return this.prisma.module.update({ where: { id }, data: dto });
  }

  async deleteModule(id: string) {
    await this.getModuleOrThrow(id);
    await this.prisma.module.delete({ where: { id } });
    return { ok: true };
  }

  // ---------- admin: aulas ----------

  private async getLessonOrThrow(id: string) {
    const lesson = await this.prisma.lesson.findUnique({ where: { id } });
    if (!lesson) throw new NotFoundException('Aula não encontrada');
    return lesson;
  }

  async createLesson(moduleId: string, dto: CreateLessonDto) {
    await this.getModuleOrThrow(moduleId);
    return this.prisma.lesson.create({ data: { ...dto, moduleId } });
  }

  async updateLesson(id: string, dto: UpdateLessonDto) {
    await this.getLessonOrThrow(id);
    return this.prisma.lesson.update({ where: { id }, data: dto });
  }

  async deleteLesson(id: string) {
    await this.getLessonOrThrow(id);
    await this.prisma.lesson.delete({ where: { id } });
    return { ok: true };
  }
}
