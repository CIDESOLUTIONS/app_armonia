import { getPrisma } from "@/lib/prisma";
import { BudgetFormValues } from "@/validators/budget-schema";

export const getBudgetsByYear = async (year: number, tenantId: string) => {
  const prisma = getPrisma(tenantId);
  return await prisma.budget.findMany({ where: { year } });
};

export const createBudget = async (
  data: BudgetFormValues,
  tenantId: string,
) => {
  const prisma = getPrisma(tenantId);
  return await prisma.budget.create({ data });
};

export const approveBudget = async (
  budgetId: number,
  userId: number,
  tenantId: string,
) => {
  const prisma = getPrisma(tenantId);
  return await prisma.budget.update({
    where: { id: budgetId },
    data: {
      status: "APPROVED",
      approvedById: userId,
      approvedDate: new Date(),
    },
  });
};
