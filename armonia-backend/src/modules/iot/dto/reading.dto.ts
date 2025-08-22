import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsObject, IsDateString } from 'class-validator';
import { Transform } from 'class-transformer';
import { UtilityType } from './create-device.dto';

export enum ReadingSource {
  DEVICE = 'device',
  API = 'api',
  MANUAL = 'manual'
}

export class CreateReadingDto {
  @IsString()
  deviceId: string;

  @IsEnum(UtilityType)
  utilityType: UtilityType;

  @IsNumber()
  reading: number;

  @IsNumber()
  @IsOptional()
  previousReading?: number;

  @IsNumber()
  @IsOptional()
  consumption?: number;

  @IsString()
  unit: string; // kWh, m3, liters, etc.

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsDateString()
  @IsOptional()
  readingDate?: string;

  @IsEnum(ReadingSource)
  @IsOptional()
  source?: ReadingSource = ReadingSource.DEVICE;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  isAutomatic?: boolean = true;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;

  @IsString()
  @IsOptional()
  propertyId?: string;
}

export class SmartMeterReadingDto {
  @IsString()
  deviceId: string;

  @IsNumber()
  value: number;

  @IsString()
  unit: string;

  @IsDateString()
  timestamp: string;

  @IsNumber()
  @IsOptional()
  quality?: number; // 0-100 quality score

  @IsObject()
  @IsOptional()
  rawData?: Record<string, any>;

  @IsEnum(ReadingSource)
  @IsOptional()
  source?: ReadingSource = ReadingSource.DEVICE;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  processed?: boolean = false;
}

export class BulkReadingDto {
  @IsString()
  deviceId: string;

  readings: {
    value: number;
    unit: string;
    timestamp: string;
    quality?: number;
    rawData?: Record<string, any>;
  }[];

  @IsEnum(ReadingSource)
  @IsOptional()
  source?: ReadingSource = ReadingSource.DEVICE;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  processed?: boolean = false;
}

export class ReadingQueryDto {
  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsEnum(UtilityType)
  @IsOptional()
  utilityType?: UtilityType;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 50;

  @IsString()
  @IsOptional()
  sortBy?: string = 'timestamp';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  includeAnalytics?: boolean = false;
}
