import {
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
  IsOptional,
  IsNumber,
  IsDateString,
  ValidateNested,
  IsObject,
  Min,
  Max,
  IsDecimal,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  Prisma,
  PaymentMethodType,
  RefundReason,
} from '@prisma/client';

export export enum PaymentStatus {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
  CANCELLED = 'CANCELLED',
  REFUNDED = 'REFUNDED',
  PROCESSING = 'PROCESSING',
}

export export enum TransactionType {
  PAYMENT = 'PAYMENT',
  REFUND = 'REFUND',
  CHARGEBACK = 'CHARGEBACK',
  ADJUSTMENT = 'ADJUSTMENT',
}

// This enum can remain local as it's specific to the gateway logic
// and not part of the core Prisma schema model for transactions.
export enum PaymentGatewayType {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  PSE = 'PSE',
  PAYU = 'PAYU',
  WOMPI = 'WOMPI',
  MERCADO_PAGO = 'MERCADO_PAGO',
}

export class PaymentGatewayConfigDto {
  @ApiProperty({ description: 'Unique identifier of the payment gateway configuration' })
  @IsString()
  id: string;

  @ApiProperty({ enum: PaymentGatewayType, description: 'Type of the payment gateway' })
  @IsEnum(PaymentGatewayType)
  type: PaymentGatewayType;

  @ApiProperty({ description: 'Name of the payment gateway configuration' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'API Key for the payment gateway (masked for security)' })
  @IsString()
  apiKey: string;

  @ApiProperty({ description: 'Secret Key for the payment gateway (masked for security)' })
  @IsString()
  secretKey: string;

  @ApiProperty({ description: 'Webhook secret for verification', required: false })
  @IsOptional()
  @IsString()
  webhookSecret?: string;

  @ApiProperty({ description: 'Merchant ID for PSE and other providers', required: false })
  @IsOptional()
  @IsString()
  merchantId?: string;

  @ApiProperty({ description: 'Environment (test or production)', default: 'test' })
  @IsString()
  environment: string;

  @ApiProperty({ type: [String], description: 'List of supported currencies (e.g., USD, COP)' })
  @IsArray()
  @IsString({ each: true })
  supportedCurrencies: string[];

  @ApiProperty({ type: [String], description: 'List of supported payment methods' })
  @IsArray()
  @IsString({ each: true })
  supportedMethods: string[];

  @ApiProperty({ description: 'Indicates if the payment gateway is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ description: 'Indicates if the gateway is in test mode', default: true })
  @IsBoolean()
  testMode: boolean;

  @ApiProperty({ description: 'Webhook URL for this gateway', required: false })
  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @ApiProperty({ description: 'Maximum transaction amount', required: false })
  @IsOptional()
  @IsDecimal()
  maxAmount?: Prisma.Decimal;

  @ApiProperty({ description: 'Minimum transaction amount', required: false })
  @IsOptional()
  @IsDecimal()
  minAmount?: Prisma.Decimal;

  @ApiProperty({ description: 'Commission rate percentage', required: false })
  @IsOptional()
  @IsDecimal()
  commissionRate?: Prisma.Decimal;

  @ApiProperty({ description: 'Fixed commission amount', required: false })
  @IsOptional()
  @IsDecimal()
  fixedCommission?: Prisma.Decimal;

  @ApiProperty({ description: 'Date of creation', type: String, format: 'date-time' })
  createdAt: Date;

  @ApiProperty({ description: 'Date of last update', type: String, format: 'date-time' })
  updatedAt: Date;
}

export class CreatePaymentGatewayDto {
  @ApiProperty({ enum: PaymentGatewayType, description: 'Type of the payment gateway' })
  @IsEnum(PaymentGatewayType)
  type: PaymentGatewayType;

  @ApiProperty({ description: 'Name of the payment gateway configuration' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'API Key for the payment gateway' })
  @IsString()
  apiKey: string;

  @ApiProperty({ description: 'Secret Key for the payment gateway' })
  @IsString()
  secretKey: string;

  @ApiProperty({ description: 'Webhook secret for verification', required: false })
  @IsOptional()
  @IsString()
  webhookSecret?: string;

  @ApiProperty({ description: 'Merchant ID for PSE and other providers', required: false })
  @IsOptional()
  @IsString()
  merchantId?: string;

  @ApiProperty({ description: 'Environment (test or production)', default: 'test' })
  @IsOptional()
  @IsString()
  environment?: string;

  @ApiProperty({ description: 'Indicates if the payment gateway is active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ description: 'Indicates if the gateway is in test mode', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  testMode?: boolean;

  @ApiProperty({ description: 'Webhook URL for this gateway', required: false })
  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @ApiProperty({ type: [String], description: 'List of supported currencies (e.g., USD, COP)', required: false, default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedCurrencies?: string[];

  @ApiProperty({ type: [String], description: 'List of supported payment methods', required: false, default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedMethods?: string[];

  @ApiProperty({ description: 'Maximum transaction amount', required: false })
  @IsOptional()
  @IsDecimal()
  maxAmount?: Prisma.Decimal;

  @ApiProperty({ description: 'Minimum transaction amount', required: false })
  @IsOptional()
  @IsDecimal()
  minAmount?: Prisma.Decimal;

  @ApiProperty({ description: 'Commission rate percentage', required: false })
  @IsOptional()
  @IsDecimal()
  commissionRate?: Prisma.Decimal;

  @ApiProperty({ description: 'Fixed commission amount', required: false })
  @IsOptional()
  @IsDecimal()
  fixedCommission?: Prisma.Decimal;
}

// ========================================
// TRANSACTION DTOs
// ========================================

export class CreateTransactionDto {
  @ApiProperty({ description: 'Payment ID' })
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Payment Gateway ID' })
  @IsString()
  paymentGatewayId: string;

  @ApiProperty({ description: 'Transaction amount' })
  @IsDecimal()
  amount: Prisma.Decimal;

  @ApiProperty({ description: 'Currency code', default: 'COP' })
  @IsString()
  currency: string;

  @ApiProperty({ enum: TransactionType, description: 'Type of transaction' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ description: 'Transaction description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: any;

  @ApiProperty({ description: 'Client IP address', required: false })
  @IsOptional()
  @IsString()
  ipAddress?: string;

  @ApiProperty({ description: 'User agent', required: false })
  @IsOptional()
  @IsString()
  userAgent?: string;
}

export class TransactionDto {
  @ApiProperty({ description: 'Transaction ID' })
  id: string;

  @ApiProperty({ description: 'Payment ID' })
  paymentId: string;

  @ApiProperty({ description: 'Payment Gateway ID' })
  paymentGatewayId: string;

  @ApiProperty({ description: 'Transaction amount' })
  @IsDecimal()
  amount: Prisma.Decimal;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ enum: TransactionType, description: 'Type of transaction' })
  @IsEnum(TransactionType)
  type: TransactionType;

  @ApiProperty({ enum: PaymentStatus, description: 'Transaction status' })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ description: 'Gateway transaction ID', required: false })
  gatewayTransactionId?: string;

  @ApiProperty({ description: 'Gateway reference', required: false })
  gatewayReference?: string;

  @ApiProperty({ description: 'Processing fee', required: false })
  @IsDecimal()
  processingFee?: Prisma.Decimal;

  @ApiProperty({ description: 'Net amount after fees', required: false })
  @IsDecimal()
  netAmount?: Prisma.Decimal;

  @ApiProperty({ description: 'Transaction description', required: false })
  description?: string;

  @ApiProperty({ description: 'Webhook verified status' })
  webhookVerified: boolean;

  @ApiProperty({ description: 'Reconciliation status' })
  reconciled: boolean;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;

  @ApiProperty({ description: 'Completion date', required: false })
  completedAt?: Date;
}

// ========================================
// PAYMENT METHOD DTOs
// ========================================

export class CreatePaymentMethodDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ enum: PaymentMethodType, description: 'Payment method type' })
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @ApiProperty({ description: 'Payment provider' })
  @IsString()
  provider: string;

  @ApiProperty({ description: 'Gateway method ID', required: false })
  @IsOptional()
  @IsString()
  gatewayMethodId?: string;

  @ApiProperty({ description: 'Set as default method', required: false })
  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;

  @ApiProperty({ description: 'User-defined name', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  // Card details
  @ApiProperty({ description: 'Last 4 digits of card', required: false })
  @IsOptional()
  @IsString()
  last4?: string;

  @ApiProperty({ description: 'Card brand', required: false })
  @IsOptional()
  @IsString()
  brand?: string;

  @ApiProperty({ description: 'Card expiry month', required: false })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(12)
  expiryMonth?: number;

  @ApiProperty({ description: 'Card expiry year', required: false })
  @IsOptional()
  @IsNumber()
  expiryYear?: number;

  // Bank details
  @ApiProperty({ description: 'Bank name', required: false })
  @IsOptional()
  @IsString()
  bankName?: string;

  @ApiProperty({ description: 'Bank code', required: false })
  @IsOptional()
  @IsString()
  bankCode?: string;

  @ApiProperty({ description: 'Account type', required: false })
  @IsOptional()
  @IsString()
  accountType?: string;

  @ApiProperty({ description: 'PayPal email', required: false })
  @IsOptional()
  @IsString()
  paypalEmail?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class PaymentMethodDto {
  @ApiProperty({ description: 'Payment method ID' })
  id: string;

  @ApiProperty({ description: 'User ID' })
  userId: string;

  @ApiProperty({ enum: PaymentMethodType, description: 'Payment method type' })
  @IsEnum(PaymentMethodType)
  type: PaymentMethodType;

  @ApiProperty({ description: 'Payment provider' })
  provider: string;

  @ApiProperty({ description: 'Is default method' })
  isDefault: boolean;

  @ApiProperty({ description: 'Is active' })
  isActive: boolean;

  @ApiProperty({ description: 'User-defined name', required: false })
  name?: string;

  @ApiProperty({ description: 'Last 4 digits', required: false })
  last4?: string;

  @ApiProperty({ description: 'Card brand', required: false })
  brand?: string;

  @ApiProperty({ description: 'Expiry month', required: false })
  expiryMonth?: number;

  @ApiProperty({ description: 'Expiry year', required: false })
  expiryYear?: number;

  @ApiProperty({ description: 'Bank name', required: false })
  bankName?: string;

  @ApiProperty({ description: 'PayPal email', required: false })
  paypalEmail?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

// ========================================
// PAYMENT PROCESSING DTOs
// ========================================

export class CreatePaymentDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  userId: string;

  @ApiProperty({ description: 'Payment amount' })
  @IsDecimal()
  amount: Prisma.Decimal;

  @ApiProperty({ description: 'Currency code', default: 'COP' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ description: 'Payment method' })
  @IsString()
  method: string;

  @ApiProperty({ description: 'Payment method ID', required: false })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;

  @ApiProperty({ description: 'Payment description', required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: any;

  // Fee IDs if this payment is for specific fees
  @ApiProperty({ description: 'Fee IDs to pay', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  feeIds?: string[];
}

export class ProcessPaymentDto {
  @ApiProperty({ description: 'Payment ID' })
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Payment gateway ID' })
  @IsString()
  paymentGatewayId: string;

  @ApiProperty({ description: 'Additional parameters', required: false })
  @IsOptional()
  @IsObject()
  paymentParams?: any;

  @ApiProperty({ description: 'Return URL', required: false })
  @IsOptional()
  @IsString()
  returnUrl?: string;

  @ApiProperty({ description: 'Cancel URL', required: false })
  @IsOptional()
  @IsString()
  cancelUrl?: string;
}

export class PaymentResponseDto {
  @ApiProperty({ description: 'Payment ID' })
  id: string;

  @ApiProperty({ enum: PaymentStatus, description: 'Payment status' })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ description: 'Gateway reference', required: false })
  gatewayReference?: string;

  @ApiProperty({ description: 'Redirect URL for 3DS or external flow', required: false })
  redirectUrl?: string;

  @ApiProperty({ description: 'Additional response data', required: false })
  data?: any;

  @ApiProperty({ description: 'Error message if failed', required: false })
  errorMessage?: string;
}

// ========================================
// WEBHOOK DTOs
// ========================================

export class WebhookEventDto {
  @ApiProperty({ description: 'Event ID' })
  id: string;

  @ApiProperty({ description: 'Provider name' })
  provider: string;

  @ApiProperty({ description: 'Event type' })
  eventType: string;

  @ApiProperty({ description: 'Provider event ID' })
  eventId: string;

  @ApiProperty({ description: 'Related payment ID', required: false })
  paymentId?: string;

  @ApiProperty({ description: 'Processing status' })
  processed: boolean;

  @ApiProperty({ description: 'Verification status' })
  verified: boolean;

  @ApiProperty({ description: 'Retry count' })
  retryCount: number;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;
}

// ========================================
// REFUND DTOs
// ========================================

export class CreateRefundDto {
  @ApiProperty({ description: 'Payment ID' })
  @IsString()
  paymentId: string;

  @ApiProperty({ description: 'Refund amount' })
  @IsDecimal()
  amount: Prisma.Decimal;

  @ApiProperty({ description: 'Currency code', default: 'COP' })
  @IsOptional()
  @IsString()
  currency?: string;

  @ApiProperty({ enum: RefundReason, description: 'Refund reason' })
  @IsEnum(RefundReason)
  reason: RefundReason;

  @ApiProperty({ description: 'Additional notes', required: false })
  @IsOptional()
  @IsString()
  notes?: string;

  @ApiProperty({ description: 'Additional metadata', required: false })
  @IsOptional()
  @IsObject()
  metadata?: any;
}

export class RefundDto {
  @ApiProperty({ description: 'Refund ID' })
  id: string;

  @ApiProperty({ description: 'Payment ID' })
  paymentId: string;

  @ApiProperty({ description: 'Refund amount' })
  @IsDecimal()
  amount: Prisma.Decimal;

  @ApiProperty({ description: 'Currency code' })
  currency: string;

  @ApiProperty({ enum: RefundReason, description: 'Refund reason' })
  @IsEnum(RefundReason)
  reason: RefundReason;

  @ApiProperty({ enum: PaymentStatus, description: 'Refund status' })
  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @ApiProperty({ description: 'Gateway refund ID', required: false })
  gatewayRefundId?: string;

  @ApiProperty({ description: 'Processing user ID', required: false })
  processedBy?: string;

  @ApiProperty({ description: 'Additional notes', required: false })
  notes?: string;

  @ApiProperty({ description: 'Creation date' })
  createdAt: Date;

  @ApiProperty({ description: 'Last update date' })
  updatedAt: Date;
}

// ========================================
// FILTER AND PAGINATION DTOs
// ========================================

export class PaymentFilterDto {
  @ApiProperty({ description: 'User ID filter', required: false })
  @IsOptional()
  @IsString()
  userId?: string;

  @ApiProperty({ enum: PaymentStatus, description: 'Status filter', required: false })
  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @ApiProperty({ description: 'Payment method filter', required: false })
  @IsOptional()
  @IsString()
  method?: string;

  @ApiProperty({ description: 'Date from', required: false })
  @IsOptional()
  @IsDateString()
  dateFrom?: string;

  @ApiProperty({ description: 'Date to', required: false })
  @IsOptional()
  @IsDateString()
  dateTo?: string;

  @ApiProperty({ description: 'Minimum amount', required: false })
  @IsOptional()
  @IsDecimal()
  amountFrom?: Prisma.Decimal;

  @ApiProperty({ description: 'Maximum amount', required: false })
  @IsOptional()
  @IsDecimal()
  amountTo?: Prisma.Decimal;

  @ApiProperty({ description: 'Page number', required: false, default: 1 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  page?: number;

  @ApiProperty({ description: 'Items per page', required: false, default: 10 })
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(100)
  limit?: number;
}
