/**
 * Servicio para la integración de pagos
 * Incluye funcionalidades para procesamiento de pagos con múltiples pasarelas
 */

import { PrismaClient } from "@prisma/client";
import { ServerLogger } from "@/lib/logging/server-logger";
import { ActivityLogger } from "@/lib/logging/activity-logger";
import { CommunicationService } from "@/services/communicationService";
import { generateReceipt } from "@/lib/pdf/receipt-service";
import { encrypt, decrypt } from "@/lib/security/encryption-service";
import { TransactionStatus, DiscountType } from "@prisma/client";

// Interfaces para DTOs
export interface CreateTransactionDto {
  userId: number;
  invoiceId?: number;
  amount: number;
  currency?: string;
  description: string;
  gatewayId: number;
  methodId: number;
  paymentData?: any;
  metadata?: any;
  ipAddress?: string;
  userAgent?: string;
}

export interface ProcessPaymentDto {
  transactionId: string;
  paymentData: any;
  savePaymentMethod?: boolean;
}

export interface GatewayConfigDto {
  name: string;
  apiKey: string;
  apiSecret: string;
  merchantId?: string;
  accountId?: string;
  testMode?: boolean;
  supportedMethods: string[];
  webhookUrl?: string;
  webhookSecret?: string;
  config?: any;
}

export interface PaymentMethodDto {
  name: string;
  code: string;
  icon?: string;
  gatewayMethods: any;
  surcharge?: number;
  minAmount?: number;
  maxAmount?: number;
  instructions?: string;
}

// Adaptadores para pasarelas de pago
interface PaymentGatewayAdapter {
  initialize(config: any): Promise<boolean>;
  createPayment(transaction: any): Promise<any>;
  processPayment(transactionId: string, paymentData: any): Promise<any>;
  verifyPayment(gatewayReference: string): Promise<any>;
  refundPayment(gatewayReference: string, amount?: number): Promise<any>;
  validateWebhook(payload: any, signature: string): boolean;
}

// Implementación de adaptador para PayU Latam
export class PayUAdapter implements PaymentGatewayAdapter {
  private apiKey: string;
  private apiSecret: string;
  private merchantId: string;
  private accountId: string;
  private testMode: boolean;

  async initialize(config: any): Promise<boolean> {
    try {
      this.apiKey = config.apiKey;
      this.apiSecret = config.apiSecret;
      this.merchantId = config.merchantId;
      this.accountId = config.accountId || "";
      this.testMode = config.testMode || false;

      // Validar credenciales con una llamada de prueba
      // Implementación simplificada para el ejemplo
      return true;
    } catch (error) {
      ServerLogger.error("Error inicializando PayU", error);
      throw error;
    }
  }

  async createPayment(transaction: any): Promise<any> {
    try {
      // Implementación simplificada - en producción se haría una llamada real a la API de PayU
      const paymentUrl = this.testMode
        ? `https://sandbox.checkout.payulatam.com/ppp-web-gateway-payu/payment/${transaction.id}`
        : `https://checkout.payulatam.com/ppp-web-gateway-payu/payment/${transaction.id}`;

      return {
        success: true,
        paymentUrl,
        gatewayReference: `PAYU_${Date.now()}_${transaction.id}`,
        status: "PENDING",
      };
    } catch (error) {
      ServerLogger.error("Error creando pago en PayU", error);
      throw error;
    }
  }

  async processPayment(transactionId: string, paymentData: any): Promise<any> {
    try {
      // Implementación simplificada - en producción se procesaría el pago con PayU
      return {
        success: true,
        gatewayReference: `PAYU_${Date.now()}_${transactionId}`,
        status: "COMPLETED",
        response: {
          authorizationCode: `AUTH_${Math.floor(Math.random() * 1000000)}`,
          processorResponseCode: "00",
          transactionDate: new Date().toISOString(),
        },
      };
    } catch (error) {
      ServerLogger.error("Error procesando pago en PayU", error);
      throw error;
    }
  }

  async verifyPayment(gatewayReference: string): Promise<any> {
    try {
      // Implementación simplificada - en producción se verificaría el estado con PayU
      return {
        success: true,
        status: "COMPLETED",
        response: {
          authorizationCode: gatewayReference.split("_")[2],
          processorResponseCode: "00",
          transactionDate: new Date().toISOString(),
        },
      };
    } catch (error) {
      ServerLogger.error("Error verificando pago en PayU", error);
      throw error;
    }
  }

  async refundPayment(gatewayReference: string, amount?: number): Promise<any> {
    try {
      // Implementación simplificada - en producción se procesaría el reembolso con PayU
      return {
        success: true,
        refundReference: `REFUND_${gatewayReference}`,
        status: "REFUNDED",
        amount: amount,
      };
    } catch (error) {
      ServerLogger.error("Error reembolsando pago en PayU", error);
      throw error;
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    try {
      // Implementación simplificada - en producción se validaría la firma con el algoritmo correcto
      // Ejemplo: HMAC-SHA256 del payload con el secreto
      return true;
    } catch (error) {
      ServerLogger.error("Error validando webhook de PayU", error);
      throw error;
    }
  }
}

// Implementación de adaptador para Wompi
export class WompiAdapter implements PaymentGatewayAdapter {
  private apiKey: string;
  private apiSecret: string;
  private testMode: boolean;

  async initialize(config: any): Promise<boolean> {
    try {
      this.apiKey = config.apiKey;
      this.apiSecret = config.apiSecret;
      this.testMode = config.testMode || false;

      // Validar credenciales con una llamada de prueba
      // Implementación simplificada para el ejemplo
      return true;
    } catch (error) {
      ServerLogger.error("Error inicializando Wompi", error);
      throw error;
    }
  }

  async createPayment(transaction: any): Promise<any> {
    try {
      // Implementación simplificada - en producción se haría una llamada real a la API de Wompi
      const paymentUrl = this.testMode
        ? `https://sandbox.checkout.wompi.co/p/${transaction.id}`
        : `https://checkout.wompi.co/p/${transaction.id}`;

      return {
        success: true,
        paymentUrl,
        gatewayReference: `WOMPI_${Date.now()}_${transaction.id}`,
        status: "PENDING",
      };
    } catch (error) {
      ServerLogger.error("Error creando pago en Wompi", error);
      throw error;
    }
  }

  async processPayment(transactionId: string, paymentData: any): Promise<any> {
    try {
      // Implementación simplificada - en producción se procesaría el pago con Wompi
      return {
        success: true,
        gatewayReference: `WOMPI_${Date.now()}_${transactionId}`,
        status: "COMPLETED",
        response: {
          authorizationCode: `AUTH_${Math.floor(Math.random() * 1000000)}`,
          processorResponseCode: "APPROVED",
          transactionDate: new Date().toISOString(),
        },
      };
    } catch (error) {
      ServerLogger.error("Error procesando pago en Wompi", error);
      throw error;
    }
  }

  async verifyPayment(gatewayReference: string): Promise<any> {
    try {
      // Implementación simplificada - en producción se verificaría el estado con Wompi
      return {
        success: true,
        status: "COMPLETED",
        response: {
          authorizationCode: gatewayReference.split("_")[2],
          processorResponseCode: "APPROVED",
          transactionDate: new Date().toISOString(),
        },
      };
    } catch (error) {
      ServerLogger.error("Error verificando pago en Wompi", error);
      throw error;
    }
  }

  async refundPayment(gatewayReference: string, amount?: number): Promise<any> {
    try {
      // Implementación simplificada - en producción se procesaría el reembolso con Wompi
      return {
        success: true,
        refundReference: `REFUND_${gatewayReference}`,
        status: "REFUNDED",
        amount: amount,
      };
    } catch (error) {
      ServerLogger.error("Error reembolsando pago en Wompi", error);
      throw error;
    }
  }

  validateWebhook(payload: any, signature: string): boolean {
    try {
      // Implementación simplificada - en producción se validaría la firma con el algoritmo correcto
      return true;
    } catch (error) {
      ServerLogger.error("Error validando webhook de Wompi", error);
      throw error;
    }
  }
}

// Fábrica de adaptadores de pasarelas
export class PaymentGatewayFactory {
  static createAdapter(gatewayName: string): PaymentGatewayAdapter | null {
    switch (gatewayName.toLowerCase()) {
      case "payu":
        return new PayUAdapter();
      case "wompi":
        return new WompiAdapter();
      default:
        ServerLogger.error(`Pasarela no soportada: ${gatewayName}`);
        return null;
    }
  }
}

// Servicio principal de pagos
export class PaymentService {
  private prisma: PrismaClient;
  private communicationService: CommunicationService;

  constructor(prismaClient: PrismaClient, communicationService: CommunicationService) {
    this.prisma = prismaClient;
    this.communicationService = communicationService;
  }

  /**
   * Inicia el proceso de pago para una cuota pendiente.
   * @param feeId ID de la cuota pendiente.
   * @param userId ID del usuario que inicia el pago.
   * @param complexId ID del complejo residencial.
   * @returns URL de la pasarela de pago.
   */
  async initiatePaymentForFee(
    feeId: number,
    userId: number,
    complexId: number,
  ): Promise<string> {
    try {
      const fee = await this.prisma.bill.findUnique({
        where: { id: feeId },
      });

      if (!fee) {
        throw new Error(`Cuota con ID ${feeId} no encontrada.`);
      }

      // Asumiendo una pasarela y método de pago por defecto para el ejemplo.
      // En un escenario real, estos se seleccionarían dinámicamente o se configurarían.
      const defaultGateway = await this.prisma.paymentGateway.findFirst({
        where: { isActive: true },
      });
      const defaultMethod = await this.prisma.paymentMethod.findFirst({
        where: { isActive: true },
      });

      if (!defaultGateway || !defaultMethod) {
        throw new Error("No se encontró una pasarela o método de pago activo.");
      }

      const transaction = await this.createTransaction({
        userId: userId,
        invoiceId: fee.id, // Asumiendo que invoiceId mapea a Bill.id
        amount: fee.totalAmount.toNumber(), // Convertir Decimal a number
        currency: "COP", // Asumiendo moneda por defecto
        description: `Pago de cuota: ${fee.billNumber} - ${fee.billingPeriod}`,
        gatewayId: defaultGateway.id,
        methodId: defaultMethod.id,
        // Añadir otros campos necesarios para CreateTransactionDto
      });

      if (!transaction.paymentUrl) {
        throw new Error("URL de pago no generada por la pasarela.");
      }

      return transaction.paymentUrl;
    } catch (error) {
      ServerLogger.error(
        `Error al iniciar el pago de la cuota ${feeId}:`,
        error,
      );
      throw new Error("No se pudo iniciar el pago de la cuota.");
    }
  }

  /**
   * Crea una nueva transacción de pago
   */
  async createTransaction(data: CreateTransactionDto): Promise<any> {
    try {
      // Validar datos básicos
      if (!data.amount || data.amount <= 0) {
        throw new Error("El monto debe ser mayor a cero");
      }

      // Obtener configuración de la pasarela
      const gateway = await this.prisma.paymentGateway.findUnique({
        where: { id: data.gatewayId, isActive: true },
      });

      if (!gateway) {
        throw new Error("Pasarela de pago no encontrada o inactiva");
      }

      // Obtener método de pago
      const paymentMethod = await this.prisma.paymentMethod.findUnique({
        where: { id: data.methodId, isActive: true },
      });

      if (!paymentMethod) {
        throw new Error("Método de pago no encontrado o inactivo");
      }

      // Validar límites del método de pago
      if (paymentMethod.minAmount && data.amount < paymentMethod.minAmount) {
        throw new Error(
          `El monto mínimo para este método de pago es ${paymentMethod.minAmount}`,
        );
      }

      if (paymentMethod.maxAmount && data.amount > paymentMethod.maxAmount) {
        throw new Error(
          `El monto máximo para este método de pago es ${paymentMethod.maxAmount}`,
        );
      }

      // Aplicar recargo si corresponde
      let finalAmount = data.amount;
      if (paymentMethod.surcharge > 0) {
        finalAmount += data.amount * (paymentMethod.surcharge / 100);
      }

      // Crear transacción en la base de datos
      const transaction = await this.prisma.transaction.create({
        data: {
          userId: data.userId,
          invoiceId: data.invoiceId,
          amount: finalAmount,
          currency: data.currency || "COP",
          description: data.description,
          status: TransactionStatus.PENDING,
          gatewayId: data.gatewayId,
          methodId: data.methodId,
          paymentData: data.paymentData || {},
          metadata: data.metadata || {},
          ipAddress: data.ipAddress,
          userAgent: data.userAgent,
          expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24 horas por defecto
        },
      });

      // Registrar actividad
      await ActivityLogger.log({
        action: "payment.transaction.create",
        userId: data.userId,
        entityType: "transaction",
        entityId: transaction.id,
        details: { amount: finalAmount, currency: transaction.currency },
      });

      // Crear pago en la pasarela
      const adapter = PaymentGatewayFactory.createAdapter(gateway.name);
      if (!adapter) {
        throw new Error(
          `No se pudo crear adaptador para la pasarela ${gateway.name}`,
        );
      }

      // Inicializar adaptador con configuración
      const gatewayConfig = {
        apiKey: await decrypt(gateway.apiKey),
        apiSecret: await decrypt(gateway.apiSecret),
        merchantId: gateway.merchantId,
        accountId: gateway.accountId,
        testMode: gateway.testMode,
        ...gateway.config,
      };

      await adapter.initialize(gatewayConfig);

      // Crear pago en la pasarela
      const gatewayResponse = await adapter.createPayment({
        id: transaction.id,
        amount: finalAmount,
        currency: transaction.currency,
        description: transaction.description,
        userId: transaction.userId,
        invoiceId: transaction.invoiceId,
        paymentData: transaction.paymentData,
      });

      // Actualizar transacción con datos de la pasarela
      const updatedTransaction = await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          gatewayReference: gatewayResponse.gatewayReference,
          paymentUrl: gatewayResponse.paymentUrl,
          gatewayResponse: gatewayResponse,
          status: PaymentService.mapGatewayStatus(gatewayResponse.status),
        },
      });

      return updatedTransaction;
    } catch (error) {
      ServerLogger.error("Error al crear transacción de pago", error);
      throw new Error("No se pudo crear la transacción de pago");
    }
  }

  /**
   * Verifica el estado de una transacción en la pasarela
   */
  async verifyTransaction(transactionId: string): Promise<any> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          gateway: true,
        },
      });

      if (!transaction) {
        throw new Error("Transacción no encontrada");
      }

      if (!transaction.gatewayReference) {
        throw new Error("La transacción no tiene referencia de pasarela");
      }

      // Verificar estado en la pasarela
      const adapter = PaymentGatewayFactory.createAdapter(
        transaction.gateway.name,
      );
      if (!adapter) {
        throw new Error(
          `No se pudo crear adaptador para la pasarela ${transaction.gateway.name}`,
        );
      }

      // Inicializar adaptador con configuración
      const gatewayConfig = {
        apiKey: await decrypt(transaction.gateway.apiKey),
        apiSecret: await decrypt(transaction.gateway.apiSecret),
        merchantId: transaction.gateway.merchantId,
        accountId: transaction.gateway.accountId,
        testMode: transaction.gateway.testMode,
        ...transaction.gateway.config,
      };

      await adapter.initialize(gatewayConfig);

      // Verificar pago
      const gatewayResponse = await adapter.verifyPayment(
        transaction.gatewayReference,
      );

      // Determinar estado final
      const finalStatus = PaymentService.mapGatewayStatus(
        gatewayResponse.status,
      );
      const statusChanged = finalStatus !== transaction.status;
      const isCompleted = finalStatus === TransactionStatus.COMPLETED;

      // Actualizar transacción si cambió el estado
      if (statusChanged) {
        const updatedTransaction = await this.prisma.transaction.update({
          where: { id: transaction.id },
          data: {
            status: finalStatus,
            gatewayResponse: gatewayResponse,
            completedAt: isCompleted ? new Date() : transaction.completedAt,
          },
        });

        // Si el pago fue completado y no estaba completado antes
        if (isCompleted && transaction.status !== TransactionStatus.COMPLETED) {
          // Actualizar factura si existe
          if (transaction.invoiceId) {
            await this.prisma.bill.update({
              where: { id: transaction.invoiceId },
              data: {
                status: "PAID",
                paidAt: new Date(),
                // paidAmount: transaction.amount, // No existe en el modelo Bill
              },
            });
          }

          // Generar recibo
          const receipt = await generateReceipt(transaction.id);

          // Actualizar transacción con recibo
          await this.prisma.transaction.update({
            where: { id: transaction.id },
            data: {
              // receiptId: receipt.id, // No existe en el modelo Transaction
              // receiptUrl: receipt.url, // No existe en el modelo Transaction
            },
          });

          // Enviar notificación al usuario
          await this.communicationService.notifyUser(transaction.userId, {
            type: "info",
            title: "Pago confirmado",
            message: `Su pago por ${transaction.amount} ${transaction.currency} ha sido confirmado.`,
            sourceType: "financial",
            sourceId: transaction.id,
          });

          // Registrar actividad
          await ActivityLogger.log({
            action: "payment.transaction.completed",
            userId: transaction.userId,
            entityType: "transaction",
            entityId: transaction.id,
            details: {
              amount: transaction.amount,
              currency: transaction.currency,
              gatewayReference: transaction.gatewayReference,
            },
          });
        }

        return updatedTransaction;
      }

      return transaction;
    } catch (error) {
      ServerLogger.error("Error al verificar transacción", error);
      throw new Error("No se pudo verificar la transacción");
    }
  }

  /**
   * Procesa un webhook de pasarela de pago
   */
  async processWebhook(
    gatewayName: string,
    payload: any,
    signature: string,
  ): Promise<any> {
    try {
      // Obtener configuración de la pasarela
      const gateway = await this.prisma.paymentGateway.findFirst({
        where: {
          name: { equals: gatewayName, mode: "insensitive" },
          isActive: true,
        },
      });

      if (!gateway) {
        throw new Error(`Pasarela ${gatewayName} no encontrada o inactiva`);
      }

      // Crear adaptador
      const adapter = PaymentGatewayFactory.createAdapter(gateway.name);
      if (!adapter) {
        throw new Error(
          `No se pudo crear adaptador para la pasarela ${gateway.name}`,
        );
      }

      // Validar firma del webhook
      const isValid = adapter.validateWebhook(payload, signature);
      if (!isValid) {
        throw new Error("Firma de webhook inválida");
      }

      // Extraer referencia de transacción del payload
      // Nota: Esto depende de la estructura específica del webhook de cada pasarela
      const gatewayReference = PaymentService.extractGatewayReference(
        gateway.name,
        payload,
      );
      if (!gatewayReference) {
        throw new Error(
          "No se pudo extraer referencia de transacción del webhook",
        );
      }

      // Buscar transacción por referencia de pasarela
      const transaction = await this.prisma.transaction.findFirst({
        where: { gatewayReference },
      });

      if (!transaction) {
        throw new Error(
          `Transacción con referencia ${gatewayReference} no encontrada`,
        );
      }

      // Extraer estado del payload
      const gatewayStatus = PaymentService.extractGatewayStatus(
        gateway.name,
        payload,
      );
      const newStatus = PaymentService.mapGatewayStatus(gatewayStatus);

      // Actualizar transacción
      await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: newStatus,
          gatewayResponse: payload,
          completedAt:
            newStatus === TransactionStatus.COMPLETED
              ? new Date()
              : transaction.completedAt,
        },
      });

      // Verificar transacción para procesar lógica adicional
      await this.verifyTransaction(transaction.id);

      return { success: true };
    } catch (error) {
      ServerLogger.error("Error al procesar webhook", error);
      throw new Error("No se pudo procesar el webhook");
    }
  }

  /**
   * Reembolsa una transacción
   */
  async refundTransaction(
    transactionId: string,
    amount?: number,
    reason?: string,
  ): Promise<any> {
    try {
      const transaction = await this.prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          gateway: true,
        },
      });

      if (!transaction) {
        throw new Error("Transacción no encontrada");
      }

      if (transaction.status !== TransactionStatus.COMPLETED) {
        throw new Error("Solo se pueden reembolsar transacciones completadas");
      }

      if (!transaction.gatewayReference) {
        throw new Error("La transacción no tiene referencia de pasarela");
      }

      // Validar monto de reembolso
      const refundAmount = amount || transaction.amount;
      if (refundAmount <= 0 || refundAmount > transaction.amount) {
        throw new Error("Monto de reembolso inválido");
      }

      // Procesar reembolso en la pasarela
      const adapter = PaymentGatewayFactory.createAdapter(
        transaction.gateway.name,
      );
      if (!adapter) {
        throw new Error(
          `No se pudo crear adaptador para la pasarela ${transaction.gateway.name}`,
        );
      }

      // Inicializar adaptador con configuración
      const gatewayConfig = {
        apiKey: await decrypt(transaction.gateway.apiKey),
        apiSecret: await decrypt(transaction.gateway.apiSecret),
        merchantId: transaction.gateway.merchantId,
        accountId: transaction.gateway.accountId,
        testMode: transaction.gateway.testMode,
        ...transaction.gateway.config,
      };

      await adapter.initialize(gatewayConfig);

      // Procesar reembolso
      const refundResponse = await adapter.refundPayment(
        transaction.gatewayReference,
        refundAmount,
      );

      // Actualizar transacción
      const updatedTransaction = await this.prisma.transaction.update({
        where: { id: transaction.id },
        data: {
          status: TransactionStatus.REFUNDED,
          gatewayResponse: {
            ...transaction.gatewayResponse,
            refund: refundResponse,
          },
          metadata: {
            ...transaction.metadata,
            refund: {
              amount: refundAmount,
              reason: reason || "Reembolso solicitado",
              date: new Date(),
            },
          },
        },
      });

      // Si hay factura asociada, actualizar su estado
      if (transaction.invoiceId) {
        await this.prisma.bill.update({
          where: { id: transaction.invoiceId },
          data: {
            status: "UNPAID",
            // paidAmount: 0, // No existe en el modelo Bill
          },
        });
      }

      // Enviar notificación al usuario
      await NotificationService.sendEmail({
        recipient:
          (
            await this.prisma.user.findUnique({
              where: { id: transaction.userId },
            })
          )?.email || "",
        subject: "Reembolso procesado",
        body: `Su pago por ${refundAmount} ${transaction.currency} ha sido reembolsado.`,
        type: "EMAIL",
        entityType: "PAYMENT",
        entityId: transaction.id,
      });

      // Registrar actividad
      await ActivityLogger.log({
        action: "payment.transaction.refunded",
        userId: transaction.userId,
        entityType: "transaction",
        entityId: transaction.id,
        details: {
          amount: refundAmount,
          currency: transaction.currency,
          reason: reason || "Reembolso solicitado",
        },
      });

      return updatedTransaction;
    } catch (error) {
      ServerLogger.error("Error al reembolsar transacción", error);
      throw new Error("No se pudo reembolsar la transacción");
    }
  }

  /**
   * Guarda un token de pago para uso futuro
   */
  async savePaymentToken(data: {
    userId: number;
    gatewayId: number;
    token: string;
    type: string;
    lastFour?: string;
    brand?: string;
    expiryMonth?: number;
    expiryYear?: number;
    holderName?: string;
    isDefault?: boolean;
  }): Promise<any> {
    try {
      // Encriptar token
      const encryptedToken = await encrypt(data.token);

      // Si este token será el predeterminado, quitar ese estado de otros tokens
      if (data.isDefault) {
        await this.prisma.paymentToken.updateMany({
          where: {
            userId: data.userId,
            isDefault: true,
          },
          data: { isDefault: false },
        });
      }

      // Crear token
      const paymentToken = await this.prisma.paymentToken.create({
        data: {
          userId: data.userId,
          gatewayId: data.gatewayId,
          type: data.type,
          token: encryptedToken,
          lastFour: data.lastFour,
          brand: data.brand,
          expiryMonth: data.expiryMonth,
          expiryYear: data.expiryYear,
          holderName: data.holderName,
          isDefault: data.isDefault || false,
        },
      });

      // Registrar actividad
      await ActivityLogger.log({
        action: "payment.token.create",
        userId: data.userId,
        entityType: "paymentToken",
        entityId: paymentToken.id,
        details: {
          type: data.type,
          brand: data.brand,
          lastFour: data.lastFour,
        },
      });

      return {
        id: paymentToken.id,
        type: paymentToken.type,
        lastFour: paymentToken.lastFour,
        brand: paymentToken.brand,
        expiryMonth: paymentToken.expiryMonth,
        expiryYear: paymentToken.expiryYear,
        holderName: paymentToken.holderName,
        isDefault: paymentToken.isDefault,
      };
    } catch (error) {
      ServerLogger.error("Error al guardar token de pago", error);
      throw new Error("No se pudo guardar el token de pago");
    }
  }

  /**
   * Obtiene tokens de pago de un usuario
   */
  async getUserPaymentTokens(userId: number): Promise<any> {
    try {
      const tokens = await this.prisma.paymentToken.findMany({
        where: {
          userId,
          isActive: true,
        },
        include: {
          gateway: {
            select: {
              name: true,
            },
          },
        },
        orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
      });

      // No devolver el token encriptado
      return tokens.map((token) => ({
        id: token.id,
        type: token.type,
        lastFour: token.lastFour,
        brand: token.brand,
        expiryMonth: token.expiryMonth,
        expiryYear: token.expiryYear,
        holderName: token.holderName,
        isDefault: token.isDefault,
        gateway: token.gateway.name,
        createdAt: token.createdAt,
      }));
    } catch (error) {
      ServerLogger.error(
        `Error al obtener tokens de pago del usuario ${userId}`,
        error,
      );
      throw new Error("No se pudieron obtener los tokens de pago");
    }
  }

  /**
   * Elimina un token de pago
   */
  async deletePaymentToken(tokenId: string, userId: number): Promise<any> {
    try {
      // Verificar que el token pertenece al usuario
      const token = await this.prisma.paymentToken.findFirst({
        where: {
          id: tokenId,
          userId,
        },
      });

      if (!token) {
        throw new Error("Token de pago no encontrado");
      }

      // Desactivar token en lugar de eliminarlo
      await this.prisma.paymentToken.update({
        where: { id: tokenId },
        data: { isActive: false },
      });

      // Registrar actividad
      await ActivityLogger.log({
        action: "payment.token.delete",
        userId,
        entityType: "paymentToken",
        entityId: tokenId,
        details: {
          type: token.type,
          brand: token.brand,
          lastFour: token.lastFour,
        },
      });

      return { success: true };
    } catch (error) {
      ServerLogger.error(`Error al eliminar token de pago ${tokenId}`, error);
      throw new Error("No se pudo eliminar el token de pago");
    }
  }

  /**
   * Configura una pasarela de pago
   */
  async configureGateway(data: GatewayConfigDto): Promise<any> {
    try {
      // Encriptar credenciales
      const encryptedApiKey = await encrypt(data.apiKey);
      const encryptedApiSecret = await encrypt(data.apiSecret);

      // Buscar si ya existe la pasarela
      const existingGateway = await this.prisma.paymentGateway.findFirst({
        where: {
          name: { equals: data.name, mode: "insensitive" },
        },
      });

      let gateway;
      if (existingGateway) {
        // Actualizar pasarela existente
        gateway = await this.prisma.paymentGateway.update({
          where: { id: existingGateway.id },
          data: {
            apiKey: encryptedApiKey,
            apiSecret: encryptedApiSecret,
            merchantId: data.merchantId,
            accountId: data.accountId,
            testMode:
              data.testMode !== undefined
                ? data.testMode
                : existingGateway.testMode,
            supportedMethods: data.supportedMethods,
            webhookUrl: data.webhookUrl,
            webhookSecret: data.webhookSecret,
            config: data.config,
            isActive: true,
            updatedAt: new Date(),
          },
        });
      } else {
        // Crear nueva pasarela
        gateway = await this.prisma.paymentGateway.create({
          data: {
            name: data.name,
            apiKey: encryptedApiKey,
            apiSecret: encryptedApiSecret,
            merchantId: data.merchantId,
            accountId: data.accountId,
            testMode: data.testMode !== undefined ? data.testMode : true,
            supportedMethods: data.supportedMethods,
            webhookUrl: data.webhookUrl,
            webhookSecret: data.webhookSecret,
            config: data.config,
            isActive: true,
          },
        });
      }

      // Validar configuración con la pasarela
      const adapter = PaymentGatewayFactory.createAdapter(gateway.name);
      if (!adapter) {
        throw new Error(
          `No se pudo crear adaptador para la pasarela ${gateway.name}`,
        );
      }

      const gatewayConfig = {
        apiKey: data.apiKey, // Usar valores sin encriptar para la validación
        apiSecret: data.apiSecret,
        merchantId: data.merchantId,
        accountId: data.accountId,
        testMode: gateway.testMode,
        ...data.config,
      };

      const isValid = await adapter.initialize(gatewayConfig);
      if (!isValid) {
        throw new Error(
          `Configuración inválida para la pasarela ${gateway.name}`,
        );
      }

      return {
        id: gateway.id,
        name: gateway.name,
        supportedMethods: gateway.supportedMethods,
        testMode: gateway.testMode,
        isActive: gateway.isActive,
      };
    } catch (error) {
      ServerLogger.error("Error al configurar pasarela de pago", error);
      throw new Error("No se pudo configurar la pasarela de pago");
    }
  }

  /**
   * Configura un método de pago
   */
  async configurePaymentMethod(data: PaymentMethodDto): Promise<any> {
    try {
      // Buscar si ya existe el método
      const existingMethod = await this.prisma.paymentMethod.findFirst({
        where: {
          code: { equals: data.code, mode: "insensitive" },
        },
      });

      let paymentMethod;
      if (existingMethod) {
        // Actualizar método existente
        paymentMethod = await this.prisma.paymentMethod.update({
          where: { id: existingMethod.id },
          data: {
            name: data.name,
            icon: data.icon,
            gatewayMethods: data.gatewayMethods,
            surcharge:
              data.surcharge !== undefined
                ? data.surcharge
                : existingMethod.surcharge,
            minAmount: data.minAmount,
            maxAmount: data.maxAmount,
            instructions: data.instructions,
            isActive: true,
            updatedAt: new Date(),
          },
        });
      } else {
        // Crear nuevo método
        paymentMethod = await this.prisma.paymentMethod.create({
          data: {
            name: data.name,
            code: data.code,
            icon: data.icon,
            gatewayMethods: data.gatewayMethods,
            surcharge: data.surcharge || 0,
            minAmount: data.minAmount,
            maxAmount: data.maxAmount,
            instructions: data.instructions,
            isActive: true,
          },
        });
      }

      return paymentMethod;
    } catch (error) {
      ServerLogger.error("Error al configurar método de pago", error);
      throw new Error("No se pudo configurar el método de pago");
    }
  }

  /**
   * Obtiene transacciones de un usuario
   */
  async getUserTransactions(
    userId: number,
    page = 1,
    limit = 10,
    status?: TransactionStatus,
  ): Promise<any> {
    try {
      const skip = (page - 1) * limit;

      const where = {
        userId,
        ...(status && { status }),
      };

      const total = await this.prisma.transaction.count({ where });

      const transactions = await this.prisma.transaction.findMany({
        where,
        include: {
          gateway: {
            select: {
              name: true,
            },
          },
          method: {
            select: {
              name: true,
              code: true,
              icon: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
      });

      return {
        data: transactions,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      ServerLogger.error(
        `Error al obtener transacciones del usuario ${userId}`,
        error,
      );
      throw new Error("No se pudieron obtener las transacciones");
    }
  }

  /**
   * Obtiene estadísticas de pagos
   */
  async getPaymentStats(dateFrom?: Date, dateTo?: Date): Promise<any> {
    try {
      const now = new Date();
      const fromDate = dateFrom || new Date(now.setMonth(now.getMonth() - 1));
      const toDate = dateTo || new Date();

      // Total de transacciones por estado
      const transactionsByStatus = await this.prisma.transaction.groupBy({
        by: ["status"],
        where: {
          createdAt: {
            gte: fromDate,
            lte: toDate,
          },
        },
        _count: true,
        _sum: {
          amount: true,
        },
      });

      // Transacciones por método de pago
      const transactionsByMethod = await this.prisma.transaction.groupBy({
        by: ["methodId"],
        where: {
          status: TransactionStatus.COMPLETED,
          createdAt: {
            gte: fromDate,
            lte: toDate,
          },
        },
        _count: true,
        _sum: {
          amount: true,
        },
      });

      // Obtener nombres de métodos
      const methodIds = transactionsByMethod.map((item) => item.methodId);
      const methods = await this.prisma.paymentMethod.findMany({
        where: {
          id: { in: methodIds },
        },
        select: {
          id: true,
          name: true,
          code: true,
        },
      });

      // Mapear IDs a nombres
      const methodMap = new Map(
        methods.map((method) => [
          method.id,
          { name: method.name, code: method.code },
        ]),
      );
      const paymentsByMethod = transactionsByMethod.map((item) => ({
        methodId: item.methodId,
        methodName: methodMap.get(item.methodId)?.name || "Desconocido",
        methodCode: methodMap.get(item.methodId)?.code || "unknown",
        count: item._count,
        amount: item._sum.amount,
      }));

      // Transacciones por día
      const transactionsByDay = await this.prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('day', "createdAt") as day,
          COUNT(*) as count,
          SUM(CASE WHEN status = 'COMPLETED' THEN 1 ELSE 0 END) as completed,
          SUM(CASE WHEN status = 'COMPLETED' THEN amount ELSE 0 END) as amount
        FROM "tenant"."Transaction"
        WHERE "createdAt" >= ${fromDate} AND "createdAt" <= ${toDate}
        GROUP BY DATE_TRUNC('day', "createdAt")
        ORDER BY day ASC
      `;

      return {
        transactionsByStatus,
        paymentsByMethod,
        transactionsByDay,
        period: {
          from: fromDate,
          to: toDate,
        },
      };
    } catch (error) {
      ServerLogger.error("Error al obtener estadísticas de pagos", error);
      throw new Error("No se pudieron obtener las estadísticas");
    }
  }

  /**
   * Método privado para mapear estados de pasarela a estados internos
   */
  private static mapGatewayStatus(gatewayStatus: string): TransactionStatus {
    const status = gatewayStatus.toUpperCase();

    if (["COMPLETED", "APPROVED", "SUCCESS", "SUCCESSFUL"].includes(status)) {
      return TransactionStatus.COMPLETED;
    }

    if (["PENDING", "CREATED", "INITIALIZED"].includes(status)) {
      return TransactionStatus.PENDING;
    }

    if (["PROCESSING", "IN_PROGRESS", "WAITING"].includes(status)) {
      return TransactionStatus.PROCESSING;
    }

    if (["FAILED", "DECLINED", "REJECTED", "ERROR"].includes(status)) {
      return TransactionStatus.FAILED;
    }

    if (["REFUNDED", "REVERSED"].includes(status)) {
      return TransactionStatus.REFUNDED;
    }

    if (["CANCELLED", "CANCELED"].includes(status)) {
      return TransactionStatus.CANCELLED;
    }

    if (["EXPIRED", "TIMEOUT"].includes(status)) {
      return TransactionStatus.EXPIRED;
    }

    return TransactionStatus.PENDING;
  }

  /**
   * Método privado para extraer referencia de transacción de un webhook
   */
  private static extractGatewayReference(
    gatewayName: string,
    payload: any,
  ): string | null {
    try {
      switch (gatewayName.toLowerCase()) {
        case "payu":
          return payload.reference_sale || payload.referenceCode;
        case "wompi":
          return payload.data?.transaction?.id || payload.data?.reference;
        default:
          return null;
      }
    } catch (error) {
      return null;
    }
  }

  /**
   * Método privado para extraer estado de un webhook
   */
  private static extractGatewayStatus(
    gatewayName: string,
    payload: any,
  ): string {
    try {
      switch (gatewayName.toLowerCase()) {
        case "payu":
          return payload.state_pol || payload.transactionState || "PENDING";
        case "wompi":
          return (
            payload.data?.transaction?.status ||
            payload.data?.status ||
            "PENDING"
          );
        default:
          return "PENDING";
      }
    } catch (error) {
      return "PENDING";
    }
  }
}
