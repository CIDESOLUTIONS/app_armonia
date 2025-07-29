import { Module } from '@nestjs/common';
import { BankReconciliationService } from './bank-reconciliation.service.js';
import { BankReconciliationController } from './bank-reconciliation.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [BankReconciliationController],
  providers: [BankReconciliationService, PrismaService],
  exports: [BankReconciliationService],
})
export class BankReconciliationModule {}
