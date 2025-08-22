import { Module } from '@nestjs/common';
import { PaymentGatewaysController } from './payment-gateways.controller';
import { PaymentGatewaysService } from './payment-gateways.service';
import { PaymentProcessingService } from './payment-processing.service';
import { WebhookService } from './webhook.service';
import { StripeService } from './integrations/stripe.service';
import { PayPalService } from './integrations/paypal.service';
import { PSEService } from './integrations/pse.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [PaymentGatewaysController],
  providers: [
    PaymentGatewaysService,
    PaymentProcessingService,
    WebhookService,
    StripeService,
    PayPalService,
    PSEService,
  ],
  exports: [
    PaymentGatewaysService,
    PaymentProcessingService,
    WebhookService,
    StripeService,
    PayPalService,
    PSEService,
  ],
})
export class PaymentGatewaysModule {}