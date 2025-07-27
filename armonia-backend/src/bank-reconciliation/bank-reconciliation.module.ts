import { Module } from '@nestjs/common';
import { BankReconciliationService } from './bank-reconciliation.service';
import { BankReconciliationController } from './bank-reconciliation.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [BankReconciliationController],
  providers: [BankReconciliationService, PrismaService],
  exports: [BankReconciliationService],
})
export class BankReconciliationModule {}