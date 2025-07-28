import { Module } from '@nestjs/common';
import { FintechService } from './fintech.service.js';
import { FintechController } from './fintech.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [FintechService],
  controllers: [FintechController],
  exports: [FintechService],
})
export class FintechModule {}
