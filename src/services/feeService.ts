import { fetchApi } from "@/lib/apiClient";

export enum FeeStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  OVERDUE = "OVERDUE",
  CANCELLED = "CANCELLED",
}

export interface FeeDto {
  id: number;
  name: string;
  description?: string;
  amount: number;
  type: "FIXED" | "VARIABLE";
  dueDate: string;
  isRecurring: boolean;
  frequency?: "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  isActive: boolean;
}

export interface CreateFeeData {
  name: string;
  description?: string;
  amount: number;
  type: "FIXED" | "VARIABLE";
  dueDate: string;
  isRecurring: boolean;
  frequency?: "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  isActive: boolean;
}

export interface UpdateFeeData {
  name?: string;
  description?: string;
  amount?: number;
  type?: "FIXED" | "VARIABLE";
  dueDate?: string;
  isRecurring?: boolean;
  frequency?: "MONTHLY" | "QUARTERLY" | "ANNUALLY";
  isActive?: boolean;
}

export const getFees = async (): Promise<FeeDto[]> => {
  const result = await fetchApi<{ fees: FeeDto[] }>("/finances/fees");
  return result.fees;
};

export const createFee = async (data: CreateFeeData): Promise<FeeDto> => {
  return fetchApi("/finances/fees", { method: 'POST', data });
};

export const updateFee = async (
  id: number,
  data: UpdateFeeData,
): Promise<FeeDto> => {
  return fetchApi(`/finances/fees/${id}`, { method: 'PUT', data });
};

export const deleteFee = async (id: number): Promise<void> => {
  await fetchApi(`/finances/fees/${id}`, { method: 'DELETE' });
};

export const generateOrdinaryFees = async (): Promise<any> => {
  return fetchApi("/finances/fees/generate-ordinary", { method: 'POST' });
};

export const initiatePayment = async (feeId: number): Promise<any> => {
  return fetchApi("/finances/payments/initiate", { method: 'POST', data: { feeId } });
};