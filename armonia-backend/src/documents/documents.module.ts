import { Module } from '@nestjs/common';
import { DocumentsController } from './documents.controller';
import { DocumentsService } from './documents.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [DocumentsController],
  providers: [DocumentsService, PrismaClientManager, PrismaService],
})
export class DocumentsModule {}
