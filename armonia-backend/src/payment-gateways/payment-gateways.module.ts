import { Module } from '@nestjs/common';
import { PaymentGatewaysController } from './payment-gateways.controller.js';
import { PaymentGatewaysService } from './payment-gateways.service.js';

@Module({
  controllers: [PaymentGatewaysController],
  providers: [PaymentGatewaysService],
})
export class PaymentGatewaysModule {}
