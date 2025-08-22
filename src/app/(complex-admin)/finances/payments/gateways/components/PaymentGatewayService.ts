// Servicio para gestión de pasarelas de pago

const API_BASE_URL = '/api/payment-gateways';

// Función helper para manejar respuestas de la API
const handleApiResponse = async (response: Response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: 'Error de red' }));
    throw new Error(error.message || `Error ${response.status}`);
  }
  return response.json();
};

// Función helper para realizar peticiones con headers apropiados
const apiRequest = async (url: string, options: RequestInit = {}) => {
  const defaultHeaders = {
    'Content-Type': 'application/json',
  };

  const response = await fetch(url, {
    ...options,
    headers: {
      ...defaultHeaders,
      ...options.headers,
    },
  });

  return handleApiResponse(response);
};

// ===== TRANSACCIONES =====

/**
 * Obtiene todas las transacciones
 */
export const getTransactions = async () => {
  return apiRequest(`${API_BASE_URL}/transactions`);
};

/**
 * Crea una nueva transacción
 */
export const createTransaction = async (transactionData: {
  userId: string;
  amount: number;
  currency: string;
  paymentMethodId: string;
  description?: string;
}) => {
  return apiRequest(`${API_BASE_URL}/transactions`, {
    method: 'POST',
    body: JSON.stringify(transactionData),
  });
};

/**
 * Obtiene los detalles de una transacción específica
 */
export const getTransactionDetails = async (transactionId: string) => {
  return apiRequest(`${API_BASE_URL}/transactions/${transactionId}`);
};

/**
 * Reembolsa una transacción
 */
export const refundTransaction = async (transactionId: string, reason?: string) => {
  return apiRequest(`${API_BASE_URL}/transactions/${transactionId}/refund`, {
    method: 'POST',
    body: JSON.stringify({ reason }),
  });
};

/**
 * Obtiene el estado actualizado de una transacción
 */
export const getTransactionStatus = async (transactionId: string) => {
  return apiRequest(`${API_BASE_URL}/transactions/${transactionId}/status`);
};

// ===== MÉTODOS DE PAGO =====

/**
 * Obtiene todos los métodos de pago del usuario
 */
export const getPaymentMethods = async (userId?: string) => {
  const params = userId ? `?userId=${userId}` : '';
  return apiRequest(`${API_BASE_URL}/payment-methods${params}`);
};

/**
 * Agrega un nuevo método de pago
 */
export const addPaymentMethod = async (paymentMethodData: {
  userId: string;
  provider: 'STRIPE' | 'PAYPAL' | 'PSE';
  type: string;
  details: Record<string, any>;
  isDefault?: boolean;
}) => {
  return apiRequest(`${API_BASE_URL}/payment-methods`, {
    method: 'POST',
    body: JSON.stringify(paymentMethodData),
  });
};

/**
 * Elimina un método de pago
 */
export const deletePaymentMethod = async (methodId: string) => {
  return apiRequest(`${API_BASE_URL}/payment-methods/${methodId}`, {
    method: 'DELETE',
  });
};

/**
 * Establece un método de pago como predeterminado
 */
export const setDefaultPaymentMethod = async (methodId: string) => {
  return apiRequest(`${API_BASE_URL}/payment-methods/${methodId}/set-default`, {
    method: 'PATCH',
  });
};

/**
 * Actualiza los detalles de un método de pago
 */
export const updatePaymentMethod = async (
  methodId: string,
  updates: Partial<{
    details: Record<string, any>;
    isDefault: boolean;
  }>
) => {
  return apiRequest(`${API_BASE_URL}/payment-methods/${methodId}`, {
    method: 'PATCH',
    body: JSON.stringify(updates),
  });
};

// ===== PASARELAS DE PAGO =====

/**
 * Obtiene la configuración de las pasarelas de pago
 */
export const getPaymentGateways = async () => {
  return apiRequest(`${API_BASE_URL}/gateways`);
};

/**
 * Actualiza la configuración de una pasarela
 */
export const updatePaymentGateway = async (
  gatewayId: string,
  config: Record<string, any>
) => {
  return apiRequest(`${API_BASE_URL}/gateways/${gatewayId}`, {
    method: 'PATCH',
    body: JSON.stringify({ config }),
  });
};

/**
 * Habilita o deshabilita una pasarela
 */
export const togglePaymentGateway = async (gatewayId: string, isEnabled: boolean) => {
  return apiRequest(`${API_BASE_URL}/gateways/${gatewayId}/toggle`, {
    method: 'PATCH',
    body: JSON.stringify({ isEnabled }),
  });
};

// ===== WEBHOOKS =====

/**
 * Obtiene el historial de eventos de webhook
 */
export const getWebhookEvents = async (provider?: string) => {
  const params = provider ? `?provider=${provider}` : '';
  return apiRequest(`${API_BASE_URL}/webhooks/events${params}`);
};

/**
 * Reintenta el procesamiento de un evento de webhook
 */
export const retryWebhookEvent = async (eventId: string) => {
  return apiRequest(`${API_BASE_URL}/webhooks/events/${eventId}/retry`, {
    method: 'POST',
  });
};

// ===== REPORTES Y ESTADÍSTICAS =====

/**
 * Obtiene estadísticas de transacciones
 */
export const getTransactionStats = async (period: 'day' | 'week' | 'month' | 'year' = 'month') => {
  return apiRequest(`${API_BASE_URL}/stats/transactions?period=${period}`);
};

/**
 * Obtiene estadísticas por proveedor
 */
export const getProviderStats = async () => {
  return apiRequest(`${API_BASE_URL}/stats/providers`);
};

/**
 * Genera un reporte de transacciones
 */
export const generateTransactionReport = async (filters: {
  startDate?: string;
  endDate?: string;
  provider?: string;
  status?: string;
  format?: 'csv' | 'pdf';
}) => {
  const params = new URLSearchParams(filters as Record<string, string>).toString();
  return apiRequest(`${API_BASE_URL}/reports/transactions?${params}`);
};

// ===== UTILIDADES =====

/**
 * Valida una tarjeta de crédito usando el algoritmo de Luhn
 */
export const validateCreditCard = (cardNumber: string): boolean => {
  const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
  
  if (!/^\d+$/.test(cleanNumber)) {
    return false;
  }
  
  let sum = 0;
  let isEven = false;
  
  for (let i = cleanNumber.length - 1; i >= 0; i--) {
    let digit = parseInt(cleanNumber[i]);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Detecta el tipo de tarjeta basado en el número
 */
export const detectCardType = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
  
  // Visa
  if (/^4/.test(cleanNumber)) {
    return 'visa';
  }
  
  // Mastercard
  if (/^5[1-5]/.test(cleanNumber) || /^2[2-7]/.test(cleanNumber)) {
    return 'mastercard';
  }
  
  // American Express
  if (/^3[47]/.test(cleanNumber)) {
    return 'amex';
  }
  
  // Discover
  if (/^6/.test(cleanNumber)) {
    return 'discover';
  }
  
  return 'unknown';
};

/**
 * Formatea un número de tarjeta para mostrar
 */
export const formatCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
  const groups = cleanNumber.match(/.{1,4}/g) || [];
  return groups.join(' ');
};

/**
 * Enmascara un número de tarjeta mostrando solo los últimos 4 dígitos
 */
export const maskCardNumber = (cardNumber: string): string => {
  const cleanNumber = cardNumber.replace(/\s+/g, '').replace(/-/g, '');
  if (cleanNumber.length < 4) return cardNumber;
  
  const last4 = cleanNumber.slice(-4);
  const masked = '*'.repeat(cleanNumber.length - 4);
  return formatCardNumber(masked + last4);
};

export default {
  // Transacciones
  getTransactions,
  createTransaction,
  getTransactionDetails,
  refundTransaction,
  getTransactionStatus,
  
  // Métodos de pago
  getPaymentMethods,
  addPaymentMethod,
  deletePaymentMethod,
  setDefaultPaymentMethod,
  updatePaymentMethod,
  
  // Pasarelas
  getPaymentGateways,
  updatePaymentGateway,
  togglePaymentGateway,
  
  // Webhooks
  getWebhookEvents,
  retryWebhookEvent,
  
  // Estadísticas
  getTransactionStats,
  getProviderStats,
  generateTransactionReport,
  
  // Utilidades
  validateCreditCard,
  detectCardType,
  formatCardNumber,
  maskCardNumber,
};