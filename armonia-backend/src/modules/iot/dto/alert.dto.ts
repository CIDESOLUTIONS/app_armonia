import { IsString, IsOptional, IsEnum, IsObject, IsDateString, IsBoolean } from 'class-validator';
import { Transform } from 'class-transformer';

export enum AlertType {
  CONSUMPTION_SPIKE = 'CONSUMPTION_SPIKE',
  CONSUMPTION_ANOMALY = 'CONSUMPTION_ANOMALY',
  DEVICE_OFFLINE = 'DEVICE_OFFLINE',
  DEVICE_ERROR = 'DEVICE_ERROR',
  THRESHOLD_EXCEEDED = 'THRESHOLD_EXCEEDED',
  LOW_BATTERY = 'LOW_BATTERY',
  MAINTENANCE_DUE = 'MAINTENANCE_DUE',
  READING_FAILURE = 'READING_FAILURE',
  COMMUNICATION_ERROR = 'COMMUNICATION_ERROR',
  LEAK_DETECTION = 'LEAK_DETECTION',
  HIGH_CONSUMPTION = 'HIGH_CONSUMPTION',
  UNUSUAL_PATTERN = 'UNUSUAL_PATTERN'
}

export enum AlertSeverity {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
  CRITICAL = 'CRITICAL'
}

export enum AlertStatus {
  ACTIVE = 'ACTIVE',
  ACKNOWLEDGED = 'ACKNOWLEDGED',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED'
}

export class CreateAlertDto {
  @IsString()
  deviceId: string;

  @IsEnum(AlertType)
  type: AlertType;

  @IsEnum(AlertSeverity)
  severity: AlertSeverity;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsObject()
  @IsOptional()
  data?: Record<string, any>; // Datos adicionales de la alerta

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  autoResolve?: boolean = false; // Si se resuelve automáticamente

  @IsString()
  @IsOptional()
  resolution?: string; // Pasos para resolver
}

export class UpdateAlertDto {
  @IsEnum(AlertStatus)
  @IsOptional()
  status?: AlertStatus;

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
  resolution?: string; // Notas de resolución

  @IsObject()
  @IsOptional()
  data?: Record<string, any>;
}

export class AlertQueryDto {
  @IsString()
  @IsOptional()
  deviceId?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsEnum(AlertType)
  @IsOptional()
  type?: AlertType;

  @IsEnum(AlertSeverity)
  @IsOptional()
  severity?: AlertSeverity;

  @IsEnum(AlertStatus)
  @IsOptional()
  status?: AlertStatus;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsString()
  @IsOptional()
  sortBy?: string = 'createdAt';

  @IsString()
  @IsOptional()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @IsString()
  @IsOptional()
  page?: string = '1';

  @IsString()
  @IsOptional()
  limit?: string = '50';
}

export class BulkAlertActionDto {
  @IsString({ each: true })
  alertIds: string[];

  @IsEnum(AlertStatus)
  action: AlertStatus; // ACKNOWLEDGE, RESOLVE, DISMISS

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  userId: string; // Usuario que realiza la acción
}

export class AlertStatsDto {
  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  includeResolved?: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  groupByDevice?: boolean = false;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  groupBySeverity?: boolean = true;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  groupByType?: boolean = true;
}
