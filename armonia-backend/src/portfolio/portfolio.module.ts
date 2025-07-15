import { Module } from '@nestjs/common';
import { PortfolioController } from './portfolio.controller';
import { PortfolioService } from './portfolio.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';

@Module({
  controllers: [PortfolioController],
  providers: [PortfolioService, PrismaClientManager],
})
export class PortfolioModule {}
