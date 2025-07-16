import { Module } from '@nestjs/common';
import { VisitorsController } from './visitors.controller';
import { VisitorsService } from './visitors.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [VisitorsController],
  providers: [VisitorsService, PrismaClientManager, PrismaService],
})
export class VisitorsModule {}
