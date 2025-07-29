import { Module } from '@nestjs/common';
import { MarketplaceController } from './marketplace.controller.js';
import { MarketplaceService } from './marketplace.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { MarketplaceGateway } from './marketplace.gateway.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [MarketplaceController],
  providers: [MarketplaceService, PrismaService, MarketplaceGateway],
})
export class MarketplaceModule {}
