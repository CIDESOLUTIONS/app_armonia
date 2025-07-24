import { apiClient } from "@/lib/apiClient";

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
  const response = await apiClient.get("/finances/fees");
  return response.data.fees; // Assuming the API returns { fees: FeeDto[] }
};

export const createFee = async (data: CreateFeeData): Promise<FeeDto> => {
  const response = await apiClient.post("/finances/fees", data);
  return response.data;
};

export const updateFee = async (
  id: number,
  data: UpdateFeeData,
): Promise<FeeDto> => {
  const response = await apiClient.put(`/finances/fees/${id}`, data);
  return response.data;
};

export const deleteFee = async (id: number): Promise<void> => {
  await apiClient.delete(`/finances/fees/${id}`);
};

export const generateOrdinaryFees = async (): Promise<any> => {
  const response = await apiClient.post("/finances/fees/generate-ordinary");
  return response.data;
};

export const initiatePayment = async (feeId: number): Promise<any> => {
  const response = await apiClient.post("/finances/payments/initiate", { feeId });
  return response.data;
};

