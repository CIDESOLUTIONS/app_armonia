import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentProcessingService } from './payment-processing.service';
import { WebhookService } from './webhook.service';
import { StripeService } from './integrations/stripe.service';
import { PayPalService } from './integrations/paypal.service';
import { PSEService } from './integrations/pse.service';
import {
  CreatePaymentGatewayDto,
  UpdatePaymentGatewayDto,
  PaymentGatewayConfigDto,
  CreatePaymentDto,
  ProcessPaymentDto,
  PaymentResponseDto,
  CreateRefundDto,
  CreatePaymentMethodDto,
  PaymentMethodDto,
  PaymentFilterDto,
  TransactionDto,
  WebhookEventDto,
  PaymentGatewayType,
} from '../common/dto/payment-gateways.dto';
import * as crypto from 'crypto';

@Injectable()
export class PaymentGatewaysService {
  constructor(
    private prisma: PrismaService,
    private paymentProcessingService: PaymentProcessingService,
    private webhookService: WebhookService,
    private stripeService: StripeService,
    private paypalService: PayPalService,
    private pseService: PSEService,
  ) {}

  // ========================================
  // GATEWAY CONFIGURATION METHODS
  // ========================================

  private mapToPaymentGatewayConfigDto(gateway: any): PaymentGatewayConfigDto {
    return {
      id: gateway.id,
      name: gateway.name,
      type: gateway.type,
      apiKey: this.maskSensitiveData(gateway.apiKey),
      secretKey: this.maskSensitiveData(gateway.secretKey),
      webhookSecret: gateway.webhookSecret ? this.maskSensitiveData(gateway.webhookSecret) : undefined,
      merchantId: gateway.merchantId,
      environment: gateway.environment,
      supportedCurrencies: gateway.supportedCurrencies,
      supportedMethods: gateway.supportedMethods,
      isActive: gateway.isActive,
      testMode: gateway.testMode,
      webhookUrl: gateway.webhookUrl,
      maxAmount: gateway.maxAmount,
      minAmount: gateway.minAmount,
      commissionRate: gateway.commissionRate,
      fixedCommission: gateway.fixedCommission,
      createdAt: gateway.createdAt,
      updatedAt: gateway.updatedAt,
    };
  }

  private maskSensitiveData(data: string): string {
    if (!data) return '';
    if (data.length <= 8) return '****';
    return data.substring(0, 4) + '****' + data.substring(data.length - 4);
  }

  async createPaymentGateway(
    schemaName: string,
    data: CreatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    // Encriptar datos sensibles
    const encryptedApiKey = this.encryptSensitiveData(data.apiKey);
    const encryptedSecretKey = this.encryptSensitiveData(data.secretKey);
    const encryptedWebhookSecret = data.webhookSecret ? this.encryptSensitiveData(data.webhookSecret) : undefined;

    const gateway = await prisma.paymentGatewayConfig.create({
      data: {
        name: data.name,
        type: data.type,
        apiKey: encryptedApiKey,
        secretKey: encryptedSecretKey,
        webhookSecret: encryptedWebhookSecret,
        merchantId: data.merchantId,
        environment: data.environment || 'test',
        supportedCurrencies: data.supportedCurrencies || ['COP'],
        supportedMethods: data.supportedMethods || [],
        isActive: data.isActive ?? true,
        testMode: data.testMode ?? true,
        webhookUrl: data.webhookUrl,
        maxAmount: data.maxAmount,
        minAmount: data.minAmount,
        commissionRate: data.commissionRate || 0,
        fixedCommission: data.fixedCommission || 0,
        residentialComplexId: 'default', // Esto debe venir del contexto
      },
    });
    return this.mapToPaymentGatewayConfigDto(gateway);
  }

  async getPaymentGateways(
    schemaName: string,
  ): Promise<PaymentGatewayConfigDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const gateways = await prisma.paymentGatewayConfig.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return gateways.map(this.mapToPaymentGatewayConfigDto.bind(this));
  }

  async getPaymentGatewayById(
    schemaName: string,
    id: string,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const gateway = await prisma.paymentGatewayConfig.findUnique({
      where: { id },
    });
    if (!gateway) {
      throw new NotFoundException(`Payment gateway with ID ${id} not found.`);
    }
    return this.mapToPaymentGatewayConfigDto(gateway);
  }

  async updatePaymentGateway(
    schemaName: string,
    id: string,
    data: UpdatePaymentGatewayDto,
  ): Promise<PaymentGatewayConfigDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await this.getPaymentGatewayById(schemaName, id); // Check if exists
    
    const updateData: any = { ...data };
    
    // Encriptar datos sensibles si se proporcionan
    if (data.apiKey) {
      updateData.apiKey = this.encryptSensitiveData(data.apiKey);
    }
    if (data.secretKey) {
      updateData.secretKey = this.encryptSensitiveData(data.secretKey);
    }
    if (data.webhookSecret) {
      updateData.webhookSecret = this.encryptSensitiveData(data.webhookSecret);
    }

    const updatedGateway = await prisma.paymentGatewayConfig.update({
      where: { id },
      data: updateData,
    });
    return this.mapToPaymentGatewayConfigDto(updatedGateway);
  }

  async deletePaymentGateway(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await this.getPaymentGatewayById(schemaName, id); // Check if exists
    await prisma.paymentGatewayConfig.delete({ where: { id } });
  }

  // ========================================
  // PAYMENT PROCESSING METHODS
  // ========================================

  async processPayment(
    schemaName: string,
    paymentData: CreatePaymentDto,
    gatewayId: string,
    additionalParams?: any,
  ): Promise<PaymentResponseDto> {
    return await this.paymentProcessingService.processPayment(
      schemaName,
      paymentData,
      gatewayId,
      additionalParams,
    );
  }

  async getPayments(
    schemaName: string,
    filters: PaymentFilterDto,
  ): Promise<{ payments: any[]; total: number }> {
    return await this.paymentProcessingService.getPayments(schemaName, filters);
  }

  async getPaymentById(schemaName: string, paymentId: string): Promise<any> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const payment = await prisma.payment.findUnique({
      where: { id: paymentId },
      include: {
        user: { select: { id: true, name: true, email: true } },
        paymentMethod: true,
        attempts: {
          include: {
            paymentGateway: true,
          },
        },
        transactions: true,
        fees: true,
        refunds: true,
        webhookEvents: true,
      },
    });

    if (!payment) {
      throw new NotFoundException(`Payment with ID ${paymentId} not found`);
    }

    return payment;
  }

  // ========================================
  // PAYMENT METHODS
  // ========================================

  async createPaymentMethod(
    schemaName: string,
    data: CreatePaymentMethodDto,
  ): Promise<PaymentMethodDto> {
    const prisma = this.prisma.getTenantDB(schemaName);

    // Si se marca como default, desmarcar otros
    if (data.isDefault) {
      await prisma.paymentMethod.updateMany({
        where: { userId: data.userId, isDefault: true },
        data: { isDefault: false },
      });
    }

    const paymentMethod = await prisma.paymentMethod.create({
      data,
    });

    return this.mapPaymentMethodToDto(paymentMethod);
  }

  async getUserPaymentMethods(
    schemaName: string,
    userId: string,
  ): Promise<PaymentMethodDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const paymentMethods = await prisma.paymentMethod.findMany({
      where: { userId, isActive: true },
      orderBy: [{ isDefault: 'desc' }, { createdAt: 'desc' }],
    });

    return paymentMethods.map(this.mapPaymentMethodToDto);
  }

  async deletePaymentMethod(
    schemaName: string,
    methodId: string,
    userId: string,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const paymentMethod = await prisma.paymentMethod.findFirst({
      where: { id: methodId, userId },
    });

    if (!paymentMethod) {
      throw new NotFoundException('Payment method not found');
    }

    await prisma.paymentMethod.update({
      where: { id: methodId },
      data: { isActive: false },
    });
  }

  private mapPaymentMethodToDto(method: any): PaymentMethodDto {
    return {
      id: method.id,
      userId: method.userId,
      type: method.type,
      provider: method.provider,
      isDefault: method.isDefault,
      isActive: method.isActive,
      name: method.name,
      last4: method.last4,
      brand: method.brand,
      expiryMonth: method.expiryMonth,
      expiryYear: method.expiryYear,
      bankName: method.bankName,
      paypalEmail: method.paypalEmail,
      createdAt: method.createdAt,
      updatedAt: method.updatedAt,
    };
  }

  // ========================================
  // REFUNDS
  // ========================================

  async createRefund(
    schemaName: string,
    refundData: CreateRefundDto,
  ): Promise<any> {
    const prisma = this.prisma.getTenantDB(schemaName);

    // Buscar el pago original
    const payment = await prisma.payment.findUnique({
      where: { id: refundData.paymentId },
      include: { attempts: { include: { paymentGateway: true } } },
    });

    if (!payment) {
      throw new NotFoundException('Payment not found');
    }

    if (payment.status !== 'COMPLETED') {
      throw new BadRequestException('Can only refund completed payments');
    }

    // Crear registro de reembolso
    const refund = await prisma.paymentRefund.create({
      data: {
        paymentId: refundData.paymentId,
        amount: refundData.amount,
        currency: refundData.currency || payment.currency,
        reason: refundData.reason,
        status: 'PROCESSING',
        notes: refundData.notes,
        metadata: refundData.metadata,
      },
    });

    try {
      // Procesar reembolso según la pasarela
      const gatewayType = payment.attempts[0]?.paymentGateway?.type;
      let gatewayResponse;

      switch (gatewayType) {
        case PaymentGatewayType.STRIPE:
          gatewayResponse = await this.stripeService.createRefund(
            payment.gatewayReference,
            refundData,
          );
          break;

        case PaymentGatewayType.PAYPAL:
          gatewayResponse = await this.paypalService.createRefund(
            payment.gatewayReference,
            refundData,
          );
          break;

        case PaymentGatewayType.PSE:
          gatewayResponse = await this.pseService.createRefund(
            payment.gatewayReference,
            refundData,
          );
          break;

        default:
          throw new BadRequestException(
            `Refunds not supported for gateway type: ${gatewayType}`,
          );
      }

      // Actualizar registro de reembolso
      const updatedRefund = await prisma.paymentRefund.update({
        where: { id: refund.id },
        data: {
          status: gatewayResponse.status,
          gatewayRefundId: gatewayResponse.gatewayReference,
          gatewayResponse: gatewayResponse.data,
          processedAt:
            gatewayResponse.status === 'COMPLETED' ? new Date() : undefined,
        },
      });

      return updatedRefund;
    } catch (error) {
      // Marcar reembolso como fallido
      await prisma.paymentRefund.update({
        where: { id: refund.id },
        data: {
          status: 'FAILED',
          notes: `${refund.notes || ''} Error: ${error.message}`,
        },
      });

      throw error;
    }
  }

  // ========================================
  // WEBHOOK PROCESSING
  // ========================================

  async processStripeWebhook(
    schemaName: string,
    payload: string,
    signature: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.webhookService.processStripeWebhook(
      schemaName,
      payload,
      signature,
    );
  }

  async processPayPalWebhook(
    schemaName: string,
    headers: any,
    body: string,
  ): Promise<{ success: boolean; message: string }> {
    return await this.webhookService.processPayPalWebhook(
      schemaName,
      headers,
      body,
    );
  }

  async processPSENotification(
    schemaName: string,
    notificationData: any,
  ): Promise<{ success: boolean; message: string }> {
    return await this.webhookService.processPSENotification(
      schemaName,
      notificationData,
    );
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  async getPSEBanks(): Promise<any[]> {
    return await this.pseService.getBankList();
  }

  async getTransactionsByPayment(
    schemaName: string,
    paymentId: string,
  ): Promise<TransactionDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const transactions = await prisma.transaction.findMany({
      where: { paymentId },
      orderBy: { createdAt: 'desc' },
    });

    return transactions.map((transaction) => ({
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
    }));
  }

  async getWebhookEvents(
    schemaName: string,
    filters?: { provider?: string; processed?: boolean },
  ): Promise<WebhookEventDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const where: any = {};
    if (filters?.provider) where.provider = filters.provider;
    if (filters?.processed !== undefined) where.processed = filters.processed;

    const events = await prisma.webhookEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 100, // Limitar resultados
    });

    return events.map((event) => ({
      id: event.id,
      provider: event.provider,
      eventType: event.eventType,
      eventId: event.eventId,
      paymentId: event.paymentId,
      processed: event.processed,
      verified: event.verified,
      retryCount: event.retryCount,
      createdAt: event.createdAt,
    }));
  }

  // ========================================
  // SECURITY METHODS
  // ========================================

  private encryptSensitiveData(data: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(
      process.env.ENCRYPTION_KEY || 'default-key',
      'salt',
      32,
    );
    const iv = crypto.randomBytes(16);
    
    const cipher = crypto.createCipher(algorithm, key);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    
    return `${iv.toString('hex')}:${encrypted}`;
  }

  private decryptSensitiveData(encryptedData: string): string {
    const algorithm = 'aes-256-cbc';
    const key = crypto.scryptSync(
      process.env.ENCRYPTION_KEY || 'default-key',
      'salt',
      32,
    );
    
    const [ivHex, encrypted] = encryptedData.split(':');
    const iv = Buffer.from(ivHex, 'hex');
    
    const decipher = crypto.createDecipher(algorithm, key);
    let decrypted = decipher.update(encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    
    return decrypted;
  }

  async retryFailedWebhooks(schemaName: string): Promise<void> {
    await this.webhookService.retryFailedWebhooks(schemaName);
  }
}
