import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  PaymentStatus,
  FeeType,
  FeeDto,
  PaymentDto,
  BudgetDto,
  FeeListResponseDto,
  CreateFeeDto,
  UpdateFeeDto,
  CreatePaymentDto,
  CreateBudgetDto,
  FeeFilterParamsDto,
  BudgetStatus,
  FinancialReportResponseDto,
  InitiatePaymentDto,
  PaymentGatewayCallbackDto,
} from '../common/dto/finances.dto';
import { ServerLogger } from 'C:/Users/videc/Documents/app_armonia/armonia-backend/src/lib/logging/server-logger';
import { encrypt, decrypt } from 'C:/Users/videc/Documents/app_armonia/armonia-backend/src/lib/security/encryption-service';
import { ActivityLogger } from 'C:/Users/videc/Documents/app_armonia/armonia-backend/src/lib/logging/activity-logger';
import { CommunicationService } from '../communications/communications.service';
import { PdfService } from '../common/services/pdf.service';

// Interfaces para adaptadores de pasarelas de pago
interface PaymentGatewayAdapter {
  initialize(config: any): Promise<boolean>;
  createPayment(transaction: any): Promise<any>;
  processPayment(transactionId: string, paymentData: any): Promise<any>;
  verifyPayment(gatewayReference: string): Promise<any>;
  refundPayment(gatewayReference: string, amount?: number): Promise<any>;
  validateWebhook(payload: any, signature: string, secret: string): boolean; // Added secret
}

// Implementación de adaptador para PayU Latam (simplificado)
export class PayUAdapter implements PaymentGatewayAdapter {
  private apiKey: string;
  private apiSecret: string;
  private merchantId: string;
  private accountId: string;
  private testMode: boolean;

  async initialize(config: any): Promise<boolean> {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.merchantId = config.merchantId;
    this.accountId = config.accountId || '';
    this.testMode = config.testMode || false;
    return true; // Simplified for example
  }

  async createPayment(transaction: any): Promise<any> {
    const paymentUrl = this.testMode
      ? `https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/payment/${transaction.id}`
      : `https://checkout.payulatam.com/ppp-web-gateway-payu/payment/${transaction.id}`;
    return {
      success: true,
      paymentUrl,
      gatewayReference: `PAYU_${Date.now()}_${transaction.id}`,
      status: 'PENDING',
    };
  }

  async processPayment(transactionId: string, paymentData: any): Promise<any> {
    return {
      success: true,
      gatewayReference: `PAYU_${Date.now()}_${transactionId}`,
      status: 'COMPLETED',
      response: {
        authorizationCode: `AUTH_${Math.floor(Math.random() * 1000000)}`,
        processorResponseCode: '00',
        transactionDate: new Date().toISOString(),
      },
    };
  }

  async verifyPayment(gatewayReference: string): Promise<any> {
    return {
      success: true,
      status: 'COMPLETED',
      response: {
        authorizationCode: gatewayReference.split('_')[2],
        processorResponseCode: '00',
        transactionDate: new Date().toISOString(),
      },
    };
  }

  async refundPayment(gatewayReference: string, amount?: number): Promise<any> {
    return {
      success: true,
      refundReference: `REFUND_${gatewayReference}`,
      status: 'REFUNDED',
      amount: amount,
    };
  }

  validateWebhook(payload: any, signature: string, secret: string): boolean {
    // TODO: Implement real webhook signature validation (e.g., HMAC-SHA256)
    // For now, a simple check for a shared secret in the payload or header
    // In a real scenario, this would involve cryptographic verification.
    ServerLogger.warn('Webhook validation is simplified. Implement real signature verification.');
    return true; // Placeholder: Critical security vulnerability if not properly implemented
  }
}

// Implementación de adaptador para Wompi (simplificado)
export class WompiAdapter implements PaymentGatewayAdapter {
  private apiKey: string;
  private apiSecret: string;
  private testMode: boolean;

  async initialize(config: any): Promise<boolean> {
    this.apiKey = config.apiKey;
    this.apiSecret = config.apiSecret;
    this.testMode = config.testMode || false;
    return true; // Simplified for example
  }

  async createPayment(transaction: any): Promise<any> {
    const paymentUrl = this.testMode
      ? `https://sandbox.checkout.wompi.co/p/${transaction.id}`
      : `https://checkout.wompi.co/p/${transaction.id}`;
    return {
      success: true,
      paymentUrl,
      gatewayReference: `WOMPI_${Date.now()}_${transaction.id}`,
      status: 'PENDING',
    };
  }

  async processPayment(transactionId: string, paymentData: any): Promise<any> {
    return {
      success: true,
      gatewayReference: `WOMPI_${Date.now()}_${transactionId}`,
      status: 'COMPLETED',
      response: {
        authorizationCode: `AUTH_${Math.floor(Math.random() * 1000000)}`,
        processorResponseCode: 'APPROVED',
        transactionDate: new Date().toISOString(),
      },
    };
  }

  async verifyPayment(gatewayReference: string): Promise<any> {
    return {
      success: true,
      status: 'COMPLETED',
      response: {
        authorizationCode: gatewayReference.split('_')[2],
        processorResponseCode: 'APPROVED',
        transactionDate: new Date().toISOString(),
      },
    };
  }

  async refundPayment(gatewayReference: string, amount?: number): Promise<any> {
    return {
      success: true,
      refundReference: `REFUND_${gatewayReference}`,
      status: 'REFUNDED',
      amount: amount,
    };
  }

  validateWebhook(payload: any, signature: string, secret: string): boolean {
    // TODO: Implement real webhook signature validation (e.g., HMAC-SHA256)
    // For now, a simple check for a shared secret in the payload or header
    // In a real scenario, this would involve cryptographic verification.
    ServerLogger.warn('Webhook validation is simplified. Implement real signature verification.');
    return true; // Placeholder: Critical security vulnerability if not properly implemented
  }
}

// Fábrica de adaptadores de pasarelas
export class PaymentGatewayFactory {
  static createAdapter(gatewayName: string): PaymentGatewayAdapter | null {
    switch (gatewayName.toLowerCase()) {
      case 'payu':
        return new PayUAdapter();
      case 'wompi':
        return new WompiAdapter();
      default:
        ServerLogger.error(`Pasarela no soportada: ${gatewayName}`);
        return null;
    }
  }
}

@Injectable()
export class FinancesService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
    private communicationService: CommunicationService,
    private pdfService: PdfService, // Inyectar PdfService
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async getFees(
    schemaName: string,
    filters: FeeFilterParamsDto = {},
  ): Promise<FeeListResponseDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const where: any = {};
      if (filters.status) where.status = filters.status;
      if (filters.type) where.type = filters.type;
      if (filters.propertyId) where.propertyId = filters.propertyId;
      if (filters.startDate)
        where.dueDate = { gte: new Date(filters.startDate) };
      if (filters.endDate)
        where.dueDate = { ...where.dueDate, lte: new Date(filters.endDate) };
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const fees = await prisma.fee.findMany({
        where,
        skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
        take: filters.limit ?? 10,
        orderBy: { createdAt: 'desc' },
      });
      const total = await prisma.fee.count({ where });

      return {
        fees,
        total,
        page: filters.page || 1,
        limit: filters.limit || 10,
      };
    } catch (error) {
      console.error('Error al obtener cuotas:', error);
      throw new Error('Error al obtener cuotas');
    }
  }

  async getFee(schemaName: string, id: number): Promise<FeeDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.fee.findUnique({ where: { id } });
    } catch (error) {
      console.error(`Error al obtener cuota ${id}:`, error);
      throw new Error('Error al obtener cuota');
    }
  }

  async createFee(schemaName: string, data: CreateFeeDto): Promise<FeeDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.fee.create({ data });
    } catch (error) {
      console.error('Error al crear cuota:', error);
      throw new Error('Error al crear cuota');
    }
  }

  async updateFee(
    schemaName: string,
    id: number,
    data: UpdateFeeDto,
  ): Promise<FeeDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.fee.update({ where: { id }, data });
    } catch (error) {
      console.error(`Error al actualizar cuota ${id}:`, error);
      throw new Error('Error al actualizar cuota');
    }
  }

  async deleteFee(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      await prisma.fee.delete({ where: { id } });
    } catch (error) {
      console.error(`Error al eliminar cuota ${id}:`, error);
      throw new Error('Error al eliminar cuota');
    }
  }

  async createPayment(
    schemaName: string,
    data: CreatePaymentDto,
  ): Promise<PaymentDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.payment.create({ data });
    } catch (error) {
      console.error('Error al registrar pago:', error);
      throw new Error('Error al registrar pago');
    }
  }

  async getPropertyPayments(
    schemaName: string,
    propertyId: number,
  ): Promise<PaymentDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.payment.findMany({ where: { propertyId } });
    } catch (error) {
      console.error(
        `Error al obtener pagos de propiedad ${propertyId}:`,
        error,
      );
      throw new Error('Error al obtener pagos de propiedad');
    }
  }

  async getPropertyBalance(schemaName: string, propertyId: number) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const totalFees = await prisma.fee.aggregate({
        _sum: { amount: true },
        where: { propertyId },
      });
      const totalPayments = await prisma.payment.aggregate({
        _sum: { amount: true },
        where: { propertyId },
      });
      const balance =
        (totalFees._sum.amount || 0) - (totalPayments._sum.amount || 0);
      return { balance };
    } catch (error) {
      console.error(
        `Error al obtener balance de propiedad ${propertyId}:`,
        error,
      );
      throw new Error('Error al obtener balance de propiedad');
    }
  }

  async generateOrdinaryFees(
    schemaName: string,
    amount: number,
    dueDate: string,
    title: string,
    description: string,
    propertyIds?: number[],
  ) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const properties = await prisma.property.findMany({
        where: propertyIds ? { id: { in: propertyIds } } : undefined,
        select: { id: true },
      });
      const feesToCreate = properties.map((prop) => ({
        title,
        description,
        amount,
        type: FeeType.ORDINARY,
        dueDate,
        propertyId: prop.id,
      }));
      await prisma.fee.createMany({ data: feesToCreate });
      return { count: feesToCreate.length };
    } catch (error) {
      console.error('Error al generar cuotas ordinarias:', error);
      throw new Error('Error al generar cuotas ordinarias');
    }
  }

  async createBudget(
    schemaName: string,
    data: CreateBudgetDto,
  ): Promise<BudgetDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const { items, ...budgetData } = data;
      const budget = await prisma.budget.create({
        data: {
          ...budgetData,
          items: { create: items },
        },
        include: { items: true },
      });
      return budget;
    } catch (error) {
      console.error('Error al crear presupuesto:', error);
      throw new Error('Error al crear presupuesto');
    }
  }

  async getBudgetsByYear(
    schemaName: string,
    year: number,
  ): Promise<BudgetDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.budget.findMany({
        where: { year },
        include: { items: true },
      });
    } catch (error) {
      console.error(
        `Error al obtener presupuestos para el año ${year}:`,
        error,
      );
      throw new Error('Error al obtener presupuestos por año');
    }
  }

  async approveBudget(schemaName: string, id: number, userId: number): Promise<BudgetDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const budget = await prisma.budget.findUnique({
        where: { id },
      });

      if (!budget) {
        throw new NotFoundException(`Presupuesto con ID ${id} no encontrado.`);
      }

      if (budget.status !== BudgetStatus.DRAFT) {
        throw new Error(`El presupuesto con ID ${id} no puede ser aprobado porque su estado actual es ${budget.status}. Solo los presupuestos en estado DRAFT pueden ser aprobados.`);
      }

      return await prisma.budget.update({
        where: { id },
        data: {
          status: BudgetStatus.APPROVED,
          approvedById: userId,
          approvedDate: new Date(),
        },
      });
    } catch (error) {
      console.error(`Error al aprobar presupuesto ${id}:`, error);
      throw new Error('Error al aprobar presupuesto');
    }
  }

  async getFinancialStats(schemaName: string) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const totalIncome = await prisma.payment.aggregate({
        _sum: { amount: true },
      });
      const totalExpenses = await prisma.fee.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.PAID }, // Asumiendo que las cuotas pagadas son egresos
      });
      const pendingFees = await prisma.fee.aggregate({
        _sum: { amount: true },
        where: { status: PaymentStatus.PENDING },
      });

      return {
        totalIncome: totalIncome._sum.amount || 0,
        totalExpenses: totalExpenses._sum.amount || 0,
        currentBalance:
          (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
        pendingFees: pendingFees._sum.amount || 0,
      };
    } catch (error) {
      console.error('Error al obtener estadísticas financieras:', error);
      throw new Error('Error al obtener estadísticas financieras');
    }
  }

  async generateFinancialReport(
    schemaName: string,
    startDate: string,
    endDate: string,
    type: 'INCOME' | 'EXPENSE' | 'BALANCE' | 'DEBTORS' | 'PAYMENTS_REPORT' | 'PEACE_AND_SAFE',
    format: 'JSON' | 'PDF' = 'JSON',
  ): Promise<FinancialReportResponseDto | Buffer> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const start = new Date(startDate);
    const end = new Date(endDate);

    let totalIncome = 0;
    let totalExpenses = 0;
    let transactions: any[] = [];
    let fees: any[] = [];
    let payments: any[] = [];
    let debtors: any[] = [];
    let peaceAndSafes: any[] = [];

    switch (type) {
      case 'INCOME':
        payments = await prisma.payment.findMany({
          where: {
            date: { gte: start, lte: end },
          },
          include: { bill: true, property: true, createdByUser: true },
        });
        totalIncome = payments.reduce((sum, p) => sum + p.amount.toNumber(), 0);
        transactions = payments;
        break;
      case 'EXPENSE':
        fees = await prisma.fee.findMany({
          where: {
            dueDate: { gte: start, lte: end },
            status: PaymentStatus.PAID,
          },
          include: { property: true },
        });
        totalExpenses = fees.reduce((sum, f) => sum + f.amount.toNumber(), 0);
        transactions = fees;
        break;
      case 'BALANCE':
        payments = await prisma.payment.findMany({
          where: {
            date: { gte: start, lte: end },
          },
          include: { bill: true, property: true, createdByUser: true },
        });
        totalIncome = payments.reduce((sum, p) => sum + p.amount.toNumber(), 0);

        fees = await prisma.fee.findMany({
          where: {
            dueDate: { gte: start, lte: end },
            status: PaymentStatus.PAID,
          },
          include: { property: true },
        });
        totalExpenses = fees.reduce((sum, f) => sum + f.amount.toNumber(), 0);
        transactions = [...payments, ...fees];
        break;
      case 'DEBTORS':
        const outstandingFees = await prisma.fee.findMany({
          where: {
            status: PaymentStatus.PENDING,
            dueDate: { lte: new Date() },
          },
          include: { property: { include: { residents: true } } },
        });

        const debtorMap = new Map<number, any>();

        for (const fee of outstandingFees) {
          if (!debtorMap.has(fee.propertyId)) {
            debtorMap.set(fee.propertyId, {
              property: fee.property,
              outstandingAmount: 0,
              fees: [],
            });
          }
          const debtor = debtorMap.get(fee.propertyId);
          debtor.outstandingAmount += fee.amount.toNumber();
          debtor.fees.push(fee);
        }
        debtors = Array.from(debtorMap.values());
        break;
      case 'PAYMENTS_REPORT':
        payments = await prisma.payment.findMany({
          where: {
            date: { gte: start, lte: end },
          },
          include: { bill: true, property: true, createdByUser: true },
        });
        transactions = payments;
        break;
      case 'PEACE_AND_SAFE':
        const allProperties = await prisma.property.findMany({
          include: { fees: true, residents: true },
        });

        peaceAndSafes = allProperties.filter(property => {
          const hasPendingFees = property.fees.some(fee => fee.status === PaymentStatus.PENDING && fee.dueDate <= new Date());
          return !hasPendingFees;
        }).map(property => ({
          property,
          certificateDate: new Date(),
        }));
        break;
      default:
        break;
    }

    const reportData = {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      transactions,
      fees,
      payments,
      debtors,
      peaceAndSafes,
    };

    if (format === 'PDF') {
      return this.pdfService.generateFinancialReportPdf(reportData);
    } else {
      return reportData;
    }
  }

  async processBankStatement(
    schemaName: string,
    file: any,
  ): Promise<any[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    ServerLogger.info(
      `Procesando extracto bancario para ${schemaName}: ${file.originalname}`,
    );

    const transactions = [
      {
        date: '2025-07-01',
        description: 'Pago Cuota Admin Apto 101',
        amount: 350000,
      },
      {
        date: '2025-07-02',
        description: 'Transferencia Residente 203',
        amount: 400000,
      },
    ];

    const suggestions: any[] = [];

    for (const transaction of transactions) {
      const matchingPayment = await prisma.payment.findFirst({
        where: {
          amount: transaction.amount,
        },
      });

      suggestions.push({
        transaction,
        matchingPayment: matchingPayment || null,
        status: matchingPayment ? 'MATCHED' : 'UNMATCHED',
      });
    }

    return suggestions;
  }

  async initiatePayment(
    schemaName: string,
    userId: number,
    data: InitiatePaymentDto,
  ): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    ServerLogger.info(
      `Iniciando pago para la cuota ${data.feeId} a través de ${data.paymentMethod}`,
    );

    const bill = await prisma.bill.findUnique({
      where: { id: data.feeId },
    });

    if (!bill) {
      throw new NotFoundException(`Factura con ID ${data.feeId} no encontrada.`);
    }

    // Obtener pasarela y método de pago dinámicamente
    const gateway = await this.prisma.paymentGateway.findFirst({
      where: { isActive: true, supportedMethods: { has: data.paymentMethod } },
    });
    const method = await this.prisma.paymentMethod.findFirst({
      where: { isActive: true, code: data.paymentMethod },
    });

    if (!gateway || !method) {
      throw new Error('Pasarela o método de pago no configurado o inactivo.');
    }

    const paymentGatewayResponse = {
      transactionId: `txn_${Date.now()}`,
      paymentUrl: `https://mock-payment-gateway.com/pay?id=${data.feeId}&amount=${bill.totalAmount}&ref=${data.feeId}`,
      status: 'PENDING',
    };

    await prisma.paymentAttempt.create({
      data: {
        feeId: data.feeId,
        userId: userId,
        amount: bill.totalAmount.toNumber(),
        paymentMethod: data.paymentMethod,
        transactionId: paymentGatewayResponse.transactionId,
        status: paymentGatewayResponse.status,
        propertyId: bill.propertyId, // Ensure propertyId is set
      },
    });

    return paymentGatewayResponse;
  }

  async handlePaymentCallback(data: PaymentGatewayCallbackDto): Promise<any> {
    const prisma = this.prisma.client;
    ServerLogger.info(
      `Callback de pago recibido para transacción ${data.transactionId} con estado ${data.status}`,
    );

    const paymentAttempt = await prisma.paymentAttempt.findUnique({
      where: { transactionId: data.transactionId },
      include: { fee: true },
    });

    if (!paymentAttempt) {
      throw new NotFoundException(
        `Intento de pago con ID ${data.transactionId} no encontrado.`,
      );
    }

    await prisma.paymentAttempt.update({
      where: { id: paymentAttempt.id },
      data: { status: data.status },
    });

    if (data.status === 'COMPLETED') {
      await prisma.payment.create({
        data: {
          amount: paymentAttempt.amount,
          date: new Date().toISOString(),
          method: paymentAttempt.paymentMethod,
          reference: paymentAttempt.transactionId,
          receiptNumber: `REC-${Date.now()}`,
          feeId: paymentAttempt.feeId,
          propertyId: paymentAttempt.fee.propertyId,
          createdBy: paymentAttempt.userId,
        },
      });

      await prisma.fee.update({
        where: { id: paymentAttempt.feeId },
        data: { status: PaymentStatus.PAID },
      });

      // Notify user about successful payment
      const user = await prisma.user.findUnique({ where: { id: paymentAttempt.userId } });
      if (user && user.email) {
        await this.communicationService.notifyUser('global', user.id, {
          type: 'success',
          title: 'Pago Confirmado',
          message: `Tu pago de ${paymentAttempt.amount} ha sido procesado exitosamente.`,
          sourceType: 'financial',
          sourceId: paymentAttempt.transactionId,
        });
      }
    }

    return { message: `Callback de pago procesado para ${data.transactionId}` };
  }

  async approveReconciliation(schemaName: string, suggestion: any): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    ServerLogger.info(`Aprobando conciliación para ${schemaName}:`, suggestion);

    if (suggestion.payment && suggestion.payment.id) {
      await prisma.payment.update({
        where: { id: suggestion.payment.id },
        data: { status: PaymentStatus.COMPLETED, reconciled: true },
      });
      if (suggestion.payment.feeId) {
        await prisma.fee.update({
          where: { id: suggestion.payment.feeId },
          data: { status: PaymentStatus.PAID },
        });
      }
    }

    return { message: 'Conciliación aprobada exitosamente.' };
  }
}