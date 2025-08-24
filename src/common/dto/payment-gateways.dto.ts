import {
  IsString,
  IsBoolean,
  IsArray,
  IsEnum,
  IsOptional,
  IsNumber,
  Min,
  Max,
} from 'class-validator';

// Note: ApiProperty is a backend decorator, removed for frontend compatibility

export enum PaymentGatewayType {
  STRIPE = 'STRIPE',
  PAYPAL = 'PAYPAL',
  PSE = 'PSE',
  PAYU = 'PAYU',
  WOMPI = 'WOMPI',
  MERCADO_PAGO = 'MERCADO_PAGO',
}

export class PaymentGatewayConfigDto {
  id: string;
  type: PaymentGatewayType;
  name: string;
  apiKey: string;
  secretKey: string;
  webhookSecret?: string;
  merchantId?: string;
  environment: string;
  supportedCurrencies: string[];
  supportedMethods: string[];
  isActive: boolean;
  testMode: boolean;
  webhookUrl?: string;
  maxAmount?: number;
  minAmount?: number;
  commissionRate?: number;
  fixedCommission?: number;
  createdAt: Date;
  updatedAt: Date;
}

export class CreatePaymentGatewayDto {
  @IsEnum(PaymentGatewayType)
  type: PaymentGatewayType;

  @IsString()
  name: string;

  @IsString()
  apiKey: string;

  @IsString()
  secretKey: string;

  @IsOptional()
  @IsString()
  webhookSecret?: string;

  @IsOptional()
  @IsString()
  merchantId?: string;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  testMode?: boolean;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedCurrencies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedMethods?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedCommission?: number;
}

export class UpdatePaymentGatewayDto {
  @IsOptional()
  @IsEnum(PaymentGatewayType)
  type?: PaymentGatewayType;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  apiKey?: string;

  @IsOptional()
  @IsString()
  secretKey?: string;

  @IsOptional()
  @IsString()
  webhookSecret?: string;

  @IsOptional()
  @IsString()
  merchantId?: string;

  @IsOptional()
  @IsString()
  environment?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsBoolean()
  testMode?: boolean;

  @IsOptional()
  @IsString()
  webhookUrl?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedCurrencies?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedMethods?: string[];

  @IsOptional()
  @IsNumber()
  @Min(0)
  maxAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  minAmount?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(100)
  commissionRate?: number;

  @IsOptional()
  @IsNumber()
  @Min(0)
  fixedCommission?: number;
}
