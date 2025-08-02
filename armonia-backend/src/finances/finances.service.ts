import {
  Injectable,
  BadRequestException,
  NotFoundException,
} from '@nestjs/common';
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
  CreateExpenseDto,
  UpdateExpenseDto,
  ExpenseFilterParamsDto,
  ExpenseDto,
} from '../common/dto/finances.dto';
import { CommunicationsService } from '../communications/communications.service';
import {
  NotificationType,
  NotificationSourceType,
} from '../common/dto/communications.dto';
import PDFDocument from 'pdfkit';
import { Readable } from 'stream';

@Injectable()
export class FinancesService {
  constructor(
    private prisma: PrismaService,
    private communicationsService: CommunicationsService,
  ) {}

  // Fees
  async createFee(schemaName: string, data: CreateFeeDto): Promise<FeeDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const fee = await prisma.fee.create({
      data,
    });
    return { ...fee, status: fee.paid ? PaymentStatus.PAID : PaymentStatus.PENDING };
  }

  async getFees(
    schemaName: string,
    filters: FeeFilterParamsDto,
  ): Promise<{ fees: FeeDto[]; total: number }> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      const where: any = {};
      if (filters.type) where.type = filters.type;
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

      return { fees: fees.map(fee => ({ ...fee, status: fee.paid ? PaymentStatus.PAID : PaymentStatus.PENDING })), total };
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
    return {
      ...fee,
      status: fee.paid ? PaymentStatus.PAID : PaymentStatus.PENDING,
    };
  }

  async getFee(schemaName: string, id: string): Promise<FeeDto | null> {
    try {
      const prisma = this.prisma.getTenantDB(schemaName);
      const fee = await prisma.fee.findUnique({ where: { id } });
      return fee ? { ...fee, status: fee.paid ? PaymentStatus.PAID : PaymentStatus.PENDING } : null;
    } catch (error) {
      throw new BadRequestException('Error al obtener cuota');
    }
  }

  async updateFee(
    schemaName: string,
    id: string,
    data: UpdateFeeDto,
  ): Promise<FeeDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const fee = await prisma.fee.findUnique({ where: { id } });
    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${id} no encontrada.`);
    }
    const updatedFee = await prisma.fee.update({ where: { id }, data });
    return {
      ...updatedFee,
      status: updatedFee.paid ? PaymentStatus.PAID : PaymentStatus.PENDING,
    };
  }

  async deleteFee(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const fee = await prisma.fee.findUnique({ where: { id } });
    if (!fee) {
      throw new NotFoundException(`Cuota con ID ${id} no encontrada.`);
    }
    await prisma.fee.delete({ where: { id } });
  }

  async generateOrdinaryFees(
    schemaName: string,
  ): Promise<{ count: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const properties = await prisma.property.findMany();

    const feesToCreate = properties.map((property) => ({
      title: `Cuota Ordinaria ${new Date().toLocaleString('es-CO', {
        month: 'long',
        year: 'numeric',
      })}`,
      amount: 100000, // Example fixed amount, this could be dynamic based on property type/size/coefficient
      dueDate: new Date(
        new Date().getFullYear(),
        new Date().getMonth() + 1,
        5,
      ),
      type: 'ORDINARY',
      propertyId: property.id,
      isRecurring: true,
      frequency: 'MONTHLY',
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
    const payment = await prisma.payment.create({ data });

    // Update fee status if payment is completed and feeId is provided
    if (payment.status === PaymentStatus.PAID && data.feeId) {
      await prisma.fee.update({
        where: { id: data.feeId },
        data: { paid: true, paidAt: new Date() },
      });
    }
    return { ...payment, status: payment.status as PaymentStatus };
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
        amount: amount,
        date: paymentDate,
        status: PaymentStatus.PAID,
        transactionId: `MANUAL_${Date.now()}`,
        method: paymentMethod,
      },
    });

    await prisma.fee.update({
      where: { id: fee.id },
      data: { paid: true, paidAt: new Date(), paymentId: payment.id },
    });

    return { ...payment, status: payment.status as PaymentStatus };
  }

  async getPayments(
    schemaName: string,
    filters: FeeFilterParamsDto,
  ): Promise<{ data: PaymentDto[]; total: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = {};
    if (filters.status) where.status = filters.status;

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

    return { data: payments.map(p => ({ ...p, status: p.status as PaymentStatus })), total };
  }

  async getPaymentById(schemaName: string, id: string): Promise<PaymentDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const payment = await prisma.payment.findUnique({ where: { id } });
    if (!payment) {
      throw new NotFoundException(`Pago con ID ${id} no encontrado.`);
    }
    return { ...payment, status: payment.status as PaymentStatus };
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
    const updatedPayment = await prisma.payment.update({ where: { id }, data });

    // Update fee status if payment is completed
    if (
      updatedPayment.status === PaymentStatus.PAID &&
      payment.fees.length > 0
    ) {
      await prisma.fee.update({
        where: { id: payment.fees[0].id },
        data: { paid: true, paidAt: new Date() },
      });

      // Notify user about successful payment
      const user = await prisma.user.findUnique({
        where: { id: updatedPayment.userId },
      });
      if (user) {
        await this.communicationsService.notifyUser(schemaName, user.id, {
          type: NotificationType.INFO,
          title: 'Pago Confirmado',
          message: `Tu pago de ${updatedPayment.amount} para la cuota ${payment.fees[0].title} ha sido confirmado.`,
          link: `/resident/finances/payments/${updatedPayment.id}`,
          sourceType: NotificationSourceType.FINANCIAL,
          sourceId: updatedPayment.id.toString(),
        });
      }
    }
    return { ...updatedPayment, status: updatedPayment.status as PaymentStatus };
  }

  async deletePayment(schemaName: string, id: string): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const payment = await prisma.payment.findUnique({
      where: { id },
      include: { fees: true },
    });
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
    const prisma = this.prisma.getTenantDB(schemaName);
    const budget = await prisma.budget.create({
      data: {
        title: data.title,
        month: data.month,
        year: data.year,
        totalAmount: data.totalAmount,
        status: data.status,
        residentialComplex: { connect: { id: data.residentialComplexId } },
        items: {
          create: data.items.map((item) => ({
            name: item.name,
            amount: item.amount,
            description: item.description,
          })),
        },
      },
      include: { items: true }, // Ensure items are included in the returned object
    }) as BudgetDto; // Explicit cast to BudgetDto
    return { ...budget, status: budget.status as BudgetStatus, items: budget.items };
  }

  async getBudgets(
    schemaName: string,
    filters: BudgetFilterParamsDto,
  ): Promise<{ data: BudgetDto[]; total: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = {};
    if (filters.year) where.year = filters.year;
    if (filters.status) where.status = filters.status;

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

    return { data: budgets.map(b => ({ ...b, status: b.status as BudgetStatus, items: b.items })), total };
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
    return { ...budget, status: budget.status as BudgetStatus, items: budget.items };
  }

  async updateBudget(
    schemaName: string,
    id: string,
    data: UpdateBudgetDto,
  ): Promise<BudgetDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado.`);
    }
    const updatedBudget = await prisma.budget.update({
      where: { id },
      data: {
        title: data.title,
        month: data.month,
        year: data.year,
        totalAmount: data.totalAmount,
        status: data.status,
        approvedById: data.approvedById,
        approvedAt: data.approvedAt,
        items: {
          upsert: data.items?.map((item) => ({
            where: { id: item.id || '' }, // Provide a default empty string if id is undefined
            update: item,
            create: item,
          })),
        },
      },
    }) as BudgetDto; // Explicit cast to BudgetDto
    return { ...updatedBudget, status: updatedBudget.status as BudgetStatus, items: updatedBudget.items };
  }

  async deleteBudget(
    schemaName: string,
    id: string,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { items: true },
    });
    if (!budget) {
      throw new NotFoundException(`Presupuesto con ID ${id} no encontrado.`);
    }
    await prisma.budget.delete({ where: { id } });
  }

  async approveBudget(
    schemaName: string,
    id: string,
    approvedById: string,
  ): Promise<BudgetDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const budget = await prisma.budget.findUnique({
      where: { id },
      include: { approvedBy: true, items: true }, // Added items include
    });

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
      include: { items: true }, // Added items include
    }) as BudgetDto; // Explicit cast to BudgetDto
    return { ...updatedBudget, status: updatedBudget.status as BudgetStatus, items: updatedBudget.items };
  }

  // Expenses
  async createExpense(
    schemaName: string,
    data: CreateExpenseDto,
  ): Promise<ExpenseDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const expense = await prisma.expense.create({
      data: {
        description: data.description,
        amount: data.amount,
        category: data.category,
        expenseDate: new Date(data.expenseDate),
        vendor: data.vendor,
        invoiceNumber: data.invoiceNumber,
        notes: data.notes,
        residentialComplex: { connect: { id: data.residentialComplexId } },
        ...(data.budgetId && { budget: { connect: { id: data.budgetId } } }), // Use connect for budgetId
        ...(data.approvedById && { approvedBy: { connect: { id: data.approvedById } } }), // Use connect for approvedById
      },
    });
    return { ...expense, residentialComplexId: expense.residentialComplexId };
  }

  async getExpenses(
    schemaName: string,
    filters: ExpenseFilterParamsDto,
  ): Promise<{ data: ExpenseDto[]; total: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = {};
    if (filters.categoryId) where.categoryId = filters.categoryId;

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

    return { data: expenses.map(e => ({ ...e, residentialComplexId: e.residentialComplexId })), total };
  }

  async getExpenseById(schemaName: string, id: string): Promise<ExpenseDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const expense = await prisma.expense.findUnique({
      where: { id },
      // Removed include: { items: true },
    });
    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado.`);
    }
    return { ...expense, residentialComplexId: expense.residentialComplexId };
  }

  async updateExpense(
    schemaName: string,
    id: string,
    data: UpdateExpenseDto,
  ): Promise<ExpenseDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const expense = await prisma.expense.findUnique({
      where: { id },
      // Removed include: { items: true },
    });
    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado.`);
    }
    const updatedExpense = await prisma.expense.update({
      where: { id },
      data: {
        description: data.description,
        amount: data.amount,
        category: data.category,
        expenseDate: data.expenseDate ? new Date(data.expenseDate) : undefined,
        vendor: data.vendor,
        invoiceNumber: data.invoiceNumber,
        notes: data.notes,
        ...(data.residentialComplexId && { residentialComplex: { connect: { id: data.residentialComplexId } } }),
        ...(data.budgetId && { budget: { connect: { id: data.budgetId } } }),
        ...(data.approvedById && { approvedBy: { connect: { id: data.approvedById } } }),
      },
    });
    return { ...updatedExpense, residentialComplexId: updatedExpense.residentialComplexId };
  }

  async deleteExpense(
    schemaName: string,
    id: string,
  ): Promise<void> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const expense = await prisma.expense.findUnique({
      where: { id },
      // Removed include: { items: true },
    });
    if (!expense) {
      throw new NotFoundException(`Gasto con ID ${id} no encontrado.`);
    }
    await prisma.expense.delete({ where: { id } });
  }

  async getFinancialSummary(schemaName: string): Promise<any> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const totalIncome = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: { status: PaymentStatus.PAID },
    });
    const totalExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
    });

    const currentBalance =
      (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0);

    // For simplicity, monthly changes are hardcoded or calculated based on recent data
    const monthlyIncome = await prisma.payment.aggregate({
      _sum: { amount: true },
      where: {
        status: PaymentStatus.PAID,
        date: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const monthlyExpenses = await prisma.expense.aggregate({
      _sum: { amount: true },
      where: {
        expenseDate: {
          gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
        },
      },
    });

    const pendingBills = await prisma.fee.count({
      where: { paid: false },
    });

    const pendingBillsAmount = await prisma.fee.aggregate({
      _sum: { amount: true },
      where: { paid: false },
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
        amount: p.amount,
        type: 'income',
      })),
      ...recentExpenses.map((e) => ({
        id: e.id,
        date: e.expenseDate,
        description: e.description,
        amount: e.amount,
        type: 'expense',
      })),
    ];

    transactions.sort((a, b) => b.date.getTime() - a.date.getTime());

    return transactions.slice(0, 5);
  }

  async generateFinancialReport(
    schemaName: string,
    reportType: string,
    startDate: string,
    endDate: string,
    format: string,
  ): Promise<Readable> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const doc = new PDFDocument();
    const stream = new Readable();
    stream._read = () => {}; // _read is required but can be empty

    doc.on('data', (chunk) => stream.push(chunk));
    doc.on('end', () => stream.push(null));

    doc
      .fontSize(20)
      .text(`Reporte Financiero: ${reportType}`, { align: 'center' });
    doc
      .fontSize(12)
      .text(`Desde: ${startDate} Hasta: ${endDate}`, { align: 'center' });
    doc.moveDown();

    let data: any[] = [];
    let title = '';

    switch (reportType) {
      case 'BALANCE': {
        title = 'Balance General';
        const summary = await this.getFinancialSummary(schemaName);
        data = [
          ['Concepto', 'Monto'],
          ['Balance Actual', summary.currentBalance],
          ['Ingresos Mensuales', summary.monthlyIncome],
          ['Gastos Mensuales', summary.monthlyExpenses],
          ['Facturas Pendientes', summary.pendingBills],
          ['Monto Pendiente', summary.pendingBillsAmount],
        ];
        break;
      }
      case 'INCOME': {
        title = 'Informe de Ingresos';
        const incomes = await prisma.payment.findMany({
          where: {
            status: PaymentStatus.PAID,
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          include: { fees: true, user: true },
        });
        data = [
          ['Fecha', 'Concepto', 'Monto', 'Residente', 'Cuota'],
          ...incomes.map((i) => [
            i.date.toLocaleDateString(),
            `Pago de ${i.fees[0]?.title || 'N/A'}`,
            i.amount,
            i.user?.name || 'N/A',
            i.fees[0]?.title || 'N/A',
          ]),
        ];
        break;
      }
      case 'EXPENSE': {
        title = 'Informe de Gastos';
        const expenses = await prisma.expense.findMany({
          where: {
            expenseDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
        });
        data = [
          ['Fecha', 'Concepto', 'Monto', 'Categoría'],
          ...expenses.map((e) => [
            e.expenseDate.toLocaleDateString(),
            e.description,
            e.amount,
            e.category,
          ]),
        ];
        break;
      }
      case 'DEBTORS': {
        title = 'Estado de Cartera (Deudores)';
        const overdueFees = await prisma.fee.findMany({
          where: {
            paid: false,
            dueDate: {
              lte: new Date(),
            },
          },
          include: { property: { include: { owner: true } } },
        });
        data = [
          ['Cuota', 'Monto', 'Fecha Vencimiento', 'Unidad', 'Residente'],
          ...overdueFees.map((f) => [
            f.title,
            f.amount,
            f.dueDate.toLocaleDateString(),
            f.property?.number || 'N/A',
            f.property?.owner?.name || 'N/A',
          ]),
        ];
        break;
      }
      case 'PAYMENTS_REPORT': {
        title = 'Informe de Pagos';
        const payments = await prisma.payment.findMany({
          where: {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          include: { fees: true, user: true },
        });
        data = [
          ['Fecha', 'Monto', 'Método', 'Estado', 'Cuota', 'Residente'],
          ...payments.map((p) => [
            p.date.toLocaleDateString(),
            p.amount,
            p.method,
            p.status,
            p.fees[0]?.title || 'N/A',
            p.user?.name || 'N/A',
          ]),
        ];
        break;
      }
      case 'PEACE_AND_SAFE': {
        title = 'Paz y Salvos';
        // This report type would typically require a residentId to generate a specific document
        // For a general report, we might list all residents with no pending fees
        const residentsWithoutPendingFees = await prisma.resident.findMany({
          where: {
            property: {
              fees: {
                none: {
                  paid: false,
                },
              },
            },
          },
          include: { property: { include: { owner: true } } },
        });
        data = [
          ['Residente', 'Unidad', 'Email'],
          ...residentsWithoutPendingFees.map((r) => [
            r.name,
            r.property?.number || 'N/A',
            r.email,
          ]),
        ];
        break;
      }
      default:
        throw new BadRequestException('Tipo de reporte no válido.');
    }

    doc.fontSize(16).text(title, { align: 'center' });
    doc.moveDown();

    // Basic table generation
    const tableTop = doc.y;
    const startX = 50;
    const rowHeight = 20;
    const colWidth = (doc.page.width - 2 * startX) / data[0].length;

    // Draw table headers
    doc.font('Helvetica-Bold');
    data[0].forEach((header, i) => {
      doc.text(header, startX + i * colWidth, tableTop, {
        width: colWidth,
        align: 'left',
      });
    });
    doc.font('Helvetica');
    doc
      .moveTo(startX, tableTop + rowHeight)
      .lineTo(startX + data[0].length * colWidth, tableTop + rowHeight)
      .stroke();

    // Draw table rows
    let currentY = tableTop + rowHeight + 5;
    for (let i = 1; i < data.length; i++) {
      data[i].forEach((cell, j) => {
        doc.text(String(cell), startX + j * colWidth, currentY, {
          width: colWidth,
          align: 'left',
        });
      });
      currentY += rowHeight;
      if (currentY > doc.page.height - 50) {
        // Check for page overflow
        doc.addPage();
        currentY = 50; // Reset Y for new page
        // Redraw headers on new page
        doc.font('Helvetica-Bold');
        data[0].forEach((header, i) => {
          doc.text(header, startX + i * colWidth, currentY, {
            width: colWidth,
            align: 'left',
          });
        });
        doc.font('Helvetica');
        doc
          .moveTo(startX, currentY + rowHeight)
          .lineTo(startX + data[0].length * colWidth, currentY + rowHeight)
          .stroke();
        currentY += rowHeight + 5;
      }
    }

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
    if (fee.paid !== false) {
      throw new BadRequestException(
        `La cuota ${feeId} no está pendiente de pago.`,
      );
    }

    // Simulate payment initiation with a payment gateway
    // In a real scenario, this would interact with a payment gateway SDK (e.g., Stripe, PayU)
    // and return a redirect URL or a client secret.
    const simulatedPaymentUrl = `https://simulated-payment-gateway.com/pay?amount=${fee.amount}&feeId=${fee.id}&userId=${userId}`;

    // Create a pending payment record
    const payment = await prisma.payment.create({
      data: {
        userId: userId,
        amount: fee.amount,
        date: new Date(),
        status: PaymentStatus.PENDING,
        transactionId: `simulated_tx_${Date.now()}`,
        method: 'Simulated Gateway',
      },
    });

    await prisma.fee.update({
      where: { id: fee.id },
      data: { paymentId: payment.id },
    });

    // Notify user about payment initiation
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
    const payment = await prisma.payment.findUnique({
      where: { transactionId },
      include: { fees: true },
    });

    if (!payment) {
      throw new NotFoundException(
        `Transacción ${transactionId} no encontrada.`,
      );
    }

    if (payment.status === PaymentStatus.PAID) {
      return { ...payment, status: payment.status as PaymentStatus }; // Already completed, no action needed
    }

    const updatedPayment = await prisma.payment.update({
      where: { id: payment.id },
      data: { status, date: new Date() },
    });

    // Update fee status if payment is completed
    if (
      updatedPayment.status === PaymentStatus.PAID &&
      payment.fees.length > 0
    ) {
      await prisma.fee.update({
        where: { id: payment.fees[0].id },
        data: { paid: true, paidAt: new Date() },
      });

      // Notify user about successful payment
      const user = await prisma.user.findUnique({
        where: { id: updatedPayment.userId },
      });
      if (user) {
        await this.communicationsService.notifyUser(schemaName, user.id, {
          type: NotificationType.INFO,
          title: 'Pago Confirmado',
          message: `Tu pago de ${updatedPayment.amount} para la cuota ${payment.fees[0].title} ha sido confirmado.`,
          link: `/resident/finances/payments/${updatedPayment.id}`,
          sourceType: NotificationSourceType.FINANCIAL,
          sourceId: updatedPayment.id.toString(),
        });
      }
    }
    return { ...updatedPayment, status: updatedPayment.status as PaymentStatus };
  }
}