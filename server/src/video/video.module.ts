import { Module } from '@nestjs/common';
import { VideoService } from './video.service.js';
import { VideoController } from './video.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { EnrollmentsModule } from '../enrollments/enrollments.module.js';

@Module({
  imports: [AuthModule, EnrollmentsModule],
  controllers: [VideoController],
  providers: [VideoService],
})
export class VideoModule {}
