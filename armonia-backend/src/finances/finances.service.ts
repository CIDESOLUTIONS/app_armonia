import { Injectable, NotFoundException } from '@nestjs/common'; // Importar NotFoundException
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
  FinancialReportResponseDto, // Importar FinancialReportResponseDto
  InitiatePaymentDto, // Importar InitiatePaymentDto
  PaymentGatewayCallbackDto, // Importar PaymentGatewayCallbackDto
} from '../common/dto/finances.dto';

@Injectable()
export class FinancesService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
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
        skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10), // Usar ??
        take: filters.limit ?? 10, // Usar ??
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

  async approveBudget(schemaName: string, id: number): Promise<BudgetDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.budget.update({
        where: { id },
        data: { status: BudgetStatus.APPROVED },
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
    type: 'INCOME' | 'EXPENSE' | 'BALANCE',
  ): Promise<FinancialReportResponseDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const start = new Date(startDate);
    const end = new Date(endDate);

    let totalIncome = 0;
    let totalExpenses = 0;
    let transactions: any[] = [];
    let fees: any[] = [];
    let payments: any[] = [];

    if (type === 'INCOME' || type === 'BALANCE') {
      payments = await prisma.payment.findMany({
        where: {
          date: { gte: start, lte: end },
        },
      });
      totalIncome = payments.reduce((sum, p) => sum + p.amount, 0);
    }

    if (type === 'EXPENSE' || type === 'BALANCE') {
      fees = await prisma.fee.findMany({
        where: {
          dueDate: { gte: start, lte: end },
          status: PaymentStatus.PAID, // Asumiendo que las cuotas pagadas son egresos
        },
      });
      totalExpenses = fees.reduce((sum, f) => sum + f.amount, 0);
    }

    // For a more detailed report, you might fetch all relevant transactions
    // and categorize them. This is a simplified example.
    transactions = [...payments, ...fees];

    return {
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses,
      transactions,
      fees,
      payments,
    };
  }

  async processBankStatement(
    schemaName: string,
    file: any, // Cambiado a any
  ): Promise<any[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Aquí iría la lógica para leer el archivo (CSV/XLSX) y procesar las transacciones.
    // Por ahora, es un placeholder que simula sugerencias de conciliación.
    console.log(
      `Procesando extracto bancario para ${schemaName}: ${file.originalname}`,
    );

    // Simulación de lectura y procesamiento
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

    const suggestions: any[] = []; // Tipado explícito como any[]

    for (const transaction of transactions) {
      // Simular búsqueda de pagos coincidentes en la DB
      const matchingPayment = await prisma.payment.findFirst({
        where: {
          amount: transaction.amount,
          // Aquí se añadirían más criterios de búsqueda como fecha, referencia, etc.
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
    // Lógica para iniciar el pago con una pasarela externa
    console.log(
      `Iniciando pago para la cuota ${data.feeId} a través de ${data.paymentMethod}`,
    );

    const bill = await prisma.bill.findUnique({
      where: { id: data.feeId },
    });

    if (!bill) {
      throw new NotFoundException(`Factura con ID ${data.feeId} no encontrada.`);
    }

    // Simulación de una respuesta de pasarela de pago
    const paymentGatewayResponse = {
      transactionId: `txn_${Date.now()}`,
      paymentUrl: `https://mock-payment-gateway.com/pay?id=${data.feeId}&amount=${bill.totalAmount}&ref=${data.feeId}`,
      status: 'PENDING',
    };

    // Opcional: Registrar el intento de pago en la DB
    await prisma.paymentAttempt.create({
      data: {
        feeId: data.feeId,
        userId: userId,
        amount: bill.totalAmount.toNumber(),
        paymentMethod: data.paymentMethod,
        transactionId: paymentGatewayResponse.transactionId,
        status: paymentGatewayResponse.status,
      },
    });

    return paymentGatewayResponse;
  }

  async handlePaymentCallback(data: PaymentGatewayCallbackDto): Promise<any> {
    const prisma = this.prisma.client; // Acceder al cliente Prisma global o de esquema si el callback no tiene schemaName
    // Lógica para manejar el callback de la pasarela de pago
    console.log(
      `Callback de pago recibido para transacción ${data.transactionId} con estado ${data.status}`,
    );

    // Buscar el intento de pago
    const paymentAttempt = await prisma.paymentAttempt.findUnique({
      where: { transactionId: data.transactionId },
      include: { fee: true }, // Incluir la relación con Fee
    });

    if (!paymentAttempt) {
      throw new NotFoundException(
        `Intento de pago con ID ${data.transactionId} no encontrado.`,
      );
    }

    // Actualizar el estado del intento de pago
    await prisma.paymentAttempt.update({
      where: { id: paymentAttempt.id },
      data: { status: data.status },
    });

    // Si el pago fue exitoso, registrar el pago final y actualizar la cuota
    if (data.status === 'COMPLETED') {
      await prisma.payment.create({
        data: {
          amount: paymentAttempt.amount,
          date: new Date().toISOString(),
          method: paymentAttempt.paymentMethod,
          reference: paymentAttempt.transactionId,
          receiptNumber: `REC-${Date.now()}`,
          feeId: paymentAttempt.feeId,
          propertyId: paymentAttempt.fee.propertyId, // Obtener propertyId de la Fee
          createdBy: paymentAttempt.userId,
        },
      });

      await prisma.fee.update({
        where: { id: paymentAttempt.feeId },
        data: { status: PaymentStatus.PAID },
      });
    }

    return { message: `Callback de pago procesado para ${data.transactionId}` };
  }

  async approveReconciliation(schemaName: string, suggestion: any): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Lógica para aprobar la sugerencia de conciliación
    // Esto implicaría marcar el pago como conciliado y posiblemente actualizar el estado de la cuota
    console.log(
      `Aprobando conciliación para ${schemaName}:`, suggestion
    );

    // Ejemplo: Marcar el pago sugerido como conciliado y la cuota como pagada
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

    return { message: "Conciliación aprobada exitosamente." };
  }
}