import { Module } from '@nestjs/common';
import { PaymentGatewaysController } from './payment-gateways.controller';
import { PaymentGatewaysService } from './payment-gateways.service';
import { PrismaModule } from '../prisma/prisma.module'; // Ensure PrismaModule is imported

@Module({
  imports: [PrismaModule], // Import PrismaModule
  controllers: [PaymentGatewaysController],
  providers: [PaymentGatewaysService],
  exports: [PaymentGatewaysService], // Export the service if it's used by other modules
})
export class PaymentGatewaysModule {}
