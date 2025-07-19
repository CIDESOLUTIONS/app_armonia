import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller';
import { MarketplaceService } from './marketplace.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { MarketplaceGateway } from './marketplace.gateway';

@Module({
  controllers: [MarketplaceController],
  providers: [
    MarketplaceService,
    PrismaClientManager,
    PrismaService,
    MarketplaceGateway,
  ],
})
export class MarketplaceModule {}
