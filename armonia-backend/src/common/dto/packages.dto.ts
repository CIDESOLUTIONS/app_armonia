import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export enum PackageStatus {
  PENDING = 'PENDING',
  REGISTERED = 'REGISTERED',
  DELIVERED = 'DELIVERED',
  RETURNED = 'RETURNED',
}

export class RegisterPackageDto {
  @IsString()
  residentId: string;

  @IsOptional()
  @IsDateString()
  receivedAt?: string;

  @IsOptional()
  @IsDateString()
  deliveredAt?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsString()
  residentialComplexId: string;
}

export class UpdatePackageDto extends PartialType(RegisterPackageDto) {
  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;
}

export class PackageDto {
  id: string;
  residentId: string;
  receivedAt: Date;
  deliveredAt?: Date;
  notes?: string;
  residentialComplexId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PackageFilterParamsDto {
  @IsOptional()
  @IsString()
  residentId?: string;

  @IsOptional()
  @IsEnum(PackageStatus)
  status?: PackageStatus;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}