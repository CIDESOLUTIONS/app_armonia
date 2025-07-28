import { Module } from '@nestjs/common';
import { IncidentsService } from './incidents.service.js';
import { IncidentsController } from './incidents.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [IncidentsService],
  controllers: [IncidentsController],
  exports: [IncidentsService],
})
export class IncidentsModule {}
