import { Controller, Get, UseGuards } from '@nestjs/common';
import { EnrollmentsService } from './enrollments.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller('me/enrollments')
export class EnrollmentsController {
  constructor(private readonly enrollmentsService: EnrollmentsService) {}

  @Get()
  minhas(@CurrentUser() user: { userId: string }) {
    return this.enrollmentsService.listMinhas(user.userId);
  }
}
