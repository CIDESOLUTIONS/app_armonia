export class PortfolioMetricDto {
  totalProperties: number;
  totalResidents: number;
  totalPendingFees: number;
  totalIncome: number;
  totalOpenPqrs: number; // New metric
  totalBudgetsApproved: number; // New metric
  totalExpenses: number; // New metric
}

export class ComplexMetricDto {
  id: string; // Changed to string
  name: string;
  residents: number;
  pendingFees: number;
  income: number;
  openPqrs: number; // New metric
  budgetApproved: number; // New metric
  expenses: number; // New metric
}