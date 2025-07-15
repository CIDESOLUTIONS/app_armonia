import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [MarketplaceController],
  providers: [MarketplaceService, PrismaClientManager, PrismaService],
})
export class MarketplaceModule {}
