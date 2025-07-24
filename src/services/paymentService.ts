import { apiClient } from "@/lib/apiClient";

export interface PaymentDto {
  id: number;
  feeId: number;
  userId: number;
  amount: number;
  paymentDate: string;
  status: string;
  transactionId?: string;
  paymentMethod: string;
}

export interface RegisterManualPaymentData {
  feeId: number;
  userId: number;
  amount: number;
  paymentDate: string;
  paymentMethod: string;
  transactionId?: string;
}

export const getPayments = async (filters?: any): Promise<PaymentDto[]> => {
  const response = await apiClient.get("/finances/payments", { params: filters });
  return response.data.data; // Assuming the API returns { data: PaymentDto[] }
};

export const getPaymentById = async (id: number): Promise<PaymentDto> => {
  const response = await apiClient.get(`/finances/payments/${id}`);
  return response.data; // Assuming the API returns PaymentDto
};

export const updatePayment = async (
  id: number,
  data: Partial<PaymentDto>,
): Promise<PaymentDto> => {
  const response = await apiClient.put(`/finances/payments/${id}`, data);
  return response.data;
};

export const deletePayment = async (id: number): Promise<void> => {
  await apiClient.delete(`/finances/payments/${id}`);
};

export const registerManualPayment = async (
  data: RegisterManualPaymentData,
): Promise<PaymentDto> => {
  const response = await apiClient.post("/finances/payments/manual", data);
  return response.data;
};

