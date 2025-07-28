import { Module } from '@nestjs/common';
import { VisitorsController } from './visitors.controller.js';
import { VisitorsService } from './visitors.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [VisitorsController],
  providers: [VisitorsService, PrismaService],
})
export class VisitorsModule {}