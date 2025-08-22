// src/services/paymentGatewayService.ts
"use client";

import { apiClient } from '@/lib/apiClient';

export interface PaymentGatewayConfig {
  id: string;
  name: string;
  type: 'STRIPE' | 'PAYPAL' | 'PSE' | 'PAYU' | 'WOMPI' | 'MERCADO_PAGO';
  apiKey: string;
  secretKey: string;
  webhookSecret?: string;
  merchantId?: string;
  environment: 'test' | 'production';
  supportedCurrencies: string[];
  supportedMethods: string[];
  isActive: boolean;
  maxAmount?: number;
  minAmount?: number;
  commissionRate?: number;
  fixedCommission?: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaymentMethod {
  id: string;
  userId: string;
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_ACCOUNT' | 'PAYPAL' | 'PSE';
  provider: string;
  isDefault: boolean;
  isActive: boolean;
  name?: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  paypalEmail?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Payment {
  id: string;
  userId: string;
  amount: number;
  currency: string;
  method: string;
  status: 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED' | 'CANCELLED' | 'REFUNDED';
  gatewayReference?: string;
  description?: string;
  metadata?: any;
  createdAt: Date;
  updatedAt: Date;
  user?: {
    id: string;
    name: string;
    email: string;
  };
  paymentMethod?: PaymentMethod;
  attempts?: PaymentAttempt[];
  transactions?: Transaction[];
  fees?: Fee[];
  refunds?: PaymentRefund[];
}

export interface PaymentAttempt {
  id: string;
  paymentId: string;
  status: string;
  gateway: string;
  gatewayTransactionId?: string;
  errorMessage?: string;
  amount: number;
  currency: string;
  createdAt: Date;
  completedAt?: Date;
}

export interface Transaction {
  id: string;
  paymentId: string;
  paymentGatewayId: string;
  amount: number;
  currency: string;
  type: 'PAYMENT' | 'REFUND' | 'CHARGEBACK';
  status: string;
  gatewayTransactionId?: string;
  gatewayReference?: string;
  processingFee?: number;
  netAmount?: number;
  description?: string;
  webhookVerified: boolean;
  reconciled: boolean;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}

export interface PaymentRefund {
  id: string;
  paymentId: string;
  amount: number;
  currency: string;
  reason: 'REQUESTED_BY_CUSTOMER' | 'DUPLICATE' | 'FRAUDULENT' | 'ERROR';
  status: string;
  gatewayRefundId?: string;
  processedBy?: string;
  notes?: string;
  createdAt: Date;
  processedAt?: Date;
}

export interface Fee {
  id: string;
  title: string;
  description?: string;
  type: string;
  propertyId: string;
  amount: number;
  dueDate: Date;
  paid: boolean;
  paidAt?: Date;
  paymentId?: string;
  createdAt: Date;
}

export interface PSEBank {
  code: string;
  name: string;
}

export interface CreatePaymentData {
  userId: string;
  amount: number;
  currency?: string;
  method: string;
  paymentMethodId?: string;
  description?: string;
  metadata?: any;
  feeIds?: string[];
}

export interface ProcessPaymentData {
  paymentData: CreatePaymentData;
  gatewayId: string;
  paymentParams?: any;
  returnUrl?: string;
  cancelUrl?: string;
  pseData?: {
    bankCode: string;
    userType: 'NATURAL' | 'JURIDICA';
    documentType: 'CC' | 'CE' | 'NIT' | 'TI' | 'PP' | 'IDC';
    documentNumber: string;
    userEmail: string;
    userName?: string;
  };
}

export interface PaymentResponse {
  id: string;
  status: string;
  gatewayReference?: string;
  redirectUrl?: string;
  data?: any;
  errorMessage?: string;
}

export interface PaymentFilters {
  userId?: string;
  status?: string;
  method?: string;
  dateFrom?: string;
  dateTo?: string;
  amountFrom?: number;
  amountTo?: number;
  page?: number;
  limit?: number;
}

export interface CreatePaymentMethodData {
  type: 'CREDIT_CARD' | 'DEBIT_CARD' | 'BANK_ACCOUNT' | 'PAYPAL' | 'PSE';
  provider: string;
  gatewayMethodId?: string;
  isDefault?: boolean;
  name?: string;
  last4?: string;
  brand?: string;
  expiryMonth?: number;
  expiryYear?: number;
  bankName?: string;
  bankCode?: string;
  accountType?: string;
  paypalEmail?: string;
  metadata?: any;
}

export interface CreateRefundData {
  paymentId: string;
  amount: number;
  currency?: string;
  reason: 'REQUESTED_BY_CUSTOMER' | 'DUPLICATE' | 'FRAUDULENT' | 'ERROR';
  notes?: string;
  metadata?: any;
}

class PaymentGatewayService {
  private baseUrl = '/api/payment-gateways';

  // ========================================
  // GATEWAY CONFIGURATION METHODS
  // ========================================

  async getPaymentGateways(): Promise<PaymentGatewayConfig[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment gateways:', error);
      throw new Error('Error al obtener pasarelas de pago');
    }
  }

  async getActivePaymentGateways(): Promise<PaymentGatewayConfig[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/active`);
      return response.data;
    } catch (error) {
      console.error('Error fetching active payment gateways:', error);
      throw new Error('Error al obtener pasarelas activas');
    }
  }

  async getPaymentGatewayById(id: string): Promise<PaymentGatewayConfig> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment gateway:', error);
      throw new Error('Error al obtener pasarela de pago');
    }
  }

  async createPaymentGateway(data: Partial<PaymentGatewayConfig>): Promise<PaymentGatewayConfig> {
    try {
      const response = await apiClient.post(`${this.baseUrl}`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment gateway:', error);
      throw new Error('Error al crear pasarela de pago');
    }
  }

  async updatePaymentGateway(id: string, data: Partial<PaymentGatewayConfig>): Promise<PaymentGatewayConfig> {
    try {
      const response = await apiClient.put(`${this.baseUrl}/${id}`, data);
      return response.data;
    } catch (error) {
      console.error('Error updating payment gateway:', error);
      throw new Error('Error al actualizar pasarela de pago');
    }
  }

  async deletePaymentGateway(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/${id}`);
    } catch (error) {
      console.error('Error deleting payment gateway:', error);
      throw new Error('Error al eliminar pasarela de pago');
    }
  }

  // ========================================
  // PAYMENT PROCESSING METHODS
  // ========================================

  async processPayment(data: ProcessPaymentData): Promise<PaymentResponse> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/process`, data);
      return response.data;
    } catch (error) {
      console.error('Error processing payment:', error);
      throw new Error('Error al procesar pago');
    }
  }

  async getPayments(filters?: PaymentFilters): Promise<{ payments: Payment[]; total: number }> {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined && value !== null) {
            queryParams.append(key, value.toString());
          }
        });
      }

      const response = await apiClient.get(`${this.baseUrl}/payments?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payments:', error);
      throw new Error('Error al obtener pagos');
    }
  }

  async getPaymentById(id: string): Promise<Payment> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/payments/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment:', error);
      throw new Error('Error al obtener pago');
    }
  }

  async getPaymentTransactions(paymentId: string): Promise<Transaction[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/payments/${paymentId}/transactions`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment transactions:', error);
      throw new Error('Error al obtener transacciones del pago');
    }
  }

  // ========================================
  // PAYMENT METHODS
  // ========================================

  async createPaymentMethod(data: CreatePaymentMethodData): Promise<PaymentMethod> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/payment-methods`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating payment method:', error);
      throw new Error('Error al crear método de pago');
    }
  }

  async getUserPaymentMethods(): Promise<PaymentMethod[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/payment-methods`);
      return response.data;
    } catch (error) {
      console.error('Error fetching payment methods:', error);
      throw new Error('Error al obtener métodos de pago');
    }
  }

  async deletePaymentMethod(id: string): Promise<void> {
    try {
      await apiClient.delete(`${this.baseUrl}/payment-methods/${id}`);
    } catch (error) {
      console.error('Error deleting payment method:', error);
      throw new Error('Error al eliminar método de pago');
    }
  }

  // ========================================
  // REFUNDS
  // ========================================

  async createRefund(data: CreateRefundData): Promise<PaymentRefund> {
    try {
      const response = await apiClient.post(`${this.baseUrl}/refunds`, data);
      return response.data;
    } catch (error) {
      console.error('Error creating refund:', error);
      throw new Error('Error al crear reembolso');
    }
  }

  // ========================================
  // UTILITY METHODS
  // ========================================

  async getPSEBanks(): Promise<PSEBank[]> {
    try {
      const response = await apiClient.get(`${this.baseUrl}/pse/banks`);
      return response.data;
    } catch (error) {
      console.error('Error fetching PSE banks:', error);
      throw new Error('Error al obtener bancos PSE');
    }
  }

  async getWebhookEvents(filters?: { provider?: string; processed?: boolean }): Promise<any[]> {
    try {
      const queryParams = new URLSearchParams();
      if (filters?.provider) queryParams.append('provider', filters.provider);
      if (filters?.processed !== undefined) queryParams.append('processed', filters.processed.toString());

      const response = await apiClient.get(`${this.baseUrl}/webhooks/events?${queryParams}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching webhook events:', error);
      throw new Error('Error al obtener eventos de webhook');
    }
  }

  async retryFailedWebhooks(): Promise<void> {
    try {
      await apiClient.post(`${this.baseUrl}/webhooks/retry`);
    } catch (error) {
      console.error('Error retrying failed webhooks:', error);
      throw new Error('Error al reintentar webhooks fallidos');
    }
  }

  // ========================================
  // PAYMENT FLOW HELPERS
  // ========================================

  async payFees(feeIds: string[], gatewayId: string, paymentMethodId?: string): Promise<PaymentResponse> {
    // Calcular monto total de las cuotas
    const fees = await this.getFeesByIds(feeIds);
    const totalAmount = fees.reduce((sum, fee) => sum + fee.amount, 0);

    const paymentData: CreatePaymentData = {
      userId: '', // Se establece en el backend
      amount: totalAmount,
      currency: 'COP',
      method: 'FEE_PAYMENT',
      paymentMethodId,
      description: `Pago de cuotas: ${fees.map(f => f.title).join(', ')}`,
      feeIds,
    };

    return this.processPayment({
      paymentData,
      gatewayId,
    });
  }

  private async getFeesByIds(feeIds: string[]): Promise<Fee[]> {
    try {
      // Esto debería ser una llamada al servicio de fees
      const response = await apiClient.post(`/api/fees/by-ids`, { ids: feeIds });
      return response.data;
    } catch (error) {
      console.error('Error fetching fees by IDs:', error);
      throw new Error('Error al obtener cuotas');
    }
  }

  // ========================================
  // PAYMENT STATUS HELPERS
  // ========================================

  getPaymentStatusColor(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'text-green-600 bg-green-100';
      case 'PENDING':
        return 'text-yellow-600 bg-yellow-100';
      case 'PROCESSING':
        return 'text-blue-600 bg-blue-100';
      case 'FAILED':
        return 'text-red-600 bg-red-100';
      case 'CANCELLED':
        return 'text-gray-600 bg-gray-100';
      case 'REFUNDED':
        return 'text-purple-600 bg-purple-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  }

  getPaymentStatusText(status: string): string {
    switch (status) {
      case 'COMPLETED':
        return 'Completado';
      case 'PENDING':
        return 'Pendiente';
      case 'PROCESSING':
        return 'Procesando';
      case 'FAILED':
        return 'Fallido';
      case 'CANCELLED':
        return 'Cancelado';
      case 'REFUNDED':
        return 'Reembolsado';
      default:
        return 'Desconocido';
    }
  }

  getGatewayIcon(type: string): string {
    switch (type) {
      case 'STRIPE':
        return '💳';
      case 'PAYPAL':
        return '🏦';
      case 'PSE':
        return '🏛️';
      default:
        return '💰';
    }
  }

  formatCurrency(amount: number, currency: string = 'COP'): string {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }
}

export const paymentGatewayService = new PaymentGatewayService();
export default paymentGatewayService;
