import { IsString, IsBoolean, IsArray, IsEnum, IsOptional, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum PaymentGatewayType {
  STRIPE = 'STRIPE',
  PAYU = 'PAYU',
  WOMPI = 'WOMPI',
  MERCADO_PAGO = 'MERCADO_PAGO',
  PAYPAL = 'PAYPAL',
}

export class PaymentGatewayConfigDto {
  @ApiProperty({ description: 'Unique identifier of the payment gateway configuration' })
  @IsNumber()
  id: number;

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

  @ApiProperty({ description: 'Indicates if the payment gateway is active' })
  @IsBoolean()
  isActive: boolean;

  @ApiProperty({ type: [String], description: 'List of supported currencies (e.g., USD, COP)' })
  @IsArray()
  @IsString({ each: true })
  supportedCurrencies: string[];

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

  @ApiProperty({ description: 'Indicates if the payment gateway is active', required: false, default: true })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [String], description: 'List of supported currencies (e.g., USD, COP)', required: false, default: [] })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedCurrencies?: string[];
}

export class UpdatePaymentGatewayDto {
  @ApiProperty({ enum: PaymentGatewayType, description: 'Type of the payment gateway', required: false })
  @IsOptional()
  @IsEnum(PaymentGatewayType)
  type?: PaymentGatewayType;

  @ApiProperty({ description: 'Name of the payment gateway configuration', required: false })
  @IsOptional()
  @IsString()
  name?: string;

  @ApiProperty({ description: 'API Key for the payment gateway', required: false })
  @IsOptional()
  @IsString()
  apiKey?: string;

  @ApiProperty({ description: 'Secret Key for the payment gateway', required: false })
  @IsOptional()
  @IsString()
  secretKey?: string;

  @ApiProperty({ description: 'Indicates if the payment gateway is active', required: false })
  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @ApiProperty({ type: [String], description: 'List of supported currencies (e.g., USD, COP)', required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  supportedCurrencies?: string[];
}
