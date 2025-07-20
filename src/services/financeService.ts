import { getPrisma } from "@/lib/prisma";

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

export const getFinanceSummary = async (tenantId: string) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Getting finance summary for tenant:", tenantId);
  return { message: "Finance summary retrieved successfully" };
};

export const generateFinancialReport = async (tenantId: string) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Generating financial report for tenant:", tenantId);
  return { message: "Financial report generated successfully" };
};

export const processBankStatement = async (tenantId: string, file: File): Promise<ReconciliationSuggestion[]> => {
  const prisma = getPrisma(tenantId);
  console.log("Processing bank statement for tenant:", tenantId, file.name);
  // Simulated data for demonstration
  return [
    {
      transaction: { date: "2024-07-01", description: "Pago de arriendo", amount: 500.00 },
      matchingPayment: { id: 1, amount: 500.00, resident: { name: "Juan Perez" } },
      status: "MATCHED",
    },
    {
      transaction: { date: "2024-07-02", description: "Compra en supermercado", amount: 75.50 },
      matchingPayment: null,
      status: "UNMATCHED",
    },
  ];
};

export const uploadBankStatement = async (tenantId: string, file: File): Promise<ReconciliationSuggestion[]> => {
  const prisma = getPrisma(tenantId);
  console.log("Uploading bank statement for tenant:", tenantId, file.name);
  // Simulated data for demonstration
  return [
    {
      transaction: { date: "2024-07-01", description: "Pago de arriendo", amount: 500.00 },
      matchingPayment: { id: 1, amount: 500.00, resident: { name: "Juan Perez" } },
      status: "MATCHED",
    },
    {
      transaction: { date: "2024-07-02", description: "Compra en supermercado", amount: 75.50 },
      matchingPayment: null,
      status: "UNMATCHED",
    },
  ];
};

export const generateOrdinaryFees = async (tenantId: string) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Generating ordinary fees for tenant:", tenantId);
  return { message: "Ordinary fees generated successfully" };
};

export const getPaymentGatewaysConfig = async (tenantId: string) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Getting payment gateways config for tenant:", tenantId);
  return { message: "Payment gateways config retrieved successfully" };
};

export const createPaymentGatewayConfig = async (
  tenantId: string,
  data: any,
) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Creating payment gateway config for tenant:", tenantId, data);
  return { message: "Payment gateway config created successfully" };
};

export const updatePaymentGatewayConfig = async (
  tenantId: string,
  id: number,
  data: any,
) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log(
    "Updating payment gateway config for tenant:",
    tenantId,
    id,
    data,
  );
  return { message: "Payment gateway config updated successfully" };
};

export const deletePaymentGatewayConfig = async (
  tenantId: string,
  id: number,
) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Deleting payment gateway config for tenant:", tenantId, id);
  return { message: "Payment gateway config deleted successfully" };
};

export interface Transaction {
  id: number;
  description: string;
  amount: number;
  date: string;
  type: "INCOME" | "EXPENSE";
}

export const getRecentTransactions = async (tenantId: string): Promise<Transaction[]> => {
  const prisma = getPrisma(tenantId);
  console.log("Getting recent transactions for tenant:", tenantId);
  // Simulated data for demonstration
  return [
    {
      id: 1,
      description: "Pago de cuota de administración",
      amount: 150.00,
      date: "2024-07-19T10:00:00Z",
      type: "INCOME",
    },
    {
      id: 2,
      description: "Compra de insumos de limpieza",
      amount: 45.75,
      date: "2024-07-18T14:30:00Z",
      type: "EXPENSE",
    },
    {
      id: 3,
      description: "Pago de multa por ruido",
      amount: 25.00,
      date: "2024-07-17T11:00:00Z",
      type: "INCOME",
    },
  ];
};

export const initiatePayment = async (
  tenantId: string,
  feeId: number,
  amount: number,
) => {
  const prisma = getPrisma(tenantId);
  // Placeholder logic
  console.log("Initiating payment for tenant:", tenantId, feeId, amount);
  return { message: "Payment initiated successfully" };
};

export enum FeeStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}
