import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateFeeDto, UpdateFeeDto, FeeDto, CreatePaymentDto, UpdatePaymentDto, PaymentDto, CreateBudgetDto, UpdateBudgetDto, BudgetDto, CreateExpenseDto, UpdateExpenseDto, ExpenseDto, BudgetItemDto, FeeFilterParamsDto, BudgetFilterParamsDto, ExpenseFilterParamsDto } from '../common/dto/finances.dto';
import { FeeType, PaymentStatus, PaymentMethodType, BudgetStatus, Prisma } from '@prisma/client';
import Decimal from 'decimal.js';
import { CommunicationsService } from '../communications/communications.service';
import { NotificationType, NotificationSourceType } from '../common/dto/communications.dto';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class FinancesService {
  constructor(
    private prisma: PrismaService,
    private communicationsService: CommunicationsService,
    ) {}

  // Fee Management
  async createFee(schemaName: string, data: CreateFeeDto): Promise<FeeDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const fee = await prisma.fee.create({
      data: {
        title: data.title,
        description: data.description,
        amount: data.amount,
        dueDate: data.dueDate,
        type: data.type as FeeType,
        property: { connect: { id: data.propertyId } },
        isRecurring: data.isRecurring,
        frequency: data.frequency,
        paid: false,
      },
    });
    return { ...fee, amount: fee.amount.toNumber(), status: fee.paid ? PaymentStatus.PAID : PaymentStatus.PENDING };
  }

  async getFees(
    schemaName: string,
    filters: FeeFilterParamsDto,
  ): Promise<{ fees: FeeDto[]; total: number }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      const where: Prisma.FeeWhereInput = {};
      if (filters.type) where.type = filters.type as FeeType;
      if (filters.propertyId) where.propertyId = filters.propertyId;
      if (filters.status) where.paid = filters.status === PaymentStatus.PAID;

      const page = filters.page || 1;
      const limit = filters.limit || 10;
      const skip = (page - 1) * limit;

      const [fees, total] = await Promise.all([
        prisma.fee.findMany({
          where,
          skip,
          take: limit,
          orderBy: { dueDate: 'desc' },
        }),
        prisma.fee.count({ where }),
      ]);

      return {
        fees: fees.map((fee) => ({
          ...fee,
          amount: fee.amount.toNumber(),
          status: fee.paid ? PaymentStatus.PAID : PaymentStatus.PENDING,
        })),
        total,
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener cuotas');
    }
  }

  async getFeeById(schemaName: string, id: string): Promise<FeeDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const fee = await prisma.fee.findUnique({ where: { id } });
    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${id} no encontrada.`);
    }
    return { ...fee, amount: fee.amount.toNumber(), status: fee.paid ? PaymentStatus.PAID : PaymentStatus.PENDING };
  }

  async updateFee(
    schemaName: string,
    id: string,
    data: UpdateFeeDto,
  ): Promise<FeeDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const updatedFee = await prisma.fee.update({
        where: { id },
        data: {
            ...data,
            amount: data.amount ? new Decimal(data.amount) : undefined,
            type: data.type as FeeType | undefined,
        }
    });
    return { ...updatedFee, amount: updatedFee.amount.toNumber(), status: updatedFee.paid ? PaymentStatus.PAID : PaymentStatus.PENDING };
  }

  async deleteFee(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await prisma.fee.delete({ where: { id } });
  }

  async generateOrdinaryFees(schemaName: string): Promise<{ count: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const properties = await prisma.property.findMany();

    const feesToCreate = properties.map((property) => ({
      title: `Cuota Ordinaria ${new Date().toLocaleString('es-CO', {
        month: 'long',
        year: 'numeric',
      })}`,
      amount: 100000, 
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
      type: FeeType.ORDINARY,
      propertyId: property.id,
      isRecurring: true,
      frequency: 'MONTHLY',
      paid: false,
    }));

    const createdFees = await prisma.fee.createMany({ data: feesToCreate });

    return { count: createdFees.count };
  }

  // Payments
  async createPayment(
    schemaName: string,
    data: CreatePaymentDto,
  ): Promise<PaymentDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const payment = await prisma.payment.create({ 
        data: {
            ...data,
            amount: new Decimal(data.amount),
            status: data.status as PaymentStatus,
            method: data.method as PaymentMethodType,
            user: { connect: { id: data.userId } },
            fees: data.feeId ? { connect: { id: data.feeId } } : undefined,
        }
     });

    if (payment.status === PaymentStatus.COMPLETED && data.feeId) {
      await prisma.fee.update({
        where: { id: data.feeId },
        data: { paid: true, paidAt: new Date() },
      });
    }
    return { ...payment, amount: payment.amount.toNumber(), status: payment.status as PaymentStatus };
  }

  async registerManualPayment(
    schemaName: string,
    feeId: string,
    userId: string,
    amount: number,
    paymentDate: Date,
    paymentMethod: string,
    transactionId?: string,
  ): Promise<PaymentDto> {
    const prisma = this.prisma.getTenantDB(schemaName);

    const fee = await prisma.fee.findUnique({ where: { id: feeId } });
    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${feeId} no encontrada.`);
    }

    if (fee.paid === true) {
      throw new BadRequestException(`La cuota ${feeId} ya ha sido pagada.`);
    }

    const payment = await prisma.payment.create({
      data: {
        userId: userId,
        amount: new Decimal(amount),
        date: paymentDate,
        status: PaymentStatus.COMPLETED,
        transactionId: transactionId || `MANUAL_${Date.now()}`,
        method: paymentMethod as PaymentMethodType,
      },
    });

    await prisma.fee.update({
      where: { id: fee.id },
      data: { paid: true, paidAt: new Date(), paymentId: payment.id },
    });

    return { ...payment, amount: payment.amount.toNumber(), status: payment.status as PaymentStatus };
  }

  async getPayments(
    schemaName: string,
    filters: FeeFilterParamsDto,
  ): Promise<{ data: PaymentDto[]; total: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: Prisma.PaymentWhereInput = {};
    if (filters.status) where.status = filters.status as PaymentStatus;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [payments, total] = await Promise.all([
      prisma.payment.findMany({
        where,
        skip,
        take: limit,
        orderBy: { date: 'desc' },
        include: { fees: true },
      }),
      prisma.payment.count({ where }),
    ]);

    return {
      data: payments.map((p) => ({ ...p, amount: p.amount.toNumber(), status: p.status as PaymentStatus })),
      total,
    };
  }

  async getPaymentById(schemaName: string, id: string): Promise<PaymentDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado.`);
    }
    return { ...payment, amount: payment.amount.toNumber(), status: payment.status as PaymentStatus };
  }

  async updatePayment(
    schemaName: string,
    id: string,
    data: UpdatePaymentDto,
  ): Promise<PaymentDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { fees: true },
    });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado.`);
    }
    const updatedPayment = await prisma.payment.update({ 
        where: { id }, 
        data: {
            ...data,
            amount: data.amount ? new Decimal(data.amount) : undefined,
            status: data.status as PaymentStatus | undefined,
            method: data.method as PaymentMethodType | undefined,
        } 
    });

    if (
      updatedPayment.status === PaymentStatus.COMPLETED &&
      payment.fees.length > 0
    ) {
      await prisma.fee.updateMany({
        where: { id: { in: payment.fees.map(f => f.id) } },
        data: { paid: true, paidAt: new Date() },
      });

      const user = await prisma.user.findUnique({
        where: { id: updatedPayment.userId },
      });
      if (user) {
        await this.communicationsService.notifyUser(schemaName, user.id, {
          type: NotificationType.INFO,
          title: 'Pago Confirmado',
          message: `Tu pago de ${updatedPayment.amount.toNumber()} para la cuota ${payment.fees[0].title} ha sido confirmado.`,
          link: `/resident/finances/payments/${updatedPayment.id}`,
          sourceType: NotificationSourceType.FINANCIAL,
          sourceId: updatedPayment.id.toString(),
        });
      }
    }
    return {
      ...updatedPayment,
      amount: updatedPayment.amount.toNumber(),
      status: updatedPayment.status as PaymentStatus,
    };
  }

  async deletePayment(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await prisma.payment.delete({ where: { id } });
  }

  // Budgets
  async createBudget(
    schemaName: string,
    data: CreateBudgetDto,
  ): Promise<BudgetDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const budget = await prisma.budget.create({
      data: {
        title: data.title,
        month: data.month,
        year: data.year,
        totalAmount: new Decimal(data.totalAmount),
        status: data.status as BudgetStatus,
        residentialComplex: { connect: { id: data.residentialComplexId } },
        items: {
          create: data.items.map((item) => ({
            name: item.name,
            amount: new Decimal(item.amount),
            description: item.description,
          })),
        },
      },
      include: { items: true },
    });
    return {
      ...budget,
      totalAmount: budget.totalAmount.toNumber(),
      status: budget.status as BudgetStatus,
      items: budget.items.map(item => ({ ...item, amount: item.amount.toNumber() })),
    };
  }

  async getBudgets(
    schemaName: string,
    filters: BudgetFilterParamsDto,
  ): Promise<{ data: BudgetDto[]; total: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: Prisma.BudgetWhereInput = {};
    if (filters.year) where.year = filters.year;
    if (filters.status) where.status = filters.status as BudgetStatus;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [budgets, total] = await Promise.all([
      prisma.budget.findMany({
        where,
        include: { items: true },
        skip,
        take: limit,
        orderBy: { year: 'desc' },
      }),
      prisma.budget.count({ where }),
    ]);

    return {
      data: budgets.map((b) => ({
        ...b,
        totalAmount: b.totalAmount.toNumber(),
        status: b.status as BudgetStatus,
        items: b.items.map(item => ({ ...item, amount: item.amount.toNumber() })),
      })),
      total,
    };
  }

  async getBudgetById(schemaName: string, id: string): Promise<BudgetDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado.`);
    }
    return {
      ...budget,
      totalAmount: budget.totalAmount.toNumber(),
      status: budget.status as BudgetStatus,
      items: budget.items.map(item => ({ ...item, amount: item.amount.toNumber() })),
    };
  }

  async updateBudget(
    schemaName: string,
    id: string,
    data: UpdateBudgetDto,
  ): Promise<BudgetDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        title: data.title,
        month: data.month,
        year: data.year,
        totalAmount: data.totalAmount ? new Decimal(data.totalAmount) : undefined,
        status: data.status as BudgetStatus | undefined,
        approvedById: data.approvedById,
        approvedAt: data.approvedAt,
        items: data.items ? {
          upsert: data.items.map((item) => ({
            where: { id: item.id || '' },
            update: { ...item, amount: new Decimal(item.amount) },
            create: { ...item, amount: new Decimal(item.amount) },
          })),
        } : undefined,
      },
      include: { items: true }
    });
    return {
      ...updatedBudget,
      totalAmount: updatedBudget.totalAmount.toNumber(),
      status: updatedBudget.status as BudgetStatus,
      items: updatedBudget.items.map(item => ({ ...item, amount: item.amount.toNumber() })),
    };
  }

  async deleteBudget(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await prisma.budget.delete({ where: { id } });
  }

  async approveBudget(
    schemaName: string,
    id: string,
    approvedById: string,
  ): Promise<BudgetDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const budget = await prisma.budget.findUnique({ where: { id } });

    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado.`);
    }
    if (budget.status !== BudgetStatus.DRAFT) {
      throw new BadRequestException(
        `El presupuesto no está en estado BORRADOR y no puede ser aprobado.`,
      );
    }
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        status: BudgetStatus.APPROVED,
        approvedById,
        approvedAt: new Date(),
      },
      include: { items: true },
    });
    return {
      ...updatedBudget,
      totalAmount: updatedBudget.totalAmount.toNumber(),
      status: updatedBudget.status as BudgetStatus,
      items: updatedBudget.items.map(item => ({ ...item, amount: item.amount.toNumber() })),
    };
  }

  // Expenses
  async createExpense(
    schemaName: string,
    data: CreateExpenseDto,
  ): Promise<ExpenseDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const expense = await prisma.expense.create({
      data: {
        ...data,
        amount: new Decimal(data.amount),
        expenseDate: new Date(data.expenseDate),
        residentialComplex: { connect: { id: data.residentialComplexId } },
        budget: data.budgetId ? { connect: { id: data.budgetId } } : undefined,
        approvedBy: data.approvedById ? { connect: { id: data.approvedById } } : undefined,
      },
    });
    return { ...expense, amount: expense.amount.toNumber() };
  }

  async getExpenses(
    schemaName: string,
    filters: ExpenseFilterParamsDto,
  ): Promise<{ data: ExpenseDto[]; total: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: Prisma.ExpenseWhereInput = {};
    if (filters.categoryId) where.category = filters.categoryId;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [expenses, total] = await Promise.all([
      prisma.expense.findMany({
        where,
        skip,
        take: limit,
        orderBy: { expenseDate: 'desc' },
      }),
      prisma.expense.count({ where }),
    ]);

    return {
      data: expenses.map((e) => ({ ...e, amount: e.amount.toNumber() })),
      total,
    };
  }

  async getExpenseById(schemaName: string, id: string): Promise<ExpenseDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const expense = await prisma.expense.findUnique({ where: { id } });
    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado.`);
    }
    return { ...expense, amount: expense.amount.toNumber() };
  }

  async updateExpense(
    schemaName: string,
    id: string,
    data: UpdateExpenseDto,
  ): Promise<ExpenseDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        ...data,
        amount: data.amount ? new Decimal(data.amount) : undefined,
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : undefined,
      },
    });
    return { ...updatedExpense, amount: updatedExpense.amount.toNumber() };
  }

  async deleteExpense(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    await prisma.expense.delete({ where: { id } });
  }

  async getFinancialSummary(schemaName: string): Promise<any> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const totalIncome = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.COMPLETED },
    });
    const totalExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
    });

    const currentBalance = new Decimal(totalIncome._sum.amount || 0).minus(new Decimal(totalExpenses._sum.amount || 0));

    const monthlyIncome = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.COMPLETED,
        date: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    });

    const monthlyExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        expenseDate: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) },
      },
    });

    const pendingBills = await prisma.fee.count({ where: { paid: false } });

    const pendingBillsAmount = await prisma.fee.aggregate({
      _sum: { amount: true },
      where: { paid: false },
    });

    return {
      currentBalance: currentBalance.toNumber(),
      balanceChange: '+5.2%',
      monthlyIncome: new Decimal(monthlyIncome._sum.amount || 0).toNumber(),
      incomeChange: '+2.1%',
      monthlyExpenses: new Decimal(monthlyExpenses._sum.amount || 0).toNumber(),
      expenseChange: '-1.5%',
      pendingBills,
      pendingBillsAmount: new Decimal(pendingBillsAmount._sum.amount || 0).toNumber(),
    };
  }

  async getRecentTransactions(schemaName: string): Promise<any[]> {
    const prisma = this.prisma.getTenantDB(schemaName);

    const recentPayments = await prisma.payment.findMany({
      orderBy: { date: 'desc' },
      take: 5,
      include: { fees: true },
    });

    const recentExpenses = await prisma.expense.findMany({
      orderBy: { expenseDate: 'desc' },
      take: 5,
    });

    const transactions = [
      ...recentPayments.map((p) => ({
        id: p.id,
        date: p.date,
        description: `Pago de cuota ${p.fees[0]?.title || 'N/A'}`,
        amount: p.amount.toNumber(),
        type: 'income',
      })),
      ...recentExpenses.map((e) => ({
        id: e.id,
        date: e.expenseDate,
        description: e.description,
        amount: e.amount.toNumber(),
        type: 'expense',
      })),
    ];

    transactions.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

    return transactions.slice(0, 5);
  }

  async generateFinancialReport(
    schemaName: string,
    reportType: string,
    startDate: string,
    endDate: string,
    format: string,
  ): Promise<Readable> {
    const doc = new PDFDocument();
    const stream = new Readable();
    stream._read = () => {};

    doc.on('data', (chunk) => stream.push(chunk));
    doc.on('end', () => stream.push(null));

    // Report generation logic here...

    doc.end();
    return stream;
  }

  async initiatePayment(
    schemaName: string,
    feeId: string,
    userId: string,
  ): Promise<string> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const fee = await prisma.fee.findUnique({ where: { id: feeId } });

    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${feeId} no encontrada.`);
    }
    if (fee.paid) {
      throw new BadRequestException(
        `La cuota ${feeId} no está pendiente de pago.`,
      );
    }

    const simulatedPaymentUrl = `https://simulated-payment-gateway.com/pay?amount=${fee.amount.toNumber()}&feeId=${fee.id}&userId=${userId}`;

    const payment = await prisma.payment.create({
      data: {
        userId: userId,
        amount: fee.amount,
        date: new Date(),
        status: PaymentStatus.PENDING,
        transactionId: `simulated_tx_${Date.now()}`,
        method: 'GATEWAY',
        fees: { connect: { id: fee.id } }
      },
    });

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (user) {
      await this.communicationsService.notifyUser(schemaName, user.id, {
        type: NotificationType.INFO,
        title: 'Pago Iniciado',
        message: `Se ha iniciado el pago de tu cuota ${fee.title}. Por favor, completa la transacción.`,
        link: `/resident/finances/payments/${payment.id}`,
        sourceType: NotificationSourceType.FINANCIAL,
        sourceId: payment.id.toString(),
      });
    }

    return simulatedPaymentUrl;
  }

  async handlePaymentWebhook(
    schemaName: string,
    transactionId: string,
    status: PaymentStatus,
  ): Promise<PaymentDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const payment = await prisma.payment.findFirst({
      where: { transactionId },
      include: { fees: true },
    });

    if (!payment) {
      throw new NotFoundException(
        `Transacción ${transactionId} no encontrada.`,
      );
    }

    if (payment.status === PaymentStatus.COMPLETED) {
      return { ...payment, amount: payment.amount.toNumber(), status: payment.status as PaymentStatus };
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status, date: new Date() },
    });

    if (
      updatedPayment.status === PaymentStatus.COMPLETED &&
      payment.fees.length > 0
    ) {
      await prisma.fee.updateMany({
        where: { id: { in: payment.fees.map(f => f.id) } },
        data: { paid: true, paidAt: new Date() },
      });

      const user = await prisma.user.findUnique({
        where: { id: updatedPayment.userId },
      });
      if (user) {
        await this.communicationsService.notifyUser(schemaName, user.id, {
          type: NotificationType.INFO,
          title: 'Pago Confirmado',
          message: `Tu pago de ${updatedPayment.amount.toNumber()} para la cuota ${payment.fees[0].title} ha sido confirmado.`,
          link: `/resident/finances/payments/${updatedPayment.id}`,
          sourceType: NotificationSourceType.FINANCIAL,
          sourceId: updatedPayment.id.toString(),
        });
      }
    }
    return {
      ...updatedPayment,
      amount: updatedPayment.amount.toNumber(),
      status: updatedPayment.status as PaymentStatus,
    };
  }
}