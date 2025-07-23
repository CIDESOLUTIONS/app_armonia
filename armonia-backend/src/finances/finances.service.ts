import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateFeeDto,
  UpdateFeeDto,
  FeeDto,
  FeeFilterParamsDto,
  PaymentStatus,
  CreatePaymentDto,
  UpdatePaymentDto,
  PaymentDto,
  CreateBudgetDto,
  UpdateBudgetDto,
  BudgetDto,
  BudgetFilterParamsDto,
  BudgetStatus,
  ExpenseFilterParamsDto,
} from '../common/dto/finances.dto';
import { CommunicationsService } from '../communications/communications.service';
import {
  NotificationType,
  NotificationSourceType,
} from '../common/dto/communications.dto';

@Injectable()
export class FinancesService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
    private communicationsService: CommunicationsService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  // Fees
  async createFee(schemaName: string, data: CreateFeeDto): Promise<FeeDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const fee = await prisma.fee.create({
      data: { ...data, status: PaymentStatus.PENDING },
    });
    return fee;
  }

  async getFees(
    schemaName: string,
    filters: FeeFilterParamsDto,
  ): Promise<{ fees: FeeDto[]; total: number }> {
    try {
      const prisma = this.getTenantPrismaClient(schemaName);
      const where: any = {};
      if (filters.status) where.status = filters.status;
      if (filters.type) where.type = filters.type;
      if (filters.propertyId) where.propertyId = filters.propertyId;

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [fees, total] = await Promise.all([
        prisma.fee.findMany({
          where,
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
        }),
        prisma.fee.count({ where }),
      ]);

      return { fees, total };
    } catch (error) {
      throw new BadRequestException('Error al obtener cuotas');
    }
  }

  async getFeeById(schemaName: string, id: number): Promise<FeeDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const fee = await prisma.fee.findUnique({ where: { id } });
    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${id} no encontrada.`);
    }
    return fee;
  }

  async getFee(schemaName: string, id: number): Promise<FeeDto | null> {
    try {
      const prisma = this.getTenantPrismaClient(schemaName);
      const fee = await prisma.fee.findUnique({ where: { id } });
      return fee;
    } catch (error) {
      throw new BadRequestException('Error al obtener cuota');
    }
  }

  async updateFee(
    schemaName: string,
    id: number,
    data: UpdateFeeDto,
  ): Promise<FeeDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const fee = await prisma.fee.findUnique({ where: { id } });
    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${id} no encontrada.`);
    }
    return prisma.fee.update({ where: { id }, data });
  }

  async deleteFee(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const fee = await prisma.fee.findUnique({ where: { id } });
    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${id} no encontrada.`);
    }
    await prisma.fee.delete({ where: { id } });
  }

  // Payments
  async createPayment(
    schemaName: string,
    data: CreatePaymentDto,
  ): Promise<PaymentDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const payment = await prisma.payment.create({ data });

    // Update fee status if payment is completed
    if (payment.status === PaymentStatus.PAID && payment.feeId) {
      await prisma.fee.update({
        where: { id: payment.feeId },
        data: { status: PaymentStatus.PAID },
      });
    }
    return payment;
  }

  async registerManualPayment(
    schemaName: string,
    feeId: number,
    userId: number,
    amount: number,
    paymentDate: Date,
    paymentMethod: string,
    transactionId?: string,
  ): Promise<PaymentDto> {
    const prisma = this.getTenantPrismaClient(schemaName);

    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${feeId} no encontrada.`);
    }

    if (fee.status === PaymentStatus.PAID) {
      throw new BadRequestException(`La cuota ${feeId} ya ha sido pagada.`);
    }

    const payment = await prisma.payment.create({
      data: {
        feeId: fee.id,
        userId: userId,
        amount: amount,
        paymentDate: paymentDate,
        status: PaymentStatus.PAID,
        transactionId: transactionId || `MANUAL_${Date.now()}`,
        paymentMethod: 'Simulated Gateway',
      },
    });

    await prisma.fee.update({
      where: { id: fee.id },
      data: { status: PaymentStatus.PAID },
    });

    return payment;
  }

  async getPayments(
    schemaName: string,
    filters: FeeFilterParamsDto,
  ): Promise<{ data: PaymentDto[]; total: number }> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.propertyId) where.propertyId = filters.propertyId;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { paymentDate: 'desc' },
      }),
      prisma.payment.count({ where }),
    ]);

    return { data, total };
  }

  async getPaymentById(schemaName: string, id: number): Promise<PaymentDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado.`);
    }
    return payment;
  }

  async updatePayment(
    schemaName: string,
    id: number,
    data: UpdatePaymentDto,
  ): Promise<PaymentDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado.`);
    }
    const updatedPayment = await prisma.payment.update({ where: { id }, data });

    // Update fee status if payment is completed
    if (
      updatedPayment.status === PaymentStatus.PAID &&
      updatedPayment.feeId
    ) {
      await prisma.fee.update({
        where: { id: updatedPayment.feeId },
        data: { status: PaymentStatus.PAID },
      });

      // Notify user about successful payment
      const user = await prisma.user.findUnique({
        where: { id: updatedPayment.userId },
      });
      if (user) {
        await this.communicationsService.notifyUser(schemaName, user.id, {
          type: NotificationType.INFO,
          title: 'Pago Confirmado',
          message: `Tu pago de ${updatedPayment.amount} para la cuota ${updatedPayment.feeId} ha sido confirmado.`,
          link: `/resident/finances/payments/${updatedPayment.id}`,
          sourceType: NotificationSourceType.FINANCIAL,
          sourceId: updatedPayment.id.toString(),
        });
      }
    }
    return updatedPayment;
  }

  async deletePayment(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado.`);
    }
    await prisma.payment.delete({ where: { id } });
  }

  // Budgets
  async createBudget(
    schemaName: string,
    data: CreateBudgetDto,
  ): Promise<BudgetDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.budget.create({ data });
  }

  async getBudgets(
    schemaName: string,
    filters: BudgetFilterParamsDto,
  ): Promise<{ data: BudgetDto[]; total: number }> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = {};
    if (filters.year) where.year = filters.year;
    if (filters.status) where.status = filters.status;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.budget.findMany({
        where,
        include: { items: true },
        skip,
        take: limit,
        orderBy: { year: 'desc' },
      }),
      prisma.budget.count({ where }),
    ]);

    return { data, total };
  }

  async getBudgetById(schemaName: string, id: number): Promise<BudgetDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado.`);
    }
    return budget;
  }

  async updateBudget(
    schemaName: string,
    id: number,
    data: UpdateBudgetDto,
  ): Promise<BudgetDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const budget = await prisma.budget.findUnique({ where: { id } });
    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado.`);
    }
    return prisma.budget.update({ where: { id }, data });
  }

  async deleteBudget(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const budget = await prisma.budget.findUnique({ where: { id } });
    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado.`);
    }
    await prisma.budget.delete({ where: { id } });
  }

  async approveBudget(
    schemaName: string,
    id: number,
    approvedById: number,
  ): Promise<BudgetDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const budget = await prisma.budget.findUnique({ where: { id } });
    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado.`);
    }
    if (budget.status !== BudgetStatus.DRAFT) {
      throw new BadRequestException(
        `El presupuesto no está en estado BORRADOR y no puede ser aprobado.`,
      );
    }
    return prisma.budget.update({
      where: { id },
      data: {
        status: BudgetStatus.APPROVED,
        approvedById,
        approvedAt: new Date(),
      },
    });
  }

  // Expenses
  async createExpense(
    schemaName: string,
    data: any, // CreateExpenseDto
  ): Promise<any> { // ExpenseDto
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.expense.create({ data });
  }

  async getExpenses(
    schemaName: string,
    filters: ExpenseFilterParamsDto,
  ): Promise<{ data: any[]; total: number }> { // ExpenseDto
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.categoryId) where.categoryId = filters.categoryId;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.expense.count({ where }),
    ]);

    return { data, total };
  }

  async getExpenseById(schemaName: string, id: number): Promise<any> { // ExpenseDto
    const prisma = this.getTenantPrismaClient(schemaName);
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado.`);
    }
    return expense;
  }

  async updateExpense(
    schemaName: string,
    id: number,
    data: any, // UpdateExpenseDto
  ): Promise<any> { // ExpenseDto
    const prisma = this.getTenantPrismaClient(schemaName);
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado.`);
    }
    return prisma.expense.update({ where: { id }, data });
  }

  async deleteExpense(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado.`);
    }
    await prisma.expense.delete({ where: { id } });
  }

  async getFinancialSummary(schemaName: string): Promise<any> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const totalIncome = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.PAID },
    });
    const totalExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: { status: 'PAID' }, // Assuming ExpenseStatus.PAID is 'PAID' string
    });

    const currentBalance =
      (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0);

    // For simplicity, monthly changes are hardcoded or calculated based on recent data
    const monthlyIncome = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.PAID,
        paymentDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const monthlyExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        status: 'PAID',
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const pendingBills = await prisma.fee.count({
      where: { status: PaymentStatus.PENDING },
    });

    const pendingBillsAmount = await prisma.fee.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.PENDING },
    });

    return {
      currentBalance,
      balanceChange: '+5.2%',
      monthlyIncome: monthlyIncome._sum.amount || 0,
      incomeChange: '+2.1%',
      monthlyExpenses: monthlyExpenses._sum.amount || 0,
      expenseChange: '-1.5%',
      pendingBills,
      pendingBillsAmount: pendingBillsAmount._sum.amount || 0,
    };
  }

  async getRecentTransactions(schemaName: string): Promise<any[]> {
    const prisma = this.getTenantPrismaClient(schemaName);

    const recentPayments = await prisma.payment.findMany({
      orderBy: { paymentDate: 'desc' },
      take: 5,
    });

    const recentExpenses = await prisma.expense.findMany({
      orderBy: { date: 'desc' },
      take: 5,
    });

    const transactions = [
      ...recentPayments.map((p) => ({
        id: p.id,
        date: p.paymentDate,
        description: `Pago de cuota ${p.feeId}`,
        amount: p.amount,
        type: 'income',
      })),
      ...recentExpenses.map((e) => ({
        id: e.id,
        date: e.date,
        description: e.description,
        amount: e.amount,
        type: 'expense',
      })),
    ];

    transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    return transactions.slice(0, 5);
  }

  async initiatePayment(
    schemaName: string,
    feeId: number,
    userId: number,
  ): Promise<string> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const fee = await prisma.fee.findUnique({ where: { id: feeId } });

    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${feeId} no encontrada.`);
    }

    if (fee.status !== PaymentStatus.PENDING) {
      throw new BadRequestException(
        `La cuota ${feeId} no está pendiente de pago.`,
      );
    }

    // Simulate payment initiation with a payment gateway
    // In a real scenario, this would interact with a payment gateway SDK (e.g., Stripe, PayU)
    // and return a redirect URL or a client secret.
    const simulatedPaymentUrl = `https://simulated-payment-gateway.com/pay?amount=${fee.amount}&feeId=${fee.id}&userId=${userId}`;

    // Create a pending payment record
    await prisma.payment.create({
      data: {
        feeId: fee.id,
        userId: userId,
        amount: fee.amount,
        paymentDate: new Date(),
        status: PaymentStatus.PENDING,
        transactionId: `simulated_tx_${Date.now()}`,
        paymentMethod: 'Simulated Gateway',
      },
    });

    // Notify user about payment initiation
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await this.communicationsService.notifyUser(schemaName, user.id, {
        type: NotificationType.INFO,
        title: 'Pago Iniciado',
        message: `Se ha iniciado el pago de tu cuota ${fee.title}. Por favor, completa la transacción.`,
        link: simulatedPaymentUrl,
        sourceType: NotificationSourceType.FINANCIAL,
        sourceId: fee.id.toString(),
      });
    }

    return simulatedPaymentUrl;
  }

  async handlePaymentWebhook(
    schemaName: string,
    transactionId: string,
    status: PaymentStatus,
  ): Promise<PaymentDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
    });

    if (!payment) {
      throw new NotFoundException(
        `Transacción ${transactionId} no encontrada.`,
      );
    }

    if (payment.status === PaymentStatus.PAID) {
      return payment; // Already completed, no action needed
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status, paymentDate: new Date() },
    });

    // Update fee status if payment is completed
    if (
      updatedPayment.status === PaymentStatus.PAID &&
      updatedPayment.feeId
    ) {
      await prisma.fee.update({
        where: { id: updatedPayment.feeId },
        data: { status: PaymentStatus.PAID },
      });

      // Notify user about successful payment
      const user = await prisma.user.findUnique({
        where: { id: updatedPayment.userId },
      });
      if (user) {
        await this.communicationsService.notifyUser(schemaName, user.id, {
          type: NotificationType.INFO,
          title: 'Pago Confirmado',
          message: `Tu pago de ${updatedPayment.amount} para la cuota ${updatedPayment.feeId} ha sido confirmado.`,
          link: `/resident/finances/payments/${updatedPayment.id}`,
          sourceType: NotificationSourceType.FINANCIAL,
          sourceId: updatedPayment.id.toString(),
        });
      }
    }
    return updatedPayment;
  }
}