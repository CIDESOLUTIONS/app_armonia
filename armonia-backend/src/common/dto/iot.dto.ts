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
  meterId: string;

  @IsString()
  unitId: string; // e.g., Apartment 101

  @IsNumber()
  reading: number;

  @IsEnum(SmartMeterUnit)
  unit: SmartMeterUnit;

  @IsDateString()
  timestamp: string;
}

export class SmartMeterFilterParamsDto {
  @IsOptional()
  @IsString()
  meterId?: string;

  @IsOptional()
  @IsString()
  unitId?: string;

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
