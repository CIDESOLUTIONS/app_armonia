import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PortfolioMetricDto, ComplexMetricDto, } from '../common/dto/portfolio.dto';
import { format } from 'date-fns';

@Injectable()
export class PortfolioService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async getPortfolioMetrics(userId: number): Promise<PortfolioMetricDto> {
    // Para un APP_ADMIN, obtener todos los schemas de los complejos residenciales
    const prisma = this.prisma;
    const complexes = await prisma.residentialComplex.findMany({
      select: { schemaName: true, id: true, name: true },
    });

    let totalProperties = 0;
    let totalResidents = 0;
    let totalPendingFees = 0;
    let totalIncome = 0;
    let totalOpenPqrs = 0;
    let totalBudgetsApproved = 0;
    let totalExpenses = 0;

    for (const complex of complexes) {
      const tenantPrisma = this.prisma;
      // Obtener métricas de cada tenant
      const propertiesCount = await tenantPrisma.property.count();
      totalProperties += propertiesCount;

      const residentsCount = await tenantPrisma.user.count({
        where: { role: 'RESIDENT' },
      });
      totalResidents += residentsCount;

      const pendingFees = await tenantPrisma.fee.aggregate({
        _sum: { amount: true },
        where: { status: 'PENDING' },
      });
      totalPendingFees += pendingFees._sum.amount || 0;

      const income = await tenantPrisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      });
      totalIncome += income._sum.amount || 0;

      const openPqrs = await tenantPrisma.pQR.count({
        where: { status: { notIn: ['RESOLVED', 'CLOSED'] } },
      });
      totalOpenPqrs += openPqrs;

      const budgetsApproved = await tenantPrisma.budget.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'APPROVED' },
      });
      totalBudgetsApproved += budgetsApproved._sum.totalAmount || 0;

      const expenses = await tenantPrisma.expense.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      });
      totalExpenses += expenses._sum.amount || 0;
    }

    return {
      totalProperties,
      totalResidents,
      totalPendingFees,
      totalIncome,
      totalOpenPqrs,
      totalBudgetsApproved,
      totalExpenses,
    };
  }

  async getComplexMetrics(userId: number): Promise<ComplexMetricDto[]> {
    const prisma = this.prisma;
    const complexes = await prisma.residentialComplex.findMany({
      select: { schemaName: true, id: true, name: true },
    });

    const complexMetrics: ComplexMetricDto[] = [];

    for (const complex of complexes) {
      const tenantPrisma = this.prisma;

      const residents = await tenantPrisma.user.count({
        where: { role: 'RESIDENT' },
      });

      const pendingFees = await tenantPrisma.fee.aggregate({
        _sum: { amount: true },
        where: { status: 'PENDING' },
      });

      const income = await tenantPrisma.payment.aggregate({
        _sum: { amount: true },
        where: { status: 'COMPLETED' },
      });

      const openPqrs = await tenantPrisma.pQR.count({
        where: { status: { notIn: ['RESOLVED', 'CLOSED'] } },
      });

      const budgetApproved = await tenantPrisma.budget.aggregate({
        _sum: { totalAmount: true },
        where: { status: 'APPROVED' },
      });

      const expenses = await tenantPrisma.expense.aggregate({
        _sum: { amount: true },
        where: { status: 'PAID' },
      });

      complexMetrics.push({
        id: complex.id,
        name: complex.name,
        residents: residents,
        pendingFees: pendingFees._sum.amount || 0,
        income: income._sum.amount || 0,
        openPqrs: openPqrs,
        budgetApproved: budgetApproved._sum.totalAmount || 0,
        expenses: expenses._sum.amount || 0,
      });
    }

    return complexMetrics;
  }

  async generateConsolidatedFinancialReport(
    startDate: string,
    endDate: string,
  ): Promise<any> {
    const prisma = this.prisma;
    const complexes = await prisma.residentialComplex.findMany({
      select: { schemaName: true, name: true },
    });

    const reportData: any = [];
    let totalIncomeAllComplexes = 0;
    let totalExpensesAllComplexes = 0;

    for (const complex of complexes) {
      const tenantPrisma = this.prisma;

      const income = await tenantPrisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          date: { gte: new Date(startDate), lte: new Date(endDate) },
          status: 'COMPLETED',
        },
      });

      const expenses = await tenantPrisma.expense.aggregate({
        _sum: { amount: true },
        where: {
          date: { gte: new Date(startDate), lte: new Date(endDate) },
          status: 'PAID',
        },
      });

      const complexIncome = income._sum.amount || 0;
      const complexExpenses = expenses._sum.amount || 0;

      reportData.push({
        complexName: complex.name,
        income: complexIncome,
        expenses: complexExpenses,
        netBalance: complexIncome - complexExpenses,
      });

      totalIncomeAllComplexes += complexIncome;
      totalExpensesAllComplexes += complexExpenses;
    }

    return {
      startDate,
      endDate,
      totalIncomeAllComplexes,
      totalExpensesAllComplexes:
        totalExpensesAllComplexes,
      netBalanceAllComplexes:
        totalIncomeAllComplexes - totalExpensesAllComplexes,
      complexReports: reportData,
    };
  }
}