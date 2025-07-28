import { Module } from '@nestjs/common';
import { ReservationsService } from './reservations.service.js';
import { ReservationsController } from './reservations.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';
import { InventoryModule } from '../inventory/inventory.module.js';
import { CommunicationsModule } from '../communications/communications.module.js';

@Module({
  imports: [PrismaModule, InventoryModule, CommunicationsModule],
  providers: [ReservationsService],
  controllers: [ReservationsController],
  exports: [ReservationsService],
})
export class ReservationsModule {}
