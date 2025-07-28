import { Module } from '@nestjs/common';
import { FinancesService } from './finances.service.js';
import { FinancesController } from './finances.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommunicationsService } from '../communications/communications.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [
    FinancesService,
    PrismaService,
    CommunicationsService,
  ],
  controllers: [FinancesController],
})
export class FinancesModule {}