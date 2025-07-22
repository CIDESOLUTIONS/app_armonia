import { Module } from '@nestjs/common';
import { BankReconciliationService } from './bank-reconciliation.service';
import { BankReconciliationController } from './bank-reconciliation.controller';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [BankReconciliationController],
  providers: [BankReconciliationService, PrismaClientManager, PrismaService],
  exports: [BankReconciliationService],
})
export class BankReconciliationModule {}