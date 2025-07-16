import { Module } from '@nestjs/common';
import { FintechController } from './fintech.controller';
import { FintechService } from './fintech.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [FintechController],
  providers: [FintechService, PrismaClientManager, PrismaService],
})
export class FintechModule {}
