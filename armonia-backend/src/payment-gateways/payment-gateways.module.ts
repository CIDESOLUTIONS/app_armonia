import { Module } from '@nestjs/common';
import { PaymentGatewaysService } from './payment-gateways.service.js';
import { PaymentGatewaysController } from './payment-gateways.controller.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [PaymentGatewaysService, PrismaService],
  controllers: [PaymentGatewaysController],
  exports: [PaymentGatewaysService],
})
export class PaymentGatewaysModule {}