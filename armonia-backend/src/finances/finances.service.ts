import { Injectable } from '@nestjs/common';
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

  async getFees(schemaName: string, filters: FeeFilterParamsDto = {}): Promise<FeeListResponseDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const where: any = {};
      if (filters.status) where.status = filters.status;
      if (filters.type) where.type = filters.type;
      if (filters.propertyId) where.propertyId = filters.propertyId;
      if (filters.startDate) where.dueDate = { gte: new Date(filters.startDate) };
      if (filters.endDate) where.dueDate = { ...where.dueDate, lte: new Date(filters.endDate) };
      if (filters.search) {
        where.OR = [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } },
        ];
      }

      const fees = await prisma.fee.findMany({
        where,
        skip: (filters.page - 1) * filters.limit || 0,
        take: filters.limit || 10,
        orderBy: { createdAt: 'desc' },
      });
      const total = await prisma.fee.count({ where });

      return { fees, total, page: filters.page || 1, limit: filters.limit || 10 };
    } catch (error) {
      console.error("Error al obtener cuotas:", error);
      throw new Error("Error al obtener cuotas");
    }
  }

  async getFee(schemaName: string, id: number): Promise<FeeDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.fee.findUnique({ where: { id } });
    } catch (error) {
      console.error(`Error al obtener cuota ${id}:`, error);
      throw new Error("Error al obtener cuota");
    }
  }

  async createFee(schemaName: string, data: CreateFeeDto): Promise<FeeDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.fee.create({ data });
    } catch (error) {
      console.error("Error al crear cuota:", error);
      throw new Error("Error al crear cuota");
    }
  }

  async updateFee(schemaName: string, id: number, data: UpdateFeeDto): Promise<FeeDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.fee.update({ where: { id }, data });
    } catch (error) {
      console.error(`Error al actualizar cuota ${id}:`, error);
      throw new Error("Error al actualizar cuota");
    }
  }

  async createPayment(schemaName: string, data: CreatePaymentDto): Promise<PaymentDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.payment.create({ data });
    } catch (error) {
      console.error("Error al registrar pago:", error);
      throw new Error("Error al registrar pago");
    }
  }

  async getPropertyPayments(schemaName: string, propertyId: number): Promise<PaymentDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.payment.findMany({ where: { propertyId } });
    } catch (error) {
      console.error(`Error al obtener pagos de propiedad ${propertyId}:`, error);
      throw new Error("Error al obtener pagos de propiedad");
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
      const balance = (totalFees._sum.amount || 0) - (totalPayments._sum.amount || 0);
      return { balance };
    } catch (error) {
      console.error(`Error al obtener balance de propiedad ${propertyId}:`, error);
      throw new Error("Error al obtener balance de propiedad");
    }
  }

  async generateOrdinaryFees(schemaName: string, amount: number, dueDate: string, title: string, description: string) {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const properties = await prisma.property.findMany({ select: { id: true } });
      const feesToCreate = properties.map(prop => ({
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
      console.error("Error al generar cuotas ordinarias:", error);
      throw new Error("Error al generar cuotas ordinarias");
    }
  }

  async createBudget(schemaName: string, data: CreateBudgetDto): Promise<BudgetDto> {
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
      console.error("Error al crear presupuesto:", error);
      throw new Error("Error al crear presupuesto");
    }
  }

  async getBudgetsByYear(schemaName: string, year: number): Promise<BudgetDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.budget.findMany({ where: { year }, include: { items: true } });
    } catch (error) {
      console.error(`Error al obtener presupuestos para el año ${year}:`, error);
      throw new Error("Error al obtener presupuestos por año");
    }
  }

  async approveBudget(schemaName: string, id: number): Promise<BudgetDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.budget.update({ where: { id }, data: { status: BudgetStatus.APPROVED } });
    } catch (error) {
      console.error(`Error al aprobar presupuesto ${id}:`, error);
      throw new Error("Error al aprobar presupuesto");
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
        currentBalance: (totalIncome._sum.amount || 0) - (totalExpenses._sum.amount || 0),
        pendingFees: pendingFees._sum.amount || 0,
      };
    } catch (error) {
      console.error("Error al obtener estadísticas financieras:", error);
      throw new Error("Error al obtener estadísticas financieras");
    }
  }

  async generateFinancialReport(schemaName: string, startDate: string, endDate: string, type: "INCOME" | "EXPENSE" | "BALANCE") {
    const prisma = this.getTenantPrismaClient(schemaName);
    // Lógica de generación de reportes más compleja, aquí un placeholder
    console.log(`Generando reporte ${type} para ${schemaName} de ${startDate} a ${endDate}`);
    return { report: `Reporte ${type} generado` };
  }
}