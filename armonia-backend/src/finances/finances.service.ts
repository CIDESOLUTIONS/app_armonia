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
import * as PDFDocument from 'pdfkit';
import { Readable } from 'stream';

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

  async generateOrdinaryFees(schemaName: string): Promise<{ count: number }> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const properties = await prisma.property.findMany();

    const feesToCreate = properties.map((property) => ({
      name: `Cuota Ordinaria ${new Date().toLocaleString('es-CO', { month: 'long', year: 'numeric' })}`,
      amount: 100000, // Example fixed amount, this could be dynamic based on property type/size/coefficient
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5).toISOString(), // Next month, 5th day
      status: PaymentStatus.PENDING,
      type: 'ORDINARY',
      propertyId: property.id,
      residentId: property.ownerId, // Assuming owner is the primary resident for billing
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

  async generateFinancialReport(
    schemaName: string,
    reportType: string,
    startDate: string,
    endDate: string,
    format: string,
  ): Promise<Readable> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const doc = new PDFDocument();
    const stream = new Readable();
    stream._read = () => {}; // _read is required but can be empty

    doc.on('data', (chunk) => stream.push(chunk));
    doc.on('end', () => stream.push(null));

    doc.fontSize(20).text(`Reporte Financiero: ${reportType}`, { align: 'center' });
    doc.fontSize(12).text(`Desde: ${startDate} Hasta: ${endDate}`, { align: 'center' });
    doc.moveDown();

    let data: any[] = [];
    let title = '';

    switch (reportType) {
      case 'BALANCE':
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
      case 'INCOME':
        title = 'Informe de Ingresos';
        const incomes = await prisma.payment.findMany({
          where: {
            status: PaymentStatus.PAID,
            paymentDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          include: { fee: true, user: true },
        });
        data = [
          ['Fecha', 'Concepto', 'Monto', 'Residente', 'Cuota'],
          ...incomes.map(i => [
            i.paymentDate.toLocaleDateString(),
            `Pago de ${i.fee?.name || 'cuota'}`,
            i.amount,
            i.user?.name || 'N/A',
            i.fee?.name || 'N/A',
          ]),
        ];
        break;
      case 'EXPENSE':
        title = 'Informe de Gastos';
        const expenses = await prisma.expense.findMany({
          where: {
            date: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          include: { category: true },
        });
        data = [
          ['Fecha', 'Concepto', 'Monto', 'Categoría'],
          ...expenses.map(e => [
            e.date.toLocaleDateString(),
            e.description,
            e.amount,
            e.category?.name || 'N/A',
          ]),
        ];
        break;
      case 'DEBTORS':
        title = 'Estado de Cartera (Deudores)';
        const overdueFees = await prisma.fee.findMany({
          where: {
            status: PaymentStatus.OVERDUE,
            dueDate: {
              lte: new Date(),
            },
          },
          include: { property: true, resident: true },
        });
        data = [
          ['Cuota', 'Monto', 'Fecha Vencimiento', 'Unidad', 'Residente'],
          ...overdueFees.map(f => [
            f.name,
            f.amount,
            f.dueDate.toLocaleDateString(),
            f.property?.unitNumber || 'N/A',
            f.resident?.name || 'N/A',
          ]),
        ];
        break;
      case 'PAYMENTS_REPORT':
        title = 'Informe de Pagos';
        const payments = await prisma.payment.findMany({
          where: {
            paymentDate: {
              gte: new Date(startDate),
              lte: new Date(endDate),
            },
          },
          include: { fee: true, user: true },
        });
        data = [
          ['Fecha', 'Monto', 'Método', 'Estado', 'Cuota', 'Residente'],
          ...payments.map(p => [
            p.paymentDate.toLocaleDateString(),
            p.amount,
            p.paymentMethod,
            p.status,
            p.fee?.name || 'N/A',
            p.user?.name || 'N/A',
          ]),
        ];
        break;
      case 'PEACE_AND_SAFE':
        title = 'Paz y Salvos';
        // This report type would typically require a residentId to generate a specific document
        // For a general report, we might list all residents with no pending fees
        const residentsWithoutPendingFees = await prisma.resident.findMany({
          where: {
            fees: {
              none: {
                status: PaymentStatus.PENDING,
              },
            },
          },
          include: { property: true },
        });
        data = [
          ['Residente', 'Unidad', 'Email'],
          ...residentsWithoutPendingFees.map(r => [
            r.name,
            r.property?.unitNumber || 'N/A',
            r.email,
          ]),
        ];
        break;
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
    doc.moveTo(startX, tableTop + rowHeight).lineTo(startX + data[0].length * colWidth, tableTop + rowHeight).stroke();

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
      if (currentY > doc.page.height - 50) { // Check for page overflow
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
        doc.moveTo(startX, currentY + rowHeight).lineTo(startX + data[0].length * colWidth, currentY + rowHeight).stroke();
        currentY += rowHeight + 5;
      }
    }

    doc.end();
    return stream;
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
        message: `Se ha iniciado el pago de tu cuota ${fee.name}. Por favor, completa la transacción.`,
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
