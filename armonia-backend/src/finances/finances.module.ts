import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service';
import { FinancesController } from './finances.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { CommunicationsModule } from '../communications/communications.module'; // Added

@Module({
  imports: [PrismaModule, CommunicationsModule], // Added CommunicationsModule
  providers: [FinancesService],
  controllers: [FinancesController],
  exports: [FinancesService], // Added export for FinancesService if other modules need it
})
export class FinancesModule {}
