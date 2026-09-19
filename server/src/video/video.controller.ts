import { Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Role } from '@prisma/client';
import { VideoService } from './video.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/roles.guard.js';
import { Roles } from '../auth/decorators/roles.decorator.js';
import { CurrentUser } from '../auth/decorators/current-user.decorator.js';

@Controller()
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('admin/video/upload-url')
  criarUploadUrl() {
    return this.videoService.createUploadUrl();
  }

  @UseGuards(JwtAuthGuard)
  @Get('lessons/:id/playback')
  playback(@CurrentUser() user: { userId: string }, @Param('id') lessonId: string) {
    return this.videoService.getPlaybackForLesson(user.userId, lessonId);
  }
}
