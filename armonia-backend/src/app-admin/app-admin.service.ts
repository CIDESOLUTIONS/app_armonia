import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppAdminService {
  constructor(private prisma: PrismaService) {}

  async getOperativeMetrics(): Promise<any> {
    const prisma = this.prisma.getTenantDB('public');
    const complexes = await prisma.residentialComplex.findMany({
      where: { isActive: true },
      select: { id: true },
    });

    let totalProperties = 0;
    let totalResidents = 0;
    let totalPendingFees = 0;
    let totalIncome = 0;
    let totalOpenPqrs = 0;

    for (const complex of complexes) {
      const tenantPrisma = this.prisma.getTenantDB(complex.id);
      
      const [propertiesCount, residentsCount, pendingFees, income, openPqrs] = await Promise.all([
        tenantPrisma.property.count(),
        tenantPrisma.user.count({ where: { role: 'RESIDENT' } }),
        tenantPrisma.fee.aggregate({ _sum: { amount: true }, where: { paid: false } }),
        tenantPrisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
        tenantPrisma.pQR.count({ where: { status: { notIn: ['RESOLVED', 'CLOSED'] } } })
      ]);

      totalProperties += propertiesCount;
      totalResidents += residentsCount;
      totalPendingFees += pendingFees._sum.amount || 0;
      totalIncome += income._sum.amount || 0;
      totalOpenPqrs += openPqrs;
    }

    return {
      totalComplexes: complexes.length,
      totalProperties,
      totalResidents,
      totalPendingFees,
      totalIncome,
      totalOpenPqrs,
    };
  }

  async getComplexMetrics(): Promise<any[]> {
    const prisma = this.prisma.getTenantDB('public');
    const complexes = await prisma.residentialComplex.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    const complexMetricsPromises = complexes.map(async (complex) => {
      const tenantPrisma = this.prisma.getTenantDB(complex.id);
      const [residents, pendingFees, income, openPqrs] = await Promise.all([
        tenantPrisma.user.count({ where: { role: 'RESIDENT' } }),
        tenantPrisma.fee.aggregate({ _sum: { amount: true }, where: { paid: false } }),
        tenantPrisma.payment.aggregate({ _sum: { amount: true }, where: { status: 'COMPLETED' } }),
        tenantPrisma.pQR.count({ where: { status: { notIn: ['RESOLVED', 'CLOSED'] } } })
      ]);

      return {
        id: complex.id,
        name: complex.name,
        residents,
        pendingFees: pendingFees._sum.amount || 0,
        income: income._sum.amount || 0,
        openPqrs,
      };
    });

    return Promise.all(complexMetricsPromises);
  }

  async getFinancialSummary(startDate: string, endDate: string): Promise<any> {
     const prisma = this.prisma.getTenantDB('public');
    const complexes = await prisma.residentialComplex.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    let totalIncomeAllComplexes = 0;
    let totalExpensesAllComplexes = 0;

    const reportDataPromises = complexes.map(async (complex) => {
      const tenantPrisma = this.prisma.getTenantDB(complex.id);
      const [income, expenses] = await Promise.all([
         tenantPrisma.payment.aggregate({
          _sum: { amount: true },
          where: { date: { gte: new Date(startDate), lte: new Date(endDate) }, status: 'COMPLETED' },
        }),
        tenantPrisma.expense.aggregate({
          _sum: { amount: true },
          where: { expenseDate: { gte: new Date(startDate), lte: new Date(endDate) } },
        })
      ]);

      const complexIncome = income._sum.amount || 0;
      const complexExpenses = expenses._sum.amount || 0;
      
      totalIncomeAllComplexes += complexIncome;
      totalExpensesAllComplexes += complexExpenses;

      return {
        complexName: complex.name,
        income: complexIncome,
        expenses: complexExpenses,
        netBalance: complexIncome - complexExpenses,
      };
    });

    const complexReports = await Promise.all(reportDataPromises);

    return {
      startDate,
      endDate,
      totalIncomeAllComplexes,
      totalExpensesAllComplexes,
      netBalanceAllComplexes: totalIncomeAllComplexes - totalExpensesAllComplexes,
      complexReports,
    };
  }
}
