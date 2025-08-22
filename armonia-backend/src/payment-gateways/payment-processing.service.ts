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
  CreatePaymentDto,
  ProcessPaymentDto,
  PaymentResponseDto,
  CreateRefundDto,
  CreateTransactionDto,
  TransactionDto,
  CreatePaymentMethodDto,
  PaymentMethodDto,
  PaymentFilterDto,
  PaymentStatus,
  PaymentGatewayType,
  TransactionType,
} from '../common/dto/payment-gateways.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentProcessingService {
  private readonly logger = new Logger(PaymentProcessingService.name);

  constructor(
    private prisma: PrismaService,
    private stripeService: StripeService,
    private paypalService: PayPalService,
    private pseService: PSEService,
  ) {}

  /**
   * Procesar un pago utilizando la pasarela especificada
   */
  async processPayment(
    schemaName: string,
    paymentData: CreatePaymentDto,
    gatewayId: string,
    additionalParams?: any,
  ): Promise<PaymentResponseDto> {
    const prisma = this.prisma.getTenantDB(schemaName);

    try {
      // Obtener configuración de la pasarela
      const gateway = await prisma.paymentGatewayConfig.findUnique({
        where: { id: gatewayId },
      });

      if (!gateway || !gateway.isActive) {
        throw new NotFoundException(
          'Pasarela de pago no encontrada o inactiva',
        );
      }

      // Validar monto
      if (gateway.minAmount && paymentData.amount < gateway.minAmount) {
        throw new BadRequestException(
          `Monto mínimo: ${gateway.minAmount} ${paymentData.currency}`,
        );
      }

      if (gateway.maxAmount && paymentData.amount > gateway.maxAmount) {
        throw new BadRequestException(
          `Monto máximo: ${gateway.maxAmount} ${paymentData.currency}`,
        );
      }

      // Crear registro de pago
      const payment = await prisma.payment.create({
        data: {
          userId: paymentData.userId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'COP',
          method: paymentData.method,
          status: PaymentStatus.PENDING,
          description: paymentData.description,
          metadata: paymentData.metadata,
          paymentMethodId: paymentData.paymentMethodId,
        },
      });

      // Crear intento de pago
      const attempt = await prisma.paymentAttempt.create({
        data: {
          paymentId: payment.id,
          paymentGatewayId: gatewayId,
          status: PaymentStatus.PROCESSING,
          gateway: gateway.type,
          amount: paymentData.amount,
          currency: paymentData.currency || 'COP',
          ipAddress: additionalParams?.ipAddress,
          userAgent: additionalParams?.userAgent,
        },
      });

      let response: PaymentResponseDto;

      // Procesar según el tipo de pasarela
      switch (gateway.type) {
        case PaymentGatewayType.STRIPE:
          response = await this.processStripePayment(
            paymentData,
            gateway,
            additionalParams,
          );
          break;

        case PaymentGatewayType.PAYPAL:
          response = await this.processPayPalPayment(
            paymentData,
            gateway,
            additionalParams,
          );
          break;

        case PaymentGatewayType.PSE:
          response = await this.processPSEPayment(
            paymentData,
            gateway,
            additionalParams,
          );
          break;

        default:
          throw new BadRequestException(
            `Tipo de pasarela no soportado: ${gateway.type}`,
          );
      }

      // Actualizar el intento con la respuesta
      await prisma.paymentAttempt.update({
        where: { id: attempt.id },
        data: {
          status: response.status,
          gatewayTransactionId: response.gatewayReference,
          gatewayResponse: response.data || {},
          errorMessage: response.errorMessage,
          completedAt:
            response.status === PaymentStatus.COMPLETED
              ? new Date()
              : undefined,
        },
      });

      // Actualizar el pago
      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: response.status,
          gatewayReference: response.gatewayReference,
          transactionId: response.gatewayReference,
        },
      });

      // Crear transacción si el pago fue exitoso o está en proceso
      if (
        response.status === PaymentStatus.COMPLETED ||
        response.status === PaymentStatus.PROCESSING
      ) {
        await this.createTransaction({
          schemaName,
          paymentId: payment.id,
          paymentGatewayId: gatewayId,
          amount: paymentData.amount,
          currency: paymentData.currency || 'COP',
          type: TransactionType.PAYMENT,
          gatewayTransactionId: response.gatewayReference,
          gatewayResponse: response.data,
          status: response.status,
        });
      }

      // Si el pago es para cuotas específicas, marcarlas como pagadas
      if (
        paymentData.feeIds &&
        response.status === PaymentStatus.COMPLETED
      ) {
        await this.markFeesAsPaid(schemaName, paymentData.feeIds, payment.id);
      }

      // Enviar notificación de pago
      await this.sendPaymentNotification(schemaName, payment.id, response.status);

      return {
        ...response,
        id: payment.id,
      };
    } catch (error) {
      this.logger.error('Error processing payment:', error);
      throw new BadRequestException(
        `Error al procesar pago: ${error.message}`,
      );
    }
  }

  /**
   * Procesar pago con Stripe
   */
  private async processStripePayment(
    paymentData: CreatePaymentDto,
    gateway: any,
    additionalParams?: any,
  ): Promise<PaymentResponseDto> {
    if (additionalParams?.paymentMethodId) {
      // Pago con método guardado
      return await this.stripeService.confirmPayment(
        additionalParams.paymentIntentId,
        additionalParams.paymentMethodId,
      );
    } else {
      // Crear nuevo PaymentIntent
      return await this.stripeService.createPaymentIntent(
        paymentData,
        gateway,
      );
    }
  }

  /**
   * Procesar pago con PayPal
   */
  private async processPayPalPayment(
    paymentData: CreatePaymentDto,
    gateway: any,
    additionalParams?: any,
  ): Promise<PaymentResponseDto> {
    const baseUrl = additionalParams?.baseUrl || 'http://localhost:3001';
    const { returnUrl, cancelUrl } = this.paypalService.generateReturnUrls(
      baseUrl,
      paymentData.userId,
    );

    return await this.paypalService.createOrder(
      paymentData,
      returnUrl,
      cancelUrl,
    );
  }

  /**
   * Procesar pago con PSE
   */
  private async processPSEPayment(
    paymentData: CreatePaymentDto,
    gateway: any,
    additionalParams?: any,
  ): Promise<PaymentResponseDto> {
    if (!additionalParams?.pseData) {
      throw new BadRequestException(
        'Datos PSE requeridos (bankCode, userType, documentType, etc.)',
      );
    }

    // Validar datos PSE
    const errors = this.pseService.validatePSEData(additionalParams.pseData);
    if (errors.length > 0) {
      throw new BadRequestException(`Errores en datos PSE: ${errors.join(', ')}`);
    }

    const baseUrl = additionalParams?.baseUrl || 'http://localhost:3001';
    const returnUrl = `${baseUrl}/api/payment-gateways/pse/return`;

    return await this.pseService.createTransaction(
      paymentData,
      additionalParams.pseData,
      returnUrl,
    );
  }

  /**
   * Crear transacción
   */
  async createTransaction(data: {
    schemaName: string;
    paymentId: string;
    paymentGatewayId: string;
    amount: number;
    currency: string;
    type: TransactionType;
    gatewayTransactionId?: string;
    gatewayResponse?: any;
    status: PaymentStatus;
    description?: string;
    metadata?: any;
  }): Promise<TransactionDto> {
    const prisma = this.prisma.getTenantDB(data.schemaName);

    const transaction = await prisma.transaction.create({
      data: {
        paymentId: data.paymentId,
        paymentGatewayId: data.paymentGatewayId,
        amount: data.amount,
        currency: data.currency,
        type: data.type,
        status: data.status,
        gatewayTransactionId: data.gatewayTransactionId,
        gatewayResponse: data.gatewayResponse,
        description: data.description,
        metadata: data.metadata,
        netAmount:
          data.amount - this.calculateProcessingFee(data.amount, data.paymentGatewayId),
        processingFee: this.calculateProcessingFee(data.amount, data.paymentGatewayId),
        completedAt:
          data.status === PaymentStatus.COMPLETED ? new Date() : undefined,
      },
    });

    return this.mapTransactionToDto(transaction);
  }

  /**
   * Calcular tarifa de procesamiento
   */
  private calculateProcessingFee(
    amount: number,
    gatewayId: string,
  ): number {
    // Esto debería ser configurado por pasarela
    // Por ahora, usar valores por defecto
    const defaultFeeRate = 0.029; // 2.9%
    const defaultFixedFee = 300; // $300 COP

    return amount * defaultFeeRate + defaultFixedFee;
  }

  /**
   * Marcar cuotas como pagadas
   */
  private async markFeesAsPaid(
    schemaName: string,
    feeIds: string[],
    paymentId: string,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);

    await prisma.fee.updateMany({
      where: {
        id: { in: feeIds },
        paid: false,
      },
      data: {
        paid: true,
        paidAt: new Date(),
        paymentId,
      },
    });
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

      let notificationType: string;
      let title: string;
      let message: string;

      switch (status) {
        case PaymentStatus.COMPLETED:
          notificationType = 'PAYMENT_RECEIVED';
          title = 'Pago Exitoso';
          message = `Tu pago de $${payment.amount.toLocaleString()} ha sido procesado exitosamente.`;
          break;

        case PaymentStatus.FAILED:
          notificationType = 'PAYMENT_FAILED';
          title = 'Pago Fallido';
          message = `Tu pago de $${payment.amount.toLocaleString()} no pudo ser procesado.`;
          break;

        case PaymentStatus.PROCESSING:
          notificationType = 'PAYMENT_PROCESSING';
          title = 'Pago en Proceso';
          message = `Tu pago de $${payment.amount.toLocaleString()} está siendo procesado.`;
          break;

        default:
          return;
      }

      await prisma.paymentNotification.create({
        data: {
          userId: payment.userId,
          paymentId: payment.id,
          type: notificationType,
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
   * Obtener pagos con filtros
   */
  async getPayments(
    schemaName: string,
    filters: PaymentFilterDto,
  ): Promise<{ payments: any[]; total: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);

    const where: any = {};

    if (filters.userId) where.userId = filters.userId;
    if (filters.status) where.status = filters.status;
    if (filters.method) where.method = filters.method;

    if (filters.dateFrom || filters.dateTo) {
      where.createdAt = {};
      if (filters.dateFrom) where.createdAt.gte = new Date(filters.dateFrom);
      if (filters.dateTo) where.createdAt.lte = new Date(filters.dateTo);
    }

    if (filters.amountFrom || filters.amountTo) {
      where.amount = {};
      if (filters.amountFrom) where.amount.gte = filters.amountFrom;
      if (filters.amountTo) where.amount.lte = filters.amountTo;
    }

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          user: { select: { id: true, name: true, email: true } },
          paymentMethod: true,
          attempts: true,
          transactions: true,
          fees: true,
        },
      }),
      prisma.payment.count({ where }),
    ]);

    return { payments, total };
  }

  /**
   * Mapear transacción a DTO
   */
  private mapTransactionToDto(transaction: any): TransactionDto {
    return {
      id: transaction.id,
      paymentId: transaction.paymentId,
      paymentGatewayId: transaction.paymentGatewayId,
      amount: transaction.amount,
      currency: transaction.currency,
      type: transaction.type,
      status: transaction.status,
      gatewayTransactionId: transaction.gatewayTransactionId,
      gatewayReference: transaction.gatewayReference,
      processingFee: transaction.processingFee,
      netAmount: transaction.netAmount,
      description: transaction.description,
      webhookVerified: transaction.webhookVerified,
      reconciled: transaction.reconciled,
      createdAt: transaction.createdAt,
      updatedAt: transaction.updatedAt,
      completedAt: transaction.completedAt,
    };
  }
}
