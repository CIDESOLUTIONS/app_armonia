import { fetchApi } from "@/lib/apiClient";

interface BankTransaction {
  date: string;
  description: string;
  amount: number;
}

interface Payment {
  id: number;
  amount: number;
  resident: { name: string };
}

export interface ReconciliationSuggestion {
  transaction: BankTransaction;
  matchingPayment: Payment | null;
  status: "MATCHED" | "UNMATCHED" | "APPROVED";
}

export interface FinanceSummary {
  currentBalance: number;
  balanceChange: string;
  monthlyIncome: number;
  incomeChange: string;
  monthlyExpenses: number;
  expenseChange: string;
  pendingBills: number;
  pendingBillsAmount: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  type: "income" | "expense";
}

export const getFinanceSummary = async (complexId: number): Promise<FinanceSummary> => {
  return fetchApi(`/finances/summary`, { params: { complexId } });
};

export const getRecentTransactions = async (complexId: number): Promise<Transaction[]> => {
  return fetchApi(`/finances/transactions`, { params: { complexId } });
};

export const generateFinancialReport = async (
  reportType: string,
  startDate: string,
  endDate: string,
  format: string,
): Promise<Blob> => {
  return fetchApi("/finances/reports/generate", {
    params: { reportType, startDate, endDate, format },
    responseType: "blob",
  });
};

export const uploadBankStatement = async (file: File): Promise<ReconciliationSuggestion[]> => {
  const formData = new FormData();
  formData.append('file', file);
  return fetchApi('/finances/bank-statement/upload', {
    method: 'POST',
    data: formData,
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

export const approveReconciliation = async (reconciliationId: number): Promise<{ message: string }> => {
  return fetchApi(`/finances/reconciliation/${reconciliationId}/approve`, { method: 'POST' });
};
