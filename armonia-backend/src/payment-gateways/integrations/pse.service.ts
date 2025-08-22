import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as crypto from 'crypto';
import {
  CreatePaymentDto,
  ProcessPaymentDto,
  PaymentResponseDto,
  CreateRefundDto,
  PaymentStatus,
} from '../../common/dto/payment-gateways.dto';

// Bancos PSE simulados para desarrollo
const PSE_BANKS = [
  { code: '1007', name: 'BANCOLOMBIA' },
  { code: '1019', name: 'SCOTIABANK COLPATRIA' },
  { code: '1051', name: 'DAVIVIENDA' },
  { code: '1001', name: 'BANCO DE BOGOTA' },
  { code: '1006', name: 'BANCO CORPBANCA S.A' },
  { code: '1009', name: 'BANCO CAJA SOCIAL' },
  { code: '1012', name: 'BANCO GNB SUDAMERIS' },
  { code: '1040', name: 'BANCO AGRARIO' },
  { code: '1052', name: 'BANCO AV VILLAS' },
  { code: '1032', name: 'BANCO FALABELLA' },
  { code: '1023', name: 'BANCO DE OCCIDENTE' },
  { code: '1062', name: 'BANCO SANTANDER COLOMBIA' },
  { code: '1060', name: 'BANCO PICHINCHA S.A.' },
  { code: '1002', name: 'BANCO POPULAR' },
  { code: '1058', name: 'BANCO PROCREDIT COLOMBIA' },
  { code: '1061', name: 'BANCOOMEVA S.A.' },
];

interface PSEPaymentData {
  bankCode: string;
  userType: 'NATURAL' | 'JURIDICA';
  documentType: 'CC' | 'CE' | 'NIT' | 'TI' | 'PP' | 'IDC';
  documentNumber: string;
  userEmail: string;
  userName?: string;
}

@Injectable()
export class PSEService {
  private readonly logger = new Logger(PSEService.name);
  private readonly apiUrl: string;
  private readonly merchantId: string;
  private readonly merchantKey: string;

  constructor() {
    this.apiUrl = process.env.PSE_API_URL || 'https://api-test.pse.com.co';
    this.merchantId = process.env.PSE_MERCHANT_ID;
    this.merchantKey = process.env.PSE_MERCHANT_KEY;

    if (!this.merchantId || !this.merchantKey) {
      this.logger.error('PSE credentials not found in environment variables');
      throw new Error('PSE configuration missing');
    }
  }

  /**
   * Obtener lista de bancos PSE disponibles
   */
  async getBankList(): Promise<any[]> {
    try {
      // En un entorno real, esto sería una llamada a la API de PSE
      // Por ahora retornamos la lista estática
      return PSE_BANKS;
    } catch (error) {
      this.logger.error('Error getting PSE bank list:', error);
      return PSE_BANKS; // Fallback a lista estática
    }
  }

  /**
   * Crear una transacción PSE
   */
  async createTransaction(
    paymentData: CreatePaymentDto,
    pseData: PSEPaymentData,
    returnUrl: string,
  ): Promise<PaymentResponseDto> {
    try {
      this.logger.log(
        `Creating PSE transaction for amount: ${paymentData.amount} COP`,
      );

      // Generar un ID de transacción único
      const transactionId = this.generateTransactionId();
      const reference = `${this.merchantId}-${Date.now()}`;

      // Datos para la transacción PSE
      const transactionData = {
        merchantId: this.merchantId,
        referenceCode: reference,
        description: paymentData.description || 'Pago App Armonía',
        amount: paymentData.amount,
        currency: 'COP',
        bankCode: pseData.bankCode,
        userType: pseData.userType,
        documentType: pseData.documentType,
        documentNumber: pseData.documentNumber,
        userEmail: pseData.userEmail,
        userName: pseData.userName || 'Usuario',
        returnUrl: returnUrl,
        extra1: paymentData.userId,
        extra2: JSON.stringify(paymentData.metadata || {}),
      };

      // Generar firma de seguridad
      const signature = this.generateSignature(transactionData);
      transactionData['signature'] = signature;

      // En un entorno real, aquí haríamos la llamada HTTP a la API de PSE
      // Por ahora simulamos la respuesta
      const response = await this.simulatePSEAPICall(transactionData);

      if (response.success) {
        return {
          id: transactionId,
          status: PaymentStatus.PROCESSING,
          gatewayReference: response.transactionId,
          redirectUrl: response.redirectUrl,
          data: {
            transactionId: response.transactionId,
            bankCode: pseData.bankCode,
            bankName: this.getBankName(pseData.bankCode),
            referenceCode: reference,
            trazabilityCode: response.trazabilityCode,
          },
        };
      } else {
        throw new BadRequestException(
          response.errorMessage || 'Error en la transacción PSE',
        );
      }
    } catch (error) {
      this.logger.error('Error creating PSE transaction:', error);
      throw new BadRequestException(
        `Error al crear transacción PSE: ${error.message}`,
      );
    }
  }

  /**
   * Consultar estado de una transacción PSE
   */
  async getTransactionStatus(transactionId: string): Promise<PaymentResponseDto> {
    try {
      this.logger.log(`Getting PSE transaction status: ${transactionId}`);

      // En un entorno real, esto sería una consulta a la API
      const response = await this.simulateStatusQuery(transactionId);

      return {
        id: transactionId,
        status: this.mapPSEStatusToPaymentStatus(response.state),
        gatewayReference: transactionId,
        data: {
          state: response.state,
          responseCode: response.responseCode,
          responseMessage: response.responseMessage,
          authorizationCode: response.authorizationCode,
          processingDate: response.processingDate,
          amount: response.amount,
          currency: response.currency,
        },
      };
    } catch (error) {
      this.logger.error('Error getting PSE transaction status:', error);
      throw new BadRequestException(
        `Error al consultar estado de transacción: ${error.message}`,
      );
    }
  }

  /**
   * Procesar respuesta de confirmación PSE
   */
  async processConfirmation(confirmationData: any): Promise<any> {
    try {
      this.logger.log(
        `Processing PSE confirmation for transaction: ${confirmationData.transactionId}`,
      );

      // Verificar firma de la confirmación
      const isValidSignature = this.verifyConfirmationSignature(
        confirmationData,
      );

      if (!isValidSignature) {
        throw new BadRequestException('Firma de confirmación inválida');
      }

      return {
        type: 'PSE_CONFIRMATION',
        transactionId: confirmationData.transactionId,
        referenceCode: confirmationData.referenceCode,
        state: confirmationData.state,
        responseCode: confirmationData.responseCode,
        responseMessage: confirmationData.responseMessage,
        authorizationCode: confirmationData.authorizationCode,
        amount: confirmationData.amount,
        currency: confirmationData.currency,
        processingDate: confirmationData.processingDate,
        validated: true,
      };
    } catch (error) {
      this.logger.error('Error processing PSE confirmation:', error);
      throw new BadRequestException(
        `Error al procesar confirmación PSE: ${error.message}`,
      );
    }
  }

  /**
   * PSE no soporta reembolsos directos
   * Los reembolsos deben manejarse fuera del sistema PSE
   */
  async createRefund(
    transactionId: string,
    refundData: CreateRefundDto,
  ): Promise<any> {
    this.logger.warn(
      'PSE does not support direct refunds. Manual process required.',
    );

    return {
      id: `refund_${Date.now()}`,
      status: PaymentStatus.PENDING,
      message:
        'PSE no soporta reembolsos automáticos. Se requiere proceso manual.',
      originalTransactionId: transactionId,
      amount: refundData.amount,
      reason: refundData.reason,
      notes: refundData.notes,
      requiresManualProcessing: true,
    };
  }

  /**
   * Verificar webhook/notificación PSE
   */
  verifyNotification(notificationData: any): boolean {
    try {
      return this.verifyConfirmationSignature(notificationData);
    } catch (error) {
      this.logger.error('Error verifying PSE notification:', error);
      return false;
    }
  }

  /**
   * Generar ID de transacción único
   */
  private generateTransactionId(): string {
    return `pse_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  }

  /**
   * Generar firma de seguridad para PSE
   */
  private generateSignature(data: any): string {
    const signatureString = `${this.merchantKey}~${data.merchantId}~${data.referenceCode}~${data.amount}~COP`;
    return crypto.createHash('md5').update(signatureString).digest('hex');
  }

  /**
   * Verificar firma de confirmación
   */
  private verifyConfirmationSignature(data: any): boolean {
    const expectedSignature = this.generateSignature({
      merchantId: data.merchantId,
      referenceCode: data.referenceCode,
      amount: data.amount,
    });

    return data.signature === expectedSignature;
  }

  /**
   * Obtener nombre del banco por código
   */
  private getBankName(bankCode: string): string {
    const bank = PSE_BANKS.find((b) => b.code === bankCode);
    return bank ? bank.name : 'BANCO DESCONOCIDO';
  }

  /**
   * Mapear estado PSE a nuestro enum
   */
  private mapPSEStatusToPaymentStatus(state: string): PaymentStatus {
    const statusMap = {
      PENDING: PaymentStatus.PROCESSING,
      APPROVED: PaymentStatus.COMPLETED,
      DECLINED: PaymentStatus.FAILED,
      ERROR: PaymentStatus.FAILED,
      EXPIRED: PaymentStatus.CANCELLED,
    };

    return statusMap[state] || PaymentStatus.FAILED;
  }

  /**
   * Simular llamada a la API de PSE (para desarrollo)
   */
  private async simulatePSEAPICall(data: any): Promise<any> {
    // Simulación de respuesta de API PSE
    await new Promise((resolve) => setTimeout(resolve, 1000)); // Simular latencia

    const transactionId = this.generateTransactionId();
    const trazabilityCode = `${Date.now()}`;

    return {
      success: true,
      transactionId,
      trazabilityCode,
      redirectUrl: `${this.apiUrl}/pse/redirect?transactionId=${transactionId}&trazabilityCode=${trazabilityCode}`,
    };
  }

  /**
   * Simular consulta de estado (para desarrollo)
   */
  private async simulateStatusQuery(transactionId: string): Promise<any> {
    await new Promise((resolve) => setTimeout(resolve, 500));

    // Para desarrollo, simular diferentes estados aleatoriamente
    const states = ['PENDING', 'APPROVED', 'DECLINED'];
    const randomState = states[Math.floor(Math.random() * states.length)];

    return {
      state: randomState,
      responseCode: randomState === 'APPROVED' ? '1' : '2',
      responseMessage:
        randomState === 'APPROVED' ? 'APROBADA' : 'RECHAZADA',
      authorizationCode:
        randomState === 'APPROVED' ? `AUTH${Date.now()}` : null,
      processingDate: new Date().toISOString(),
      amount: 100000,
      currency: 'COP',
    };
  }

  /**
   * Generar URL de confirmación
   */
  generateConfirmationUrl(baseUrl: string, transactionId: string): string {
    return `${baseUrl}/api/payment-gateways/pse/confirmation?transactionId=${transactionId}`;
  }

  /**
   * Validar datos requeridos para PSE
   */
  validatePSEData(pseData: PSEPaymentData): string[] {
    const errors: string[] = [];

    if (!pseData.bankCode) {
      errors.push('Código de banco es requerido');
    } else if (!PSE_BANKS.find((b) => b.code === pseData.bankCode)) {
      errors.push('Código de banco inválido');
    }

    if (!pseData.userType || !['NATURAL', 'JURIDICA'].includes(pseData.userType)) {
      errors.push('Tipo de usuario inválido (NATURAL o JURIDICA)');
    }

    if (
      !pseData.documentType ||
      !['CC', 'CE', 'NIT', 'TI', 'PP', 'IDC'].includes(pseData.documentType)
    ) {
      errors.push('Tipo de documento inválido');
    }

    if (!pseData.documentNumber || pseData.documentNumber.length < 5) {
      errors.push('Número de documento inválido');
    }

    if (!pseData.userEmail || !this.isValidEmail(pseData.userEmail)) {
      errors.push('Email inválido');
    }

    return errors;
  }

  /**
   * Validar formato de email
   */
  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
