import { Controller, Get, Param } from '@nestjs/common';
import { CoursesService } from './courses.service.js';

@Controller('courses')
export class CoursesController {
  constructor(private readonly coursesService: CoursesService) {}

  @Get()
  listar() {
    return this.coursesService.listPublicados();
  }

  @Get(':slug')
  detalhe(@Param('slug') slug: string) {
    return this.coursesService.getPublicadoBySlug(slug);
  }
}
