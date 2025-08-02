import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SmartMeterUnit {
  KWH = 'kWh',
  M3 = 'm3',
  LITERS = 'liters',
  OTHER = 'other',
}

export class SmartMeterReadingDto {
  @IsString()
  id: string; // Added id

  @IsString()
  deviceId: string; // Added deviceId

  @IsString()
  meterId: string;

  @IsString() // Changed to string
  propertyId: string; // Relacionar con Property

  @IsNumber()
  reading: number;

  @IsEnum(SmartMeterUnit)
  unit: SmartMeterUnit;

  @IsDateString()
  timestamp: string;

  @IsString()
  residentialComplexId: string; // Added residentialComplexId
}

export class SmartMeterFilterParamsDto {
  @IsOptional()
  @IsString()
  meterId?: string;

  @IsOptional()
  @IsString() // Changed to string
  propertyId?: string;

  @IsOptional()
  @IsEnum(SmartMeterUnit)
  unit?: SmartMeterUnit;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class AutomatedBillingDto {
  @IsString() // Changed to string
  residentialComplexId: string; // Renamed from complexId

  @IsOptional()
  @IsDateString()
  billingPeriodStart?: string;

  @IsOptional()
  @IsDateString()
  billingPeriodEnd?: string;

  @IsOptional()
  @IsString()
  notes?: string;
}