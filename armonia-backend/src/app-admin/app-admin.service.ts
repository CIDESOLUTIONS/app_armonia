import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AppAdminService {
  constructor(private prisma: PrismaService) {}

  async getOperativeMetrics(): Promise<any> {
    const [totalComplexes, totalUsers, plans, subscriptions] = await Promise.all([
      this.prisma.residentialComplex.count({ where: { isActive: true } }),
      this.prisma.user.count(),
      this.prisma.plan.findMany(),
      this.prisma.subscription.findMany({
        where: { status: 'ACTIVE' },
        include: { plan: true },
      }),
    ]);

    // Calcular MRR y ARR
    let mrr = 0;
    for (const sub of subscriptions) {
      let monthlyPrice = sub.plan.price;
      if (sub.plan.billingCycle === 'YEARLY') {
        monthlyPrice = sub.plan.price / 12;
      } else if (sub.plan.billingCycle === 'QUARTERLY') {
        monthlyPrice = sub.plan.price / 3;
      }
      mrr += monthlyPrice;
    }
    const arr = mrr * 12;

    // Calcular desglose por plan
    const complexesByPlanRaw = await this.prisma.residentialComplex.groupBy({
      by: ['planId'],
      _count: {
        id: true,
      },
      where: { isActive: true },
    });

    const complexesByPlan = complexesByPlanRaw.map(group => {
        const plan = plans.find(p => p.id === group.planId);
        return {
            name: plan ? plan.name : 'Desconocido',
            count: group._count.id
        }
    });

    return {
      totalComplexes,
      totalUsers,
      mrr: Math.round(mrr),
      arr: Math.round(arr),
      mrrChange: 0, // Placeholder for change calculation
      complexesByPlan,
    };
  }

  async getComplexMetrics(): Promise<any[]> {
    const complexes = await this.prisma.residentialComplex.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    const complexMetricsPromises = complexes.map(async (complex) => {
      try {
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
      } catch (error) {
        return {
          id: complex.id,
          name: complex.name,
          error: `Could not fetch metrics: ${error.message}`
        }
      }
    });

    return Promise.all(complexMetricsPromises);
  }

  async getFinancialSummary(startDate: string, endDate: string): Promise<any> {
    const complexes = await this.prisma.residentialComplex.findMany({
      where: { isActive: true },
      select: { id: true, name: true },
    });

    let totalIncomeAllComplexes = 0;
    let totalExpensesAllComplexes = 0;

    const reportDataPromises = complexes.map(async (complex) => {
      try {
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
      } catch (error) {
        return {
          complexName: complex.name,
          error: `Could not fetch financial summary: ${error.message}`
        }
      }
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
