import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService, PrismaClientManager, PrismaService],
})
export class PortfolioModule {}
