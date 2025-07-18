import { fetchApi } from "@/lib/api";

export interface PortfolioMetric {
  totalProperties: number;
  totalResidents: number;
  totalPendingFees: number;
  totalIncome: number;
  totalOpenPqrs: number;
  totalBudgetsApproved: number;
  totalExpenses: number;
}

export interface ComplexMetric {
  id: number;
  name: string;
  residents: number;
  pendingFees: number;
  income: number;
  openPqrs: number;
  budgetApproved: number;
  expenses: number;
}

export async function getPortfolioMetrics(): Promise<PortfolioMetric> {
  return fetchApi("/portfolio/metrics");
}

export async function getComplexMetrics(): Promise<ComplexMetric[]> {
  return fetchApi("/portfolio/complex-metrics");
}