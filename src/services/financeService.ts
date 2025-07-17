import { fetchApi } from "@/lib/api";

interface FinanceSummary {
  totalIngresos: number;
  totalEgresos: number;
  saldoActual: number;
  cuotasPendientes: number;
}

interface FinancialTransaction {
  id: number;
  amount: number;
  date: string;
  method: string;
  reference: string;
  receiptNumber: string;
  feeId: number;
  propertyId: number;
  createdBy: number;
}

interface ReconciliationSuggestion {
  statementEntry: any;
  payment: any;
  status: string;
}

// New DTOs for Fee Management
export interface FeeDto {
  id: number;
  title: string;
  description?: string;
  amount: number;
  dueDate: string;
  status: "PENDING" | "PAID" | "OVERDUE";
  type: "ORDINARY" | "EXTRAORDINARY" | "FINE"; // Added FINE type
  propertyId: number;
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
  type: "ORDINARY" | "EXTRAORDINARY" | "FINE";
  propertyId: number;
  unitId?: number;
  residentId?: number;
}

export interface UpdateFeeDto {
  title?: string;
  description?: string;
  amount?: number;
  dueDate?: string;
  status?: "PENDING" | "PAID" | "OVERDUE";
  type?: "ORDINARY" | "EXTRAORDINARY" | "FINE";
}

export interface FeeFilterParamsDto {
  status?: "PENDING" | "PAID" | "OVERDUE";
  type?: "ORDINARY" | "EXTRAORDINARY" | "FINE";
  propertyId?: number;
  unitId?: number;
  residentId?: number;
  startDate?: string;
  endDate?: string;
}

export interface FeeListResponseDto {
  data: FeeDto[];
  total: number;
  page: number;
  limit: number;
}

export async function getFinanceSummary(complexId: string): Promise<FinanceSummary> {
  try {
    const response = await fetchApi(`/finances/stats?complexId=${complexId}`);
    return response;
  } catch (error) {
    console.error("Error fetching finance summary:", error);
    throw error;
  }
}

export async function getRecentTransactions(complexId: string): Promise<FinancialTransaction[]> {
  try {
    const response = await fetchApi(`/finances/properties/${complexId}/payments`);
    return response;
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    throw error;
  }
}

export async function uploadBankStatement(file: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetchApi(
      "/finances/upload-statement",
      {
        method: "POST",
        body: formData,
      },
      true,
    ); // El tercer parámetro indica que no se debe añadir Content-Type automáticamente
    return response;
  } catch (error) {
    console.error("Error uploading bank statement:", error);
    throw error;
  }
}

// New functions for Fee Management
export async function getFees(filters?: FeeFilterParamsDto): Promise<FeeListResponseDto> {
  try {
    const query = new URLSearchParams();
    if (filters) {
      for (const key in filters) {
        if (filters[key as keyof FeeFilterParamsDto] !== undefined) {
          query.append(key, String(filters[key as keyof FeeFilterParamsDto]));
        }
      }
    }
    const response = await fetchApi(`/finances/fees?${query.toString()}`);
    return response;
  } catch (error) {
    console.error("Error fetching fees:", error);
    throw error;
  }
}

export async function createFee(fee: CreateFeeDto): Promise<FeeDto> {
  try {
    const response = await fetchApi("/finances/fees", {
      method: "POST",
      body: JSON.stringify(fee),
    });
    return response;
  } catch (error) {
    console.error("Error creating fee:", error);
    throw error;
  }
}

export async function updateFee(id: number, fee: UpdateFeeDto): Promise<FeeDto> {
  try {
    const response = await fetchApi(`/finances/fees/${id}`, {
      method: "PUT",
      body: JSON.stringify(fee),
    });
    return response;
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

export async function generateOrdinaryFees(
  amount: number,
  dueDate: string,
  title: string,
  description?: string,
): Promise<any> {
  try {
    const response = await fetchApi("/finances/generate-ordinary-fees", {
      method: "POST",
      body: JSON.stringify({ amount, dueDate, title, description }),
    });
    return response;
  } catch (error) {
    console.error("Error generating ordinary fees:", error);
    throw error;
  }
}

export async function approveReconciliation(suggestion: ReconciliationSuggestion): Promise<any> {
  try {
    const response = await fetchApi("/finances/reconcile/approve", {
      method: "POST",
      body: JSON.stringify(suggestion),
    });
    return response;
  } catch (error) {
    console.error("Error approving reconciliation:", error);
    throw error;
  }
}