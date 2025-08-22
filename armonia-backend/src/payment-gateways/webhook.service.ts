import {
  Injectable,
  Logger,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { StripeService } from './integrations/stripe.service';
import { PayPalService } from './integrations/paypal.service';
import { PSEService } from './integrations/pse.service';
import {
  PaymentStatus,
  PaymentGatewayType,
  TransactionType,
} from '../common/dto/payment-gateways.dto';

@Injectable()
export class WebhookService {
  private readonly logger = new Logger(WebhookService.name);

  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private paypalService: PayPalService,
    private pseService: PSEService,
  ) {}

  /**
   * Procesar webhook de Stripe
   */
  async processStripeWebhook(
    schemaName: string,
    payload: string,
    signature: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log('Processing Stripe webhook');

      // Verificar webhook
      const event = this.stripeService.verifyWebhook(payload, signature);
      
      // Crear registro de webhook event
      const webhookEvent = await this.createWebhookEvent(schemaName, {
        provider: 'STRIPE',
        eventType: event.type,
        eventId: event.id,
        rawPayload: event,
        signature,
        verified: true,
      });

      // Procesar evento
      const processedData = await this.stripeService.processWebhookEvent(event);
      
      if (processedData) {
        await this.handlePaymentEvent(schemaName, processedData, webhookEvent.id);
      }

      // Marcar como procesado
      await this.markWebhookEventAsProcessed(schemaName, webhookEvent.id);

      return { success: true, message: 'Webhook processed successfully' };
    } catch (error) {
      this.logger.error('Error processing Stripe webhook:', error);
      throw new BadRequestException(
        `Error processing Stripe webhook: ${error.message}`,
      );
    }
  }

  /**
   * Procesar webhook de PayPal
   */
  async processPayPalWebhook(
    schemaName: string,
    headers: any,
    body: string,
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log('Processing PayPal webhook');

      const webhookId = process.env.PAYPAL_WEBHOOK_ID;
      const isVerified = await this.paypalService.verifyWebhook(
        headers,
        body,
        webhookId,
      );

      const eventData = JSON.parse(body);

      // Crear registro de webhook event
      const webhookEvent = await this.createWebhookEvent(schemaName, {
        provider: 'PAYPAL',
        eventType: eventData.event_type,
        eventId: eventData.id,
        rawPayload: eventData,
        signature: headers['paypal-transmission-sig'],
        verified: isVerified,
      });

      if (isVerified) {
        // Procesar evento
        const processedData = await this.paypalService.processWebhookEvent(eventData);
        
        if (processedData) {
          await this.handlePaymentEvent(schemaName, processedData, webhookEvent.id);
        }

        // Marcar como procesado
        await this.markWebhookEventAsProcessed(schemaName, webhookEvent.id);

        return { success: true, message: 'Webhook processed successfully' };
      } else {
        this.logger.warn('PayPal webhook verification failed');
        return { success: false, message: 'Webhook verification failed' };
      }
    } catch (error) {
      this.logger.error('Error processing PayPal webhook:', error);
      throw new BadRequestException(
        `Error processing PayPal webhook: ${error.message}`,
      );
    }
  }

  /**
   * Procesar notificación de PSE
   */
  async processPSENotification(
    schemaName: string,
    notificationData: any,
  ): Promise<{ success: boolean; message: string }> {
    try {
      this.logger.log('Processing PSE notification');

      const isVerified = this.pseService.verifyNotification(notificationData);

      // Crear registro de webhook event
      const webhookEvent = await this.createWebhookEvent(schemaName, {
        provider: 'PSE',
        eventType: 'TRANSACTION_UPDATE',
        eventId: notificationData.transactionId,
        rawPayload: notificationData,
        signature: notificationData.signature,
        verified: isVerified,
      });

      if (isVerified) {
        // Procesar confirmación
        const processedData = await this.pseService.processConfirmation(notificationData);
        
        await this.handlePaymentEvent(schemaName, {
          type: 'PSE_CONFIRMATION',
          transactionId: processedData.transactionId,
          status: this.mapPSEStateToPaymentStatus(processedData.state),
          amount: processedData.amount,
          currency: processedData.currency,
          referenceCode: processedData.referenceCode,
        }, webhookEvent.id);

        // Marcar como procesado
        await this.markWebhookEventAsProcessed(schemaName, webhookEvent.id);

        return { success: true, message: 'Notification processed successfully' };
      } else {
        this.logger.warn('PSE notification verification failed');
        return { success: false, message: 'Notification verification failed' };
      }
    } catch (error) {
      this.logger.error('Error processing PSE notification:', error);
      throw new BadRequestException(
        `Error processing PSE notification: ${error.message}`,
      );
    }
  }

  /**
   * Crear registro de evento webhook
   */
  private async createWebhookEvent(
    schemaName: string,
    eventData: {
      provider: string;
      eventType: string;
      eventId: string;
      rawPayload: any;
      signature?: string;
      verified: boolean;
    },
  ): Promise<any> {
    const prisma = this.prisma.getTenantDB(schemaName);

    return await prisma.webhookEvent.create({
      data: {
        provider: eventData.provider,
        eventType: eventData.eventType,
        eventId: eventData.eventId,
        rawPayload: eventData.rawPayload,
        signature: eventData.signature,
        verified: eventData.verified,
      },
    });
  }

  /**
   * Marcar evento webhook como procesado
   */
  private async markWebhookEventAsProcessed(
    schemaName: string,
    webhookEventId: string,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    await prisma.webhookEvent.update({
      where: { id: webhookEventId },
      data: {
        processed: true,
        processedAt: new Date(),
      },
    });
  }

  /**
   * Manejar eventos de pago
   */
  private async handlePaymentEvent(
    schemaName: string,
    eventData: any,
    webhookEventId: string,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    try {
      switch (eventData.type) {
        case 'PAYMENT_COMPLETED':
          await this.handlePaymentCompleted(schemaName, eventData);
          break;

        case 'PAYMENT_FAILED':
          await this.handlePaymentFailed(schemaName, eventData);
          break;

        case 'REFUND_COMPLETED':
          await this.handleRefundCompleted(schemaName, eventData);
          break;

        case 'CHARGEBACK_CREATED':
          await this.handleChargebackCreated(schemaName, eventData);
          break;

        case 'PSE_CONFIRMATION':
          await this.handlePSEConfirmation(schemaName, eventData);
          break;

        default:
          this.logger.log(`Unhandled event type: ${eventData.type}`);
      }

      // Asociar webhook event con payment si es posible
      if (eventData.paymentId || eventData.transactionId) {
        await this.linkWebhookToPayment(
          schemaName,
          webhookEventId,
          eventData.paymentId || eventData.transactionId,
        );
      }
    } catch (error) {
      this.logger.error('Error handling payment event:', error);
      
      // Marcar el webhook para retry
      await prisma.webhookEvent.update({
        where: { id: webhookEventId },
        data: {
          retryCount: { increment: 1 },
          errorMessage: error.message,
        },
      });
    }
  }

  /**
   * Manejar pago completado
   */
  private async handlePaymentCompleted(
    schemaName: string,
    eventData: any,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    // Buscar pago por gatewayReference
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { gatewayReference: eventData.paymentIntentId || eventData.orderId || eventData.transactionId },
          { transactionId: eventData.paymentIntentId || eventData.orderId || eventData.transactionId },
        ],
      },
      include: { fees: true },
    });

    if (payment) {
      // Actualizar estado del pago
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          updatedAt: new Date(),
        },
      });

      // Actualizar transacciones relacionadas
      await prisma.transaction.updateMany({
        where: { paymentId: payment.id },
        data: {
          status: PaymentStatus.COMPLETED,
          webhookVerified: true,
          completedAt: new Date(),
        },
      });

      // Marcar cuotas como pagadas si aplica
      if (payment.fees && payment.fees.length > 0) {
        await prisma.fee.updateMany({
          where: { paymentId: payment.id },
          data: {
            paid: true,
            paidAt: new Date(),
          },
        });
      }

      // Enviar notificación
      await this.sendPaymentNotification(
        schemaName,
        payment.id,
        PaymentStatus.COMPLETED,
      );

      this.logger.log(`Payment completed: ${payment.id}`);
    } else {
      this.logger.warn(
        `Payment not found for gateway reference: ${eventData.paymentIntentId || eventData.orderId || eventData.transactionId}`,
      );
    }
  }

  /**
   * Manejar pago fallido
   */
  private async handlePaymentFailed(
    schemaName: string,
    eventData: any,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { gatewayReference: eventData.paymentIntentId || eventData.orderId || eventData.transactionId },
          { transactionId: eventData.paymentIntentId || eventData.orderId || eventData.transactionId },
        ],
      },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          updatedAt: new Date(),
        },
      });

      await prisma.transaction.updateMany({
        where: { paymentId: payment.id },
        data: {
          status: PaymentStatus.FAILED,
          webhookVerified: true,
        },
      });

      await this.sendPaymentNotification(
        schemaName,
        payment.id,
        PaymentStatus.FAILED,
      );

      this.logger.log(`Payment failed: ${payment.id}`);
    }
  }

  /**
   * Manejar reembolso completado
   */
  private async handleRefundCompleted(
    schemaName: string,
    eventData: any,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    // Buscar el pago original
    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { gatewayReference: eventData.captureId || eventData.chargeId },
          { transactionId: eventData.captureId || eventData.chargeId },
        ],
      },
    });

    if (payment) {
      // Actualizar estado si es reembolso total
      if (eventData.amount >= payment.amount) {
        await prisma.payment.update({
          where: { id: payment.id },
          data: {
            status: PaymentStatus.REFUNDED,
            updatedAt: new Date(),
          },
        });
      }

      // Actualizar o crear registro de reembolso
      await prisma.paymentRefund.upsert({
        where: {
          gatewayRefundId: eventData.refundId,
        },
        create: {
          paymentId: payment.id,
          amount: eventData.amount,
          currency: eventData.currency,
          status: PaymentStatus.COMPLETED,
          reason: 'REQUESTED_BY_CUSTOMER',
          gatewayRefundId: eventData.refundId,
          processedAt: new Date(),
        },
        update: {
          status: PaymentStatus.COMPLETED,
          processedAt: new Date(),
        },
      });

      this.logger.log(`Refund completed for payment: ${payment.id}`);
    }
  }

  /**
   * Manejar chargeback creado
   */
  private async handleChargebackCreated(
    schemaName: string,
    eventData: any,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    // Crear transacción de chargeback
    const payment = await prisma.payment.findFirst({
      where: {
        gatewayReference: eventData.chargeId,
      },
    });

    if (payment) {
      await prisma.transaction.create({
        data: {
          paymentId: payment.id,
          paymentGatewayId: payment.id, // Esto debería ser el gateway ID real
          amount: eventData.amount,
          currency: payment.currency,
          type: TransactionType.CHARGEBACK,
          status: PaymentStatus.PROCESSING,
          description: `Chargeback: ${eventData.reason}`,
          metadata: eventData,
        },
      });

      this.logger.log(`Chargeback created for payment: ${payment.id}`);
    }
  }

  /**
   * Manejar confirmación PSE
   */
  private async handlePSEConfirmation(
    schemaName: string,
    eventData: any,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { gatewayReference: eventData.transactionId },
          { transactionId: eventData.transactionId },
        ],
      },
    });

    if (payment) {
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: eventData.status,
          updatedAt: new Date(),
        },
      });

      await prisma.transaction.updateMany({
        where: { paymentId: payment.id },
        data: {
          status: eventData.status,
          webhookVerified: true,
          completedAt:
            eventData.status === PaymentStatus.COMPLETED
              ? new Date()
              : undefined,
        },
      });

      await this.sendPaymentNotification(
        schemaName,
        payment.id,
        eventData.status,
      );

      this.logger.log(`PSE confirmation processed for payment: ${payment.id}`);
    }
  }

  /**
   * Vincular webhook con pago
   */
  private async linkWebhookToPayment(
    schemaName: string,
    webhookEventId: string,
    paymentReference: string,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    const payment = await prisma.payment.findFirst({
      where: {
        OR: [
          { gatewayReference: paymentReference },
          { transactionId: paymentReference },
          { id: paymentReference },
        ],
      },
    });

    if (payment) {
      await prisma.webhookEvent.update({
        where: { id: webhookEventId },
        data: { paymentId: payment.id },
      });
    }
  }

  /**
   * Enviar notificación de pago
   */
  private async sendPaymentNotification(
    schemaName: string,
    paymentId: string,
    status: PaymentStatus,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    try {
      const payment = await prisma.payment.findUnique({
        where: { id: paymentId },
        include: { user: true },
      });

      if (!payment) return;

      let title: string;
      let message: string;
      let type: string;

      switch (status) {
        case PaymentStatus.COMPLETED:
          title = 'Pago Confirmado';
          message = `Tu pago de $${payment.amount.toLocaleString()} ha sido confirmado exitosamente.`;
          type = 'PAYMENT_RECEIVED';
          break;

        case PaymentStatus.FAILED:
          title = 'Pago Rechazado';
          message = `Tu pago de $${payment.amount.toLocaleString()} ha sido rechazado.`;
          type = 'PAYMENT_FAILED';
          break;

        case PaymentStatus.REFUNDED:
          title = 'Reembolso Procesado';
          message = `Se ha procesado un reembolso de $${payment.amount.toLocaleString()}.`;
          type = 'REFUND_PROCESSED';
          break;

        default:
          return;
      }

      await prisma.paymentNotification.create({
        data: {
          userId: payment.userId,
          paymentId: payment.id,
          type,
          title,
          message,
          sentViaApp: true,
        },
      });
    } catch (error) {
      this.logger.error('Error sending payment notification:', error);
    }
  }

  /**
   * Mapear estado PSE a PaymentStatus
   */
  private mapPSEStateToPaymentStatus(state: string): PaymentStatus {
    const statusMap = {
      APPROVED: PaymentStatus.COMPLETED,
      DECLINED: PaymentStatus.FAILED,
      PENDING: PaymentStatus.PROCESSING,
      ERROR: PaymentStatus.FAILED,
      EXPIRED: PaymentStatus.CANCELLED,
    };

    return statusMap[state] || PaymentStatus.FAILED;
  }

  /**
   * Reintentar webhooks fallidos
   */
  async retryFailedWebhooks(schemaName: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    const failedWebhooks = await prisma.webhookEvent.findMany({
      where: {
        processed: false,
        retryCount: { lt: 3 },
        createdAt: {
          gte: new Date(Date.now() - 24 * 60 * 60 * 1000), // Últimas 24 horas
        },
      },
    });

    for (const webhook of failedWebhooks) {
      try {
        // Reintentar procesamiento
        const eventData = webhook.rawPayload;
        await this.handlePaymentEvent(schemaName, eventData, webhook.id);

        // Marcar como procesado si fue exitoso
        await this.markWebhookEventAsProcessed(schemaName, webhook.id);

        this.logger.log(`Retried webhook successfully: ${webhook.id}`);
      } catch (error) {
        this.logger.error(`Failed to retry webhook ${webhook.id}:`, error);
        
        // Incrementar contador de reintentos
        await prisma.webhookEvent.update({
          where: { id: webhook.id },
          data: {
            retryCount: { increment: 1 },
            errorMessage: error.message,
          },
        });
      }
    }
  }
}
