import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as paypal from '@paypal/checkout-server-sdk';
import {
  CreatePaymentDto,
  ProcessPaymentDto,
  PaymentResponseDto,
  CreateRefundDto,
  PaymentStatus,
} from '@armonia-backend/common/dto/payment-gateways.dto';

@Injectable()
export class PayPalService {
  private readonly logger = new Logger(PayPalService.name);
  private client: paypal.core.PayPalHttpClient;

  constructor() {
    this.initializeClient();
  }

  private initializeClient() {
    const clientId = process.env.PAYPAL_CLIENT_ID;
    const clientSecret = process.env.PAYPAL_CLIENT_SECRET;
    const environment = process.env.PAYPAL_ENVIRONMENT || 'sandbox';

    if (!clientId || !clientSecret) {
      this.logger.error('PayPal credentials not found in environment variables');
      throw new Error('PayPal configuration missing');
    }

    // Configurar environment
    const paypalEnvironment =
      environment === 'production'
        ? new paypal.core.LiveEnvironment(clientId, clientSecret)
        : new paypal.core.SandboxEnvironment(clientId, clientSecret);

    this.client = new paypal.core.PayPalHttpClient(paypalEnvironment);
  }

  /**
   * Crear una orden de pago en PayPal
   */
  async createOrder(
    paymentData: CreatePaymentDto,
    returnUrl: string,
    cancelUrl: string,
  ): Promise<PaymentResponseDto> {
    try {
      this.logger.log(
        `Creating PayPal order for amount: ${paymentData.amount} ${paymentData.currency || 'USD'}`,
      );

      const request = new paypal.orders.OrdersCreateRequest();
      request.prefer('return=representation');
      request.requestBody({
        intent: 'CAPTURE',
        purchase_units: [
          {
            amount: {
              currency_code: paymentData.currency || 'USD',
              value: paymentData.amount.toFixed(2),
            },
            description: paymentData.description || 'Pago App Armonía',
            custom_id: paymentData.userId,
          },
        ],
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              brand_name: 'App Armonía',
              locale: 'es-CO',
              landing_page: 'LOGIN',
              shipping_preference: 'NO_SHIPPING',
              user_action: 'PAY_NOW',
              return_url: returnUrl,
              cancel_url: cancelUrl,
            },
          },
        },
      });

      const order = await this.client.execute(request);

      // Encontrar el link de aprobación
      const approvalUrl = order.result.links.find(
        (link: any) => link.rel === 'payer-action',
      )?.href;

      return {
        id: order.result.id,
        status: this.mapPayPalStatusToPaymentStatus(order.result.status),
        gatewayReference: order.result.id,
        redirectUrl: approvalUrl,
        data: {
          orderId: order.result.id,
          links: order.result.links,
        },
      };
    } catch (error) {
      this.logger.error('Error creating PayPal order:', error);
      throw new BadRequestException(
        `Error al crear orden PayPal: ${error.message}`,
      );
    }
  }

  /**
   * Capturar un pago después de la aprobación
   */
  async captureOrder(orderId: string): Promise<PaymentResponseDto> {
    try {
      this.logger.log(`Capturing PayPal order: ${orderId}`);

      const request = new paypal.orders.OrdersCaptureRequest(orderId);
      request.requestBody({});

      const capture = await this.client.execute(request);

      return {
        id: capture.result.id,
        status: this.mapPayPalStatusToPaymentStatus(capture.result.status),
        gatewayReference: capture.result.id,
        data: {
          captureId: capture.result.purchase_units[0]?.payments?.captures?.[0]?.id,
          amount: capture.result.purchase_units[0]?.payments?.captures?.[0]?.amount,
          fees: capture.result.purchase_units[0]?.payments?.captures?.[0]?.seller_receivable_breakdown?.paypal_fee,
        },
      };
    } catch (error) {
      this.logger.error('Error capturing PayPal order:', error);
      return {
        id: orderId,
        status: PaymentStatus.FAILED,
        errorMessage: error.message,
      };
    }
  }

  /**
   * Obtener detalles de una orden
   */
  async getOrderDetails(orderId: string): Promise<PaymentResponseDto> {
    try {
      const request = new paypal.orders.OrdersGetRequest(orderId);
      const order = await this.client.execute(request);

      return {
        id: order.result.id,
        status: this.mapPayPalStatusToPaymentStatus(order.result.status),
        gatewayReference: order.result.id,
        data: {
          orderId: order.result.id,
          amount: order.result.purchase_units[0]?.amount,
          payer: order.result.payer,
          create_time: order.result.create_time,
          update_time: order.result.update_time,
        },
      };
    } catch (error) {
      this.logger.error('Error getting PayPal order details:', error);
      throw new BadRequestException(
        `Error al obtener detalles de orden: ${error.message}`,
      );
    }
  }

  /**
   * Crear un reembolso
   */
  async createRefund(
    captureId: string,
    refundData: CreateRefundDto,
  ): Promise<any> {
    try {
      this.logger.log(`Creating PayPal refund for capture: ${captureId}`);

      const request = new paypal.payments.CapturesRefundRequest(captureId);
      request.requestBody({
        amount: {
          value: refundData.amount.toFixed(2),
          currency_code: refundData.currency || 'USD',
        },
        note_to_payer: refundData.notes || 'Reembolso procesado',
      });

      const refund = await this.client.execute(request);

      return {
        id: refund.result.id,
        status: this.mapPayPalRefundStatusToPaymentStatus(refund.result.status),
        amount: parseFloat(refund.result.amount.value),
        currency: refund.result.amount.currency_code,
        gatewayReference: refund.result.id,
        data: refund.result,
      };
    } catch (error) {
      this.logger.error('Error creating PayPal refund:', error);
      throw new BadRequestException(
        `Error al crear reembolso: ${error.message}`,
      );
    }
  }

  /**
   * Verificar webhook de PayPal
   */
  async verifyWebhook(
    headers: any,
    body: string,
    webhookId: string,
  ): Promise<boolean> {
    try {
      // PayPal webhook verification es más complejo
      // Para desarrollo, podemos simplificar, pero en producción
      // deberíamos usar la verificación completa de PayPal
      const authAlgo = headers['paypal-auth-algo'];
      const transmission = headers['paypal-transmission-id'];
      const certId = headers['paypal-cert-id'];
      const signature = headers['paypal-transmission-sig'];
      const timestamp = headers['paypal-transmission-time'];

      if (!authAlgo || !transmission || !certId || !signature || !timestamp) {
        this.logger.warn('Missing PayPal webhook headers');
        return false;
      }

      // En un entorno de producción, aquí deberías verificar
      // la firma usando los certificados de PayPal
      // Por ahora, retornamos true para desarrollo
      return true;
    } catch (error) {
      this.logger.error('Error verifying PayPal webhook:', error);
      return false;
    }
  }

  /**
   * Procesar eventos de webhook
   */
  async processWebhookEvent(event: any): Promise<any> {
    this.logger.log(`Processing PayPal webhook event: ${event.event_type}`);

    switch (event.event_type) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        return {
          type: 'PAYMENT_COMPLETED',
          orderId: event.resource.supplementary_data?.related_ids?.order_id,
          captureId: event.resource.id,
          amount: parseFloat(event.resource.amount.value),
          currency: event.resource.amount.currency_code,
          payerId: event.resource.payer?.payer_id,
        };

      case 'PAYMENT.CAPTURE.DENIED':
      case 'PAYMENT.CAPTURE.DECLINED':
        return {
          type: 'PAYMENT_FAILED',
          orderId: event.resource.supplementary_data?.related_ids?.order_id,
          captureId: event.resource.id,
          reason: event.resource.status_details?.reason,
        };

      case 'PAYMENT.CAPTURE.REFUNDED':
        return {
          type: 'REFUND_COMPLETED',
          captureId: event.resource.id,
          refundId: event.resource.refund?.id,
          amount: parseFloat(event.resource.refund?.amount?.value || '0'),
          currency: event.resource.refund?.amount?.currency_code,
        };

      case 'CHECKOUT.ORDER.APPROVED':
        return {
          type: 'ORDER_APPROVED',
          orderId: event.resource.id,
          payerId: event.resource.payer?.payer_id,
        };

      default:
        this.logger.log(`Unhandled PayPal webhook event: ${event.event_type}`);
        return null;
    }
  }

  /**
   * Mapear estado de PayPal a nuestro enum
   */
  private mapPayPalStatusToPaymentStatus(status: string): PaymentStatus {
    const statusMap = {
      CREATED: PaymentStatus.PENDING,
      SAVED: PaymentStatus.PENDING,
      APPROVED: PaymentStatus.PROCESSING,
      VOIDED: PaymentStatus.CANCELLED,
      COMPLETED: PaymentStatus.COMPLETED,
      PAYER_ACTION_REQUIRED: PaymentStatus.PROCESSING,
    };

    return statusMap[status] || PaymentStatus.FAILED;
  }

  /**
   * Mapear estado de refund de PayPal a nuestro enum
   */
  private mapPayPalRefundStatusToPaymentStatus(status: string): PaymentStatus {
    const statusMap = {
      CANCELLED: PaymentStatus.CANCELLED,
      PENDING: PaymentStatus.PROCESSING,
      COMPLETED: PaymentStatus.COMPLETED,
      FAILED: PaymentStatus.FAILED,
    };

    return statusMap[status] || PaymentStatus.FAILED;
  }

  /**
   * Generar URLs de retorno dinámicas
   */
  generateReturnUrls(baseUrl: string, paymentId: string) {
    return {
      returnUrl: `${baseUrl}/api/payment-gateways/paypal/return?paymentId=${paymentId}`,
      cancelUrl: `${baseUrl}/api/payment-gateways/paypal/cancel?paymentId=${paymentId}`,
    };
  }
}
