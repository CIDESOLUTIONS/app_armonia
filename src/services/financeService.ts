import { fetchApi } from "@/lib/api";

export enum FeeStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export enum FeeType {
  ORDINARY = "ORDINARY",
  EXTRAORDINARY = "EXTRAORDINARY",
  FINE = "FINE",
}

export interface FeeDto {
  id: number;
  title: string;
  description?: string;
  amount: number;
  dueDate: string;
  status: FeeStatus;
  type: FeeType;
  propertyId?: number;
  unitId?: number;
  residentId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFeeDto {
  title: string;
  description?: string;
  amount: number;
  dueDate: string;
  type: FeeType;
  propertyId?: number;
  unitId?: number;
  residentId?: number;
}

export interface UpdateFeeDto {
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  status?: FeeStatus;
  type?: FeeType;
  propertyId?: number;
  unitId?: number;
  residentId?: number;
}

export interface FeeFilterParamsDto {
  status?: FeeStatus;
  type?: FeeType;
  propertyId?: number;
  residentId?: number;
  skip?: number;
  take?: number;
}

export enum PaymentStatus {
  PENDING = "PENDING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED",
}

export interface PaymentDto {
  id: number;
  feeId: number;
  userId: number;
  amount: number;
  paymentDate: string;
  status: PaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePaymentDto {
  feeId: number;
  userId: number;
  amount: number;
  paymentDate?: string;
  status?: PaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
}

export interface UpdatePaymentDto {
  feeId?: number;
  userId?: number;
  amount?: number;
  paymentDate?: string;
  status?: PaymentStatus;
  transactionId?: string;
  paymentMethod?: string;
}

export interface PaymentFilterParamsDto {
  status?: PaymentStatus;
  feeId?: number;
  userId?: number;
  skip?: number;
  take?: number;
}

export enum BudgetStatus {
  DRAFT = "DRAFT",
  APPROVED = "APPROVED",
  REJECTED = "REJECTED",
}

export interface BudgetItemDto {
  id: number;
  budgetId: number;
  description: string;
  amount: number;
  type: "INCOME" | "EXPENSE";
}

export interface BudgetDto {
  id: number;
  year: number;
  title: string;
  description?: string;
  totalAmount: number;
  status: BudgetStatus;
  approvedById?: number;
  approvedAt?: string;
  items: BudgetItemDto[];
  createdAt: string;
  updatedAt: string;
}

export interface CreateBudgetDto {
  year: number;
  title: string;
  description?: string;
  items: { description: string; amount: number; type: "INCOME" | "EXPENSE" }[];
}

export interface UpdateBudgetDto {
  year?: number;
  title?: string;
  description?: string;
  items?: { description: string; amount: number; type: "INCOME" | "EXPENSE" }[];
  status?: BudgetStatus;
}

export interface BudgetFilterParamsDto {
  year?: number;
  status?: BudgetStatus;
  skip?: number;
  take?: number;
}

export enum ExpenseStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
}

export interface ExpenseDto {
  id: number;
  title: string;
  description?: string;
  amount: number;
  date: string;
  status: ExpenseStatus;
  categoryId?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateExpenseDto {
  title: string;
  description?: string;
  amount: number;
  date: string;
  status?: ExpenseStatus;
  categoryId?: number;
}

export interface UpdateExpenseDto {
  title?: string;
  description?: string;
  amount?: number;
  date?: string;
  status?: ExpenseStatus;
  categoryId?: number;
}

export interface ExpenseFilterParamsDto {
  status?: ExpenseStatus;
  categoryId?: number;
  skip?: number;
  take?: number;
}

export async function getFinancialSummary(): Promise<any> {
  try {
    const response = await fetchApi("/finances/summary");
    return response.data;
  } catch (error) {
    console.error("Error fetching financial summary:", error);
    throw error;
  }
}

export async function getRecentTransactions(): Promise<any[]> {
  try {
    const response = await fetchApi("/finances/transactions/recent");
    return response.data;
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    throw error;
  }
}

export async function getFees(filters?: FeeFilterParamsDto): Promise<{ data: FeeDto[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (filters?.status) query.append("status", filters.status);
    if (filters?.type) query.append("type", filters.type);
    if (filters?.propertyId) query.append("propertyId", filters.propertyId.toString());
    if (filters?.residentId) query.append("residentId", filters.residentId.toString());
    if (filters?.skip) query.append("skip", filters.skip.toString());
    if (filters?.take) query.append("take", filters.take.toString());

    const response = await fetchApi(`/finances/fees?${query.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching fees:", error);
    throw error;
  }
}

export async function createFee(data: CreateFeeDto): Promise<FeeDto> {
  try {
    const response = await fetchApi("/finances/fees", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating fee:", error);
    throw error;
  }
}

export async function updateFee(id: number, data: UpdateFeeDto): Promise<FeeDto> {
  try {
    const response = await fetchApi(`/finances/fees/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating fee:", error);
    throw error;
  }
}

export async function deleteFee(id: number): Promise<void> {
  try {
    await fetchApi(`/finances/fees/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting fee:", error);
    throw error;
  }
}

export async function getPayments(filters?: PaymentFilterParamsDto): Promise<{ data: PaymentDto[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (filters?.status) query.append("status", filters.status);
    if (filters?.feeId) query.append("feeId", filters.feeId.toString());
    if (filters?.userId) query.append("userId", filters.userId.toString());
    if (filters?.skip) query.append("skip", filters.skip.toString());
    if (filters?.take) query.append("take", filters.take.toString());

    const response = await fetchApi(`/finances/payments?${query.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching payments:", error);
    throw error;
  }
}

export async function createPayment(data: CreatePaymentDto): Promise<PaymentDto> {
  try {
    const response = await fetchApi("/finances/payments", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating payment:", error);
    throw error;
  }
}

export async function updatePayment(id: number, data: UpdatePaymentDto): Promise<PaymentDto> {
  try {
    const response = await fetchApi(`/finances/payments/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating payment:", error);
    throw error;
  }
}

export async function deletePayment(id: number): Promise<void> {
  try {
    await fetchApi(`/finances/payments/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting payment:", error);
    throw error;
  }
}

export async function getBudgets(filters?: BudgetFilterParamsDto): Promise<{ data: BudgetDto[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (filters?.year) query.append("year", filters.year.toString());
    if (filters?.status) query.append("status", filters.status);
    if (filters?.skip) query.append("skip", filters.skip.toString());
    if (filters?.take) query.append("take", filters.take.toString());

    const response = await fetchApi(`/finances/budgets?${query.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching budgets:", error);
    throw error;
  }
}

export async function createBudget(data: CreateBudgetDto): Promise<BudgetDto> {
  try {
    const response = await fetchApi("/finances/budgets", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating budget:", error);
    throw error;
  }
}

export async function updateBudget(id: number, data: UpdateBudgetDto): Promise<BudgetDto> {
  try {
    const response = await fetchApi(`/finances/budgets/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating budget:", error);
    throw error;
  }
}

export async function deleteBudget(id: number): Promise<void> {
  try {
    await fetchApi(`/finances/budgets/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting budget:", error);
    throw error;
  }
}

export async function approveBudget(id: number, approvedById: number): Promise<BudgetDto> {
  try {
    const response = await fetchApi(`/finances/budgets/${id}/approve`, {
      method: "POST",
      body: JSON.stringify({ approvedById }),
    });
    return response.data;
  } catch (error) {
    console.error("Error approving budget:", error);
    throw error;
  }
}

export async function getExpenses(filters?: ExpenseFilterParamsDto): Promise<{ data: ExpenseDto[]; total: number }> {
  try {
    const query = new URLSearchParams();
    if (filters?.status) query.append("status", filters.status);
    if (filters?.categoryId) query.append("categoryId", filters.categoryId.toString());
    if (filters?.skip) query.append("skip", filters.skip.toString());
    if (filters?.take) query.append("take", filters.take.toString());

    const response = await fetchApi(`/finances/expenses?${query.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching expenses:", error);
    throw error;
  }
}

export async function createExpense(data: CreateExpenseDto): Promise<ExpenseDto> {
  try {
    const response = await fetchApi("/finances/expenses", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating expense:", error);
    throw error;
  }
}

export async function updateExpense(id: number, data: UpdateExpenseDto): Promise<ExpenseDto> {
  try {
    const response = await fetchApi(`/finances/expenses/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating expense:", error);
    throw error;
  }
}

export async function deleteExpense(id: number): Promise<void> {
  try {
    await fetchApi(`/finances/expenses/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting expense:", error);
    throw error;
  }
}

export async function initiatePayment(feeId: number): Promise<string> {
  try {
    const response = await fetchApi("/finances/payments/initiate", {
      method: "POST",
      body: JSON.stringify({ feeId }),
    });
    return response.data; // Assuming data contains the redirect URL
  } catch (error) {
    console.error("Error initiating payment:", error);
    throw error;
  }
}