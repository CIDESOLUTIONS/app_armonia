"use client";

import { fetchApi } from "@/lib/apiClient";

export enum PaymentGatewayType {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  PSE = 'PSE',
  MERCADOPAGO = 'MERCADOPAGO',
}

export interface PaymentGatewayConfigDto {
  id: string;
  name: string;
  type: PaymentGatewayType;
  isActive: boolean;
  testMode: boolean;
  apiKey: string; // Masked
  secretKey: string; // Masked
}

export interface CreatePaymentGatewayDto {
  name: string;
  type: PaymentGatewayType;
  isActive: boolean;
  testMode: boolean;
  apiKey: string;
  secretKey: string;
  webhookSecret?: string;
}

export type UpdatePaymentGatewayDto = Partial<CreatePaymentGatewayDto>;

export const getPaymentGateways = async (): Promise<PaymentGatewayConfigDto[]> => {
  return fetchApi("/payment-gateways");
};

export const createPaymentGateway = async (data: CreatePaymentGatewayDto): Promise<PaymentGatewayConfigDto> => {
  return fetchApi("/payment-gateways", { method: "POST", data });
};

export const updatePaymentGateway = async (id: string, data: UpdatePaymentGatewayDto): Promise<PaymentGatewayConfigDto> => {
  return fetchApi(`/payment-gateways/${id}`, { method: "PUT", data });
};

export const deletePaymentGateway = async (id: string): Promise<void> => {
  await fetchApi(`/payment-gateways/${id}`, { method: "DELETE" });
};
