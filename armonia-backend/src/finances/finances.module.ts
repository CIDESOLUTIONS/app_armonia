import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { ReconciliationService } from './finance/reconciliationService';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationService } from '../communications/communications.service';

@Module({
  providers: [FinancesService, ReconciliationService, PrismaClientManager, PrismaService, CommunicationService],
  controllers: [FinancesController],
})
export class FinancesModule {}
