import { Module } from '@nestjs/common';
import { MicroCreditController } from './micro-credit.controller';
import { MicroCreditService } from './micro-credit.service';
import { PrismaClientManager } from '../../prisma/prisma-client-manager';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  controllers: [MicroCreditController],
  providers: [MicroCreditService, PrismaClientManager, PrismaService],
  exports: [MicroCreditService],
})
export class MicroCreditModule {}
