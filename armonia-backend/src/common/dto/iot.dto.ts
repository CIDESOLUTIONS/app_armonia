import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsBoolean,
  ValidateNested,
  IsObject,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SmartMeterUnit {
  KWH = 'kWh',
  M3 = 'm3',
  LITERS = 'liters',
  GALLONS = 'gallons',
  OTHER = 'other',
}

export enum IoTDeviceType {
  SMART_METER = 'SMART_METER',
  CAMERA = 'CAMERA',
  SENSOR = 'SENSOR',
  ACCESS_CONTROL = 'ACCESS_CONTROL',
  THERMOSTAT = 'THERMOSTAT',
  SMOKE_DETECTOR = 'SMOKE_DETECTOR',
  WATER_LEAK_SENSOR = 'WATER_LEAK_SENSOR',
  MOTION_SENSOR = 'MOTION_SENSOR',
  OTHER = 'OTHER',
}

export enum IoTDeviceStatus {
  ONLINE = 'ONLINE',
  OFFLINE = 'OFFLINE',
  MAINTENANCE = 'MAINTENANCE',
  ERROR = 'ERROR',
  UNKNOWN = 'UNKNOWN',
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL',
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export enum AlertType {
  CONSUMPTION_SPIKE = 'CONSUMPTION_SPIKE',
  DEVICE_OFFLINE = 'DEVICE_OFFLINE',
  THRESHOLD_EXCEEDED = 'THRESHOLD_EXCEEDED',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE',
  SECURITY_BREACH = 'SECURITY_BREACH',
  SYSTEM_ERROR = 'SYSTEM_ERROR',
  OTHER = 'OTHER',
}

export class IoTDeviceDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsEnum(IoTDeviceType)
  type: IoTDeviceType;

  @IsEnum(IoTDeviceStatus)
  status: IoTDeviceStatus;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsDateString()
  @IsOptional()
  lastSeen?: string;

  @IsDateString()
  @IsOptional()
  installedAt?: string;

  @IsDateString()
  @IsOptional()
  nextMaintenanceAt?: string;

  @IsString()
  residentialComplexId: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class SmartMeterReadingDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  deviceId: string;

  @IsString()
  meterId: string;

  @IsString()
  propertyId: string;

  @IsNumber()
  reading: number;

  @IsNumber()
  @IsOptional()
  previousReading?: number;

  @IsEnum(SmartMeterUnit)
  unit: SmartMeterUnit;

  @IsDateString()
  timestamp: string;

  @IsString()
  residentialComplexId: string;

  @IsObject()
  @IsOptional()
  additionalData?: any;

  @IsBoolean()
  @IsOptional()
  isAutomatic?: boolean = true;

  @IsString()
  @IsOptional()
  source?: string;

  @IsNumber()
  @IsOptional()
  consumption?: number; // Calculated consumption

  @IsNumber()
  @IsOptional()
  cost?: number; // Calculated cost
}

export class TelemetryDataDto {
  @IsString()
  deviceId: string;

  @IsString()
  @IsOptional()
  dataType?: string;

  @IsObject()
  payload: any;

  @IsDateString()
  timestamp: string;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  @IsOptional()
  source?: string;

  @IsBoolean()
  @IsOptional()
  processed?: boolean = false;
}

export class IoTAlertDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  deviceId: string;

  @IsString()
  @IsOptional()
  deviceName?: string;

  @IsEnum(AlertType)
  type: AlertType;

  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @IsEnum(AlertStatus)
  @IsOptional()
  status?: AlertStatus = AlertStatus.ACTIVE;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsObject()
  @IsOptional()
  data?: any;

  @IsString()
  @IsOptional()
  acknowledgedBy?: string;

  @IsDateString()
  @IsOptional()
  acknowledgedAt?: string;

  @IsString()
  @IsOptional()
  resolvedBy?: string;

  @IsDateString()
  @IsOptional()
  resolvedAt?: string;

  @IsString()
  @IsOptional()
  resolution?: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  @IsOptional()
  updatedAt?: string;

  @IsString()
  residentialComplexId: string;
}

export class CreateIoTDeviceDto {
  @IsString()
  name: string;

  @IsEnum(IoTDeviceType)
  type: IoTDeviceType;

  @IsString()
  location: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  serialNumber?: string;

  @IsString()
  @IsOptional()
  manufacturer?: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsDateString()
  @IsOptional()
  installedAt?: string;

  @IsDateString()
  @IsOptional()
  nextMaintenanceAt?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;
}

export class UpdateIoTDeviceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsEnum(IoTDeviceStatus)
  @IsOptional()
  status?: IoTDeviceStatus;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsDateString()
  @IsOptional()
  nextMaintenanceAt?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;
}

export class SmartMeterFilterParamsDto {
  @IsOptional()
  @IsString()
  meterId?: string;

  @IsOptional()
  @IsString()
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
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'timestamp';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class AutomatedBillingDto {
  @IsString()
  residentialComplexId: string;

  @IsDateString()
  billingPeriodStart: string;

  @IsDateString()
  billingPeriodEnd: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsArray()
  propertyIds?: string[];

  @IsOptional()
  @IsArray()
  meterTypes?: SmartMeterUnit[];

  @IsOptional()
  @IsBoolean()
  dryRun?: boolean = false;
}

export class DeviceFilterParamsDto {
  @IsOptional()
  @IsEnum(IoTDeviceType)
  type?: IoTDeviceType;

  @IsOptional()
  @IsEnum(IoTDeviceStatus)
  status?: IoTDeviceStatus;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}

export class AlertFilterParamsDto {
  @IsOptional()
  @IsEnum(AlertType)
  type?: AlertType;

  @IsOptional()
  @IsEnum(AlertSeverity)
  severity?: AlertSeverity;

  @IsOptional()
  @IsEnum(AlertStatus)
  status?: AlertStatus;

  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}

export class AcknowledgeAlertDto {
  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ResolveAlertDto {
  @IsString()
  userId: string;

  @IsString()
  resolution: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class IoTDashboardStatsDto {
  @IsNumber()
  totalDevices: number;

  @IsNumber()
  onlineDevices: number;

  @IsNumber()
  offlineDevices: number;

  @IsNumber()
  maintenanceDevices: number;

  @IsNumber()
  errorDevices: number;

  @IsNumber()
  activeAlerts: number;

  @IsNumber()
  criticalAlerts: number;

  @IsNumber()
  todayReadings: number;

  @IsNumber()
  totalConsumption: number;

  @IsObject()
  devicesByType: { [key in IoTDeviceType]: number };

  @IsArray()
  recentAlerts: IoTAlertDto[];

  @IsArray()
  topConsumers: any[];

  @IsObject()
  consumptionTrends: any;
}

// ========== UTILITY READING DTOs ==========

export enum UtilityType {
  ELECTRICITY = 'electricity',
  WATER = 'water',
  GAS = 'gas',
  OTHER = 'other',
}

export class UtilityReadingDto {
  @IsString()
  @IsOptional()
  id?: string;

  @IsString()
  deviceId: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

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
  unit: string;

  @IsNumber()
  @IsOptional()
  cost?: number;

  @IsDateString()
  readingDate: string;

  @IsBoolean()
  @IsOptional()
  isAutomatic?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  residentialComplexId: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class CreateUtilityReadingDto {
  @IsString()
  deviceId: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsEnum(UtilityType)
  utilityType: UtilityType;

  @IsNumber()
  reading: number;

  @IsString()
  unit: string;

  @IsDateString()
  @IsOptional()
  readingDate?: string;

  @IsBoolean()
  @IsOptional()
  isAutomatic?: boolean;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class UtilityReadingFilterDto {
  @IsOptional()
  @IsString()
  deviceId?: string;

  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsEnum(UtilityType)
  utilityType?: UtilityType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}

// ========== CONSUMPTION ANALYTICS DTOs ==========

export enum AnalyticsPeriod {
  DAILY = 'daily',
  WEEKLY = 'weekly',
  MONTHLY = 'monthly',
  YEARLY = 'yearly',
}

export enum ConsumptionTrend {
  INCREASING = 'increasing',
  DECREASING = 'decreasing',
  STABLE = 'stable',
}

export class ConsumptionAnalyticsDto {
  @IsString()
  @IsOptional()
  id?: string;

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
  anomalyDetected: boolean;

  @IsNumber()
  @IsOptional()
  anomalyScore?: number;

  @IsNumber()
  @IsOptional()
  predictedConsumption?: number;

  @IsObject()
  @IsOptional()
  costAnalysis?: any;

  @IsObject()
  @IsOptional()
  recommendations?: any;

  @IsObject()
  @IsOptional()
  comparisonData?: any;

  @IsString()
  residentialComplexId: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class AnalyticsFilterDto {
  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsEnum(UtilityType)
  utilityType?: UtilityType;

  @IsOptional()
  @IsEnum(AnalyticsPeriod)
  period?: AnalyticsPeriod;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  anomalyDetected?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
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
}