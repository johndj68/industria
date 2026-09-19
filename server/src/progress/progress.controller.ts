import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ProgressService } from './progress.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';
import { MarkProgressDto } from './dto/mark-progress.dto.js';

@UseGuards(JwtAuthGuard)
@Controller()
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post('lessons/:id/progress')
  marcarConcluida(
    @CurrentUser() user: { userId: string },
    @Param('id') lessonId: string,
    @Body() dto: MarkProgressDto,
  ) {
    return this.progressService.markLessonComplete(user.userId, lessonId, dto);
  }

  @Get('me/gamificacao')
  gamificacao(@CurrentUser() user: { userId: string }) {
    return this.progressService.getGamificacao(user.userId);
  }

  @Get('courses/:courseId/progress')
  progressoCurso(@CurrentUser() user: { userId: string }, @Param('courseId') courseId: string) {
    return this.progressService.getProgressoCurso(user.userId, courseId);
  }
}
