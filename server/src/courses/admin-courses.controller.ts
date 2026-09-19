import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { CoursesService } from './courses.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CreateCourseDto } from './dto/create-course.dto.js';
import { UpdateCourseDto } from './dto/update-course.dto.js';
import { CreateModuleDto } from './dto/create-module.dto.js';
import { UpdateModuleDto } from './dto/update-module.dto.js';
import { CreateLessonDto } from './dto/create-lesson.dto.js';
import { UpdateLessonDto } from './dto/update-lesson.dto.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.ADMIN)
@Controller('admin')
export class AdminCoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get('courses')
  listar() {
    return this.coursesService.listTodos();
  }

  @Get('courses/:id')
  detalhe(@Param('id') id: string) {
    return this.coursesService.getCompletoById(id);
  }

  @Post('courses')
  criar(@Body() dto: CreateCourseDto) {
    return this.coursesService.createCourse(dto);
  }

  @Patch('courses/:id')
  atualizar(@Param('id') id: string, @Body() dto: UpdateCourseDto) {
    return this.coursesService.updateCourse(id, dto);
  }

  @Delete('courses/:id')
  remover(@Param('id') id: string) {
    return this.coursesService.deleteCourse(id);
  }

  @Post('courses/:courseId/modules')
  criarModulo(@Param('courseId') courseId: string, @Body() dto: CreateModuleDto) {
    return this.coursesService.createModule(courseId, dto);
  }

  @Patch('modules/:id')
  atualizarModulo(@Param('id') id: string, @Body() dto: UpdateModuleDto) {
    return this.coursesService.updateModule(id, dto);
  }

  @Delete('modules/:id')
  removerModulo(@Param('id') id: string) {
    return this.coursesService.deleteModule(id);
  }

  @Post('modules/:moduleId/lessons')
  criarAula(@Param('moduleId') moduleId: string, @Body() dto: CreateLessonDto) {
    return this.coursesService.createLesson(moduleId, dto);
  }

  @Patch('lessons/:id')
  atualizarAula(@Param('id') id: string, @Body() dto: UpdateLessonDto) {
    return this.coursesService.updateLesson(id, dto);
  }

  @Delete('lessons/:id')
  removerAula(@Param('id') id: string) {
    return this.coursesService.deleteLesson(id);
  }
}
