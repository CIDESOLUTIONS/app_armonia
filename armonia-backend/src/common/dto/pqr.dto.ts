import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PQRStatus {
  OPEN = 'OPEN',
  IN_PROGRESS = 'IN_PROGRESS',
  CLOSED = 'CLOSED',
  REJECTED = 'REJECTED',
}

export enum PQRPriority {
  LOW = 'LOW',
  MEDIUM = 'MEDIUM',
  HIGH = 'HIGH',
}

export class PQRDto {
  id: string;
  title: string;
  description: string;
  type: string;
  status: PQRStatus;
  reportedById: string;
  residentialComplexId: string;
  createdAt: string;
  updatedAt: string;
}

export class GetPQRParamsDto {
  @IsOptional()
  @IsEnum(PQRStatus)
  status?: PQRStatus;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class CreatePQRDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  type: string;

  @IsString()
  residentialComplexId: string;

  @IsString()
  reportedById: string;

  @IsOptional()
  @IsEnum(PQRStatus)
  status?: PQRStatus;
}

export class UpdatePQRDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsEnum(PQRStatus)
  status?: PQRStatus;

  @IsOptional()
  @IsString()
  residentialComplexId?: string;

  @IsOptional()
  @IsString()
  reportedById?: string;
}
