import { Module } from '@nestjs/common';
import { ProgressService } from './progress.service.js';
import { ProgressController } from './progress.controller.js';
import { AuthModule } from '../auth/auth.module.js';
import { EnrollmentsModule } from '../enrollments/enrollments.module.js';
import { BadgesModule } from '../badges/badges.module.js';

@Module({
  imports: [AuthModule, EnrollmentsModule, BadgesModule],
  controllers: [ProgressController],
  providers: [ProgressService],
})
export class ProgressModule {}
