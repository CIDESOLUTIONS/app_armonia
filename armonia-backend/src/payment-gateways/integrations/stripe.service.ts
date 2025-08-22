import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import Stripe from 'stripe';
import {
  CreatePaymentDto,
  ProcessPaymentDto,
  PaymentResponseDto,
  CreateRefundDto,
  PaymentStatus,
  PaymentGatewayType,
} from '../../common/dto/payment-gateways.dto';

@Injectable()
export class StripeService {
  private readonly logger = new Logger(StripeService.name);
  private stripe: Stripe;

  constructor() {
    const secretKey = process.env.STRIPE_SECRET_KEY;
    if (!secretKey) {
      this.logger.error('STRIPE_SECRET_KEY not found in environment variables');
      throw new Error('Stripe configuration missing');
    }

    this.stripe = new Stripe(secretKey, {
      apiVersion: '2024-06-20',
    });
  }

  /**
   * Crear un PaymentIntent en Stripe
   */
  async createPaymentIntent(
    paymentData: CreatePaymentDto,
    gatewayConfig: any,
  ): Promise<PaymentResponseDto> {
    try {
      this.logger.log(
        `Creating Stripe PaymentIntent for amount: ${paymentData.amount} ${paymentData.currency || 'COP'}`,
      );

      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(paymentData.amount * 100), // Stripe usa centavos
        currency: (paymentData.currency || 'COP').toLowerCase(),
        payment_method_types: ['card'],
        metadata: {
          userId: paymentData.userId,
          description: paymentData.description || '',
          ...(paymentData.metadata || {}),
        },
        description: paymentData.description,
      });

      return {
        id: paymentIntent.id,
        status: this.mapStripeStatusToPaymentStatus(paymentIntent.status),
        gatewayReference: paymentIntent.id,
        data: {
          clientSecret: paymentIntent.client_secret,
          publishableKey: process.env.STRIPE_PUBLISHABLE_KEY,
        },
      };
    } catch (error) {
      this.logger.error('Error creating Stripe PaymentIntent:', error);
      throw new BadRequestException(
        `Error al crear PaymentIntent: ${error.message}`,
      );
    }
  }

  /**
   * Confirmar un pago con Stripe
   */
  async confirmPayment(
    paymentIntentId: string,
    paymentMethod?: string,
  ): Promise<PaymentResponseDto> {
    try {
      this.logger.log(`Confirming Stripe payment: ${paymentIntentId}`);

      const paymentIntent = await this.stripe.paymentIntents.confirm(
        paymentIntentId,
        paymentMethod
          ? {
              payment_method: paymentMethod,
            }
          : {},
      );

      return {
        id: paymentIntent.id,
        status: this.mapStripeStatusToPaymentStatus(paymentIntent.status),
        gatewayReference: paymentIntent.id,
        redirectUrl:
          paymentIntent.next_action?.redirect_to_url?.url || undefined,
        data: {
          clientSecret: paymentIntent.client_secret,
        },
      };
    } catch (error) {
      this.logger.error('Error confirming Stripe payment:', error);
      return {
        id: paymentIntentId,
        status: PaymentStatus.FAILED,
        errorMessage: error.message,
      };
    }
  }

  /**
   * Obtener estado de un pago
   */
  async getPaymentStatus(paymentIntentId: string): Promise<PaymentResponseDto> {
    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId,
      );

      return {
        id: paymentIntent.id,
        status: this.mapStripeStatusToPaymentStatus(paymentIntent.status),
        gatewayReference: paymentIntent.id,
        data: {
          amount: paymentIntent.amount / 100,
          currency: paymentIntent.currency.toUpperCase(),
          charges: paymentIntent.charges.data.map((charge) => ({
            id: charge.id,
            status: charge.status,
            amount: charge.amount / 100,
            created: new Date(charge.created * 1000),
          })),
        },
      };
    } catch (error) {
      this.logger.error('Error getting Stripe payment status:', error);
      throw new BadRequestException(
        `Error al obtener estado del pago: ${error.message}`,
      );
    }
  }

  /**
   * Crear un reembolso
   */
  async createRefund(
    paymentIntentId: string,
    refundData: CreateRefundDto,
  ): Promise<any> {
    try {
      this.logger.log(
        `Creating Stripe refund for payment: ${paymentIntentId}`,
      );

      // Obtener el PaymentIntent para encontrar el charge
      const paymentIntent = await this.stripe.paymentIntents.retrieve(
        paymentIntentId,
      );

      if (!paymentIntent.charges.data.length) {
        throw new BadRequestException(
          'No hay charges asociados a este pago',
        );
      }

      const chargeId = paymentIntent.charges.data[0].id;

      const refund = await this.stripe.refunds.create({
        charge: chargeId,
        amount: Math.round(refundData.amount * 100),
        reason: this.mapRefundReasonToStripe(refundData.reason),
        metadata: {
          originalPaymentId: refundData.paymentId,
          reason: refundData.reason,
          notes: refundData.notes || '',
          ...(refundData.metadata || {}),
        },
      });

      return {
        id: refund.id,
        status: this.mapStripeRefundStatusToPaymentStatus(refund.status),
        amount: refund.amount / 100,
        currency: refund.currency.toUpperCase(),
        gatewayReference: refund.id,
        data: refund,
      };
    } catch (error) {
      this.logger.error('Error creating Stripe refund:', error);
      throw new BadRequestException(
        `Error al crear reembolso: ${error.message}`,
      );
    }
  }

  /**
   * Crear un método de pago para usuario (Setup Intent)
   */
  async createSetupIntent(userId: string): Promise<any> {
    try {
      this.logger.log(`Creating Stripe SetupIntent for user: ${userId}`);

      const setupIntent = await this.stripe.setupIntents.create({
        payment_method_types: ['card'],
        usage: 'off_session',
        metadata: {
          userId,
        },
      });

      return {
        id: setupIntent.id,
        clientSecret: setupIntent.client_secret,
        status: setupIntent.status,
      };
    } catch (error) {
      this.logger.error('Error creating Stripe SetupIntent:', error);
      throw new BadRequestException(
        `Error al crear método de pago: ${error.message}`,
      );
    }
  }

  /**
   * Verificar webhook de Stripe
   */
  verifyWebhook(payload: string, signature: string): any {
    try {
      const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
      if (!webhookSecret) {
        throw new Error('Stripe webhook secret not configured');
      }

      return this.stripe.webhooks.constructEvent(
        payload,
        signature,
        webhookSecret,
      );
    } catch (error) {
      this.logger.error('Error verifying Stripe webhook:', error);
      throw new BadRequestException(
        `Webhook verification failed: ${error.message}`,
      );
    }
  }

  /**
   * Mapear estado de Stripe a nuestro enum
   */
  private mapStripeStatusToPaymentStatus(status: string): PaymentStatus {
    const statusMap = {
      requires_payment_method: PaymentStatus.PENDING,
      requires_confirmation: PaymentStatus.PENDING,
      requires_action: PaymentStatus.PROCESSING,
      processing: PaymentStatus.PROCESSING,
      requires_capture: PaymentStatus.PROCESSING,
      canceled: PaymentStatus.CANCELLED,
      succeeded: PaymentStatus.COMPLETED,
    };

    return statusMap[status] || PaymentStatus.FAILED;
  }

  /**
   * Mapear estado de refund de Stripe a nuestro enum
   */
  private mapStripeRefundStatusToPaymentStatus(status: string): PaymentStatus {
    const statusMap = {
      pending: PaymentStatus.PROCESSING,
      succeeded: PaymentStatus.COMPLETED,
      failed: PaymentStatus.FAILED,
      canceled: PaymentStatus.CANCELLED,
    };

    return statusMap[status] || PaymentStatus.FAILED;
  }

  /**
   * Mapear razón de reembolso a Stripe
   */
  private mapRefundReasonToStripe(reason: string): Stripe.RefundCreateParams.Reason {
    const reasonMap = {
      REQUESTED_BY_CUSTOMER: 'requested_by_customer',
      DUPLICATE: 'duplicate',
      FRAUDULENT: 'fraudulent',
      ERROR: 'requested_by_customer',
    };

    return reasonMap[reason] as Stripe.RefundCreateParams.Reason || 'requested_by_customer';
  }

  /**
   * Obtener lista de métodos de pago guardados
   */
  async getCustomerPaymentMethods(customerId: string): Promise<any[]> {
    try {
      const paymentMethods = await this.stripe.paymentMethods.list({
        customer: customerId,
        type: 'card',
      });

      return paymentMethods.data.map((pm) => ({
        id: pm.id,
        type: pm.type,
        card: pm.card
          ? {
              brand: pm.card.brand,
              last4: pm.card.last4,
              exp_month: pm.card.exp_month,
              exp_year: pm.card.exp_year,
            }
          : null,
      }));
    } catch (error) {
      this.logger.error('Error getting customer payment methods:', error);
      return [];
    }
  }

  /**
   * Procesar webhook events
   */
  async processWebhookEvent(event: any): Promise<any> {
    this.logger.log(`Processing Stripe webhook event: ${event.type}`);

    switch (event.type) {
      case 'payment_intent.succeeded':
        return {
          type: 'PAYMENT_COMPLETED',
          paymentIntentId: event.data.object.id,
          amount: event.data.object.amount / 100,
          currency: event.data.object.currency.toUpperCase(),
          metadata: event.data.object.metadata,
        };

      case 'payment_intent.payment_failed':
        return {
          type: 'PAYMENT_FAILED',
          paymentIntentId: event.data.object.id,
          error: event.data.object.last_payment_error,
          metadata: event.data.object.metadata,
        };

      case 'charge.dispute.created':
        return {
          type: 'CHARGEBACK_CREATED',
          chargeId: event.data.object.charge,
          amount: event.data.object.amount / 100,
          reason: event.data.object.reason,
        };

      default:
        this.logger.log(`Unhandled webhook event type: ${event.type}`);
        return null;
    }
  }
}
