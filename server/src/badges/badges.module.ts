import { Module } from '@nestjs/common';
import { BadgesService } from './badges.service.js';

@Module({
  providers: [BadgesService],
  exports: [BadgesService],
})
export class BadgesModule {}
