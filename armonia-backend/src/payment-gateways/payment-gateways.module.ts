import { Module } from '@nestjs/common';
import { PaymentGatewaysService } from './payment-gateways.service';
import { PaymentGatewaysController } from './payment-gateways.controller';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  providers: [PaymentGatewaysService, PrismaClientManager, PrismaService],
  controllers: [PaymentGatewaysController],
  exports: [PaymentGatewaysService],
})
export class PaymentGatewaysModule {}
