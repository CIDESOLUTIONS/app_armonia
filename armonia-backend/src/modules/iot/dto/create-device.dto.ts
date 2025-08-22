import { IsString, IsOptional, IsBoolean, IsEnum, IsNumber, IsObject, ValidateNested } from 'class-validator';
import { Type, Transform } from 'class-transformer';

export enum DeviceType {
  SMART_METER = 'SMART_METER',
  WATER_SENSOR = 'WATER_SENSOR',
  ELECTRICAL_METER = 'ELECTRICAL_METER',
  GAS_METER = 'GAS_METER',
  TEMPERATURE_SENSOR = 'TEMPERATURE_SENSOR',
  HUMIDITY_SENSOR = 'HUMIDITY_SENSOR',
  MOTION_SENSOR = 'MOTION_SENSOR',
  SMOKE_DETECTOR = 'SMOKE_DETECTOR',
  AIR_QUALITY_SENSOR = 'AIR_QUALITY_SENSOR'
}

export enum DeviceStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  MAINTENANCE = 'MAINTENANCE',
  OFFLINE = 'OFFLINE',
  ERROR = 'ERROR'
}

export enum UtilityType {
  ELECTRICITY = 'electricity',
  WATER = 'water',
  GAS = 'gas',
  HEATING = 'heating',
  COOLING = 'cooling'
}

export class CreateDeviceDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DeviceType)
  type: DeviceType;

  @IsString()
  serialNumber: string;

  @IsString()
  manufacturer: string;

  @IsString()
  @IsOptional()
  model?: string;

  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsString()
  @IsOptional()
  unitId?: string;

  @IsEnum(UtilityType)
  @IsOptional()
  utilityType?: UtilityType;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  isSmartMeter?: boolean = false;

  @IsObject()
  @IsOptional()
  capabilities?: Record<string, any>;

  @IsObject()
  @IsOptional()
  configuration?: Record<string, any>;

  @IsNumber()
  @IsOptional()
  readingInterval?: number; // en minutos

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  alertsEnabled?: boolean = true;

  @IsObject()
  @IsOptional()
  thresholds?: Record<string, number>;
}

export class UpdateDeviceDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DeviceStatus)
  @IsOptional()
  status?: DeviceStatus;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsString()
  @IsOptional()
  unitId?: string;

  @IsObject()
  @IsOptional()
  capabilities?: Record<string, any>;

  @IsObject()
  @IsOptional()
  configuration?: Record<string, any>;

  @IsNumber()
  @IsOptional()
  readingInterval?: number;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  alertsEnabled?: boolean;

  @IsObject()
  @IsOptional()
  thresholds?: Record<string, number>;

  @IsString()
  @IsOptional()
  firmwareVersion?: string;

  @IsString()
  @IsOptional()
  lastMaintenanceDate?: string;

  @IsString()
  @IsOptional()
  nextMaintenanceDate?: string;

  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}

export class DeviceConfigDto {
  @IsString()
  deviceId: string;

  @IsString()
  configType: string; // threshold, schedule, alert_settings, etc.

  @IsString()
  configKey: string;

  @IsObject()
  configValue: any;

  @IsString()
  @IsOptional()
  description?: string;

  @IsBoolean()
  @IsOptional()
  @Transform(({ value }) => Boolean(value))
  isActive?: boolean = true;
}
