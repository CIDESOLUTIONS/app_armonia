import { IsString, IsNumber, IsOptional, IsBoolean, IsEnum, IsObject, IsDateString, IsArray } from 'class-validator';
import { Transform } from 'class-transformer';
import { UtilityType } from './create-device.dto';

export enum AnalyticsPeriod {
  HOURLY = 'hourly',
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  QUARTERLY = 'quarterly',
  YEARLY = 'yearly'
}

export enum ConsumptionTrend {
  INCREASING = 'increasing',
  DECREASING = 'decreasing',
  STABLE = 'stable',
  VOLATILE = 'volatile'
}

export class CreateAnalyticsDto {
  @IsString()
  propertyId: string;

  @IsEnum(UtilityType)
  utilityType: UtilityType;

  @IsEnum(AnalyticsPeriod)
  period: AnalyticsPeriod;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;

  @IsNumber()
  totalConsumption: number;

  @IsNumber()
  averageConsumption: number;

  @IsNumber()
  peakConsumption: number;

  @IsNumber()
  minConsumption: number;

  @IsEnum(ConsumptionTrend)
  consumptionTrend: ConsumptionTrend;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  anomalyDetected?: boolean = false;

  @IsNumber()
  @IsOptional()
  anomalyScore?: number;

  @IsNumber()
  @IsOptional()
  predictedConsumption?: number;

  @IsObject()
  @IsOptional()
  costAnalysis?: Record<string, any>;

  @IsObject()
  @IsOptional()
  recommendations?: Record<string, any>;

  @IsObject()
  @IsOptional()
  comparisonData?: Record<string, any>;
}

export class AnalyticsQueryDto {
  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsEnum(UtilityType)
  @IsOptional()
  utilityType?: UtilityType;

  @IsEnum(AnalyticsPeriod)
  @IsOptional()
  period?: AnalyticsPeriod;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  includeAnomalies?: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  includePredictions?: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  includeRecommendations?: boolean = false;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  page?: number = 1;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  limit?: number = 20;
}

export class DashboardAnalyticsDto {
  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsArray()
  @IsOptional()
  @IsEnum(UtilityType, { each: true })
  utilityTypes?: UtilityType[];

  @IsEnum(AnalyticsPeriod)
  @IsOptional()
  period?: AnalyticsPeriod = AnalyticsPeriod.MONTHLY;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  months?: number = 6; // Últimos N meses

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  includeComparisons?: boolean = true;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  includeForecasts?: boolean = true;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  includeAnomalies?: boolean = true;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  includeCostAnalysis?: boolean = true;
}

export class ConsumptionComparisonDto {
  @IsString()
  propertyId: string;

  @IsEnum(UtilityType)
  utilityType: UtilityType;

  @IsEnum(AnalyticsPeriod)
  comparisonPeriod: AnalyticsPeriod;

  @IsDateString()
  currentPeriodStart: string;

  @IsDateString()
  currentPeriodEnd: string;

  @IsNumber()
  @IsOptional()
  @Transform(({ value }) => parseInt(value))
  periodsToCompare?: number = 3; // Comparar con los últimos N períodos
}
