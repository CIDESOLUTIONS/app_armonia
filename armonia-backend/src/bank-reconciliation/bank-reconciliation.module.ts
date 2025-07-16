import { Module } from '@nestjs/common';
import { BankReconciliationService } from './bank-reconciliation.service';
import { BankReconciliationController } from './bank-reconciliation.controller';

@Module({
  providers: [BankReconciliationService],
  controllers: [BankReconciliationController],
})
export class BankReconciliationModule {}
