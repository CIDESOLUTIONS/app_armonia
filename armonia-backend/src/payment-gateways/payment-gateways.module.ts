import { Module } from '@nestjs/common';
import { PaymentGatewaysService } from './payment-gateways.service';
import { PaymentGatewaysController } from './payment-gateways.controller';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [PaymentGatewaysService, PrismaService],
  controllers: [PaymentGatewaysController],
  exports: [PaymentGatewaysService],
})
export class PaymentGatewaysModule {}
