import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PackageStatus {
  PENDING = 'PENDING',
  REGISTERED = 'REGISTERED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export class RegisterPackageDto {
  @IsString()
  trackingNumber: string;

  @IsString()
  recipientUnit: string;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  deliveryPersonName?: string;
}

export class UpdatePackageDto {
  @IsOptional()
  @IsString()
  trackingNumber?: string;

  @IsOptional()
  @IsString()
  recipientUnit?: string;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  deliveryPersonName?: string;

  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;
}

export class PackageDto {
  @IsNumber()
  id: number;

  @IsString()
  trackingNumber: string;

  @IsString()
  recipientUnit: string;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  deliveryPersonName?: string;

  @IsEnum(PackageStatus)
  status: PackageStatus;

  @IsDateString()
  registrationDate: string;

  @IsOptional()
  @IsDateString()
  deliveryDate?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class PackageFilterParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @IsOptional()
  @IsString()
  recipientUnit?: string;

  @IsOptional()
  @IsString()
  sender?: string;

  @IsOptional()
  @IsNumber()
  residentId?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
