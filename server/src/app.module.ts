import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { PrismaModule } from './prisma/prisma.module.js';
import { MailModule } from './mail/mail.module.js';
import { AuthModule } from './auth/auth.module.js';
import { UsersModule } from './users/users.module.js';
import { AdminUsersModule } from './users/admin-users.module.js';
import { CoursesModule } from './courses/courses.module.js';
import { PaymentsModule } from './payments/payments.module.js';
import { VideoModule } from './video/video.module.js';
import { ProgressModule } from './progress/progress.module.js';
import { DashboardModule } from './dashboard/dashboard.module.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    MailModule,
    UsersModule,
    AuthModule,
    AdminUsersModule,
    CoursesModule,
    PaymentsModule,
    VideoModule,
    ProgressModule,
    DashboardModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
