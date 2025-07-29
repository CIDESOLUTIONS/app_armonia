import { fetchApi } from "@/lib/apiClient";

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
  const result = await fetchApi<{ data: PaymentDto[] }>("/finances/payments", {
    params: filters,
  });
  return result.data;
};

export const getPaymentById = async (id: number): Promise<PaymentDto> => {
  return fetchApi(`/finances/payments/${id}`);
};

export const updatePayment = async (
  id: number,
  data: Partial<PaymentDto>,
): Promise<PaymentDto> => {
  return fetchApi(`/finances/payments/${id}`, { method: "PUT", data });
};

export const deletePayment = async (id: number): Promise<void> => {
  await fetchApi(`/finances/payments/${id}`, { method: "DELETE" });
};

export const registerManualPayment = async (
  data: RegisterManualPaymentData,
): Promise<PaymentDto> => {
  return fetchApi("/finances/payments/manual", { method: "POST", data });
};
