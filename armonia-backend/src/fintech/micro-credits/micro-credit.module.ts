import { Module } from '@nestjs/common';
import { MicroCreditController } from './micro-credit.controller';
import { MicroCreditService } from './micro-credit.service';
import { PrismaService } from '../../prisma/prisma.service';
import { PrismaModule } from '../../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MicroCreditController],
  providers: [MicroCreditService, PrismaService],
  exports: [MicroCreditService],
})
export class MicroCreditModule {}
