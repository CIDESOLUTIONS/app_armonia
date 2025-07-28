import { Module } from '@nestjs/common';
import { MicroCreditController } from './micro-credit.controller.js';
import { MicroCreditService } from './micro-credit.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MicroCreditController],
  providers: [MicroCreditService, PrismaService],
  exports: [MicroCreditService],
})
export class MicroCreditModule {}