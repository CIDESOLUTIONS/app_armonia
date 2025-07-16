import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum MicroCreditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export class CreateMicroCreditApplicationDto {
  @IsNumber()
  amount: number;

  @IsString()
  purpose: string;
}

export class UpdateMicroCreditApplicationDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsString()
  purpose?: string;

  @IsOptional()
  @IsEnum(MicroCreditStatus)
  status?: MicroCreditStatus;

  @IsOptional()
  @IsDateString()
  approvalDate?: string;
}

export class MicroCreditApplicationDto {
  @IsNumber()
  id: number;

  @IsNumber()
  amount: number;

  @IsString()
  purpose: string;

  @IsEnum(MicroCreditStatus)
  status: MicroCreditStatus;

  @IsDateString()
  applicationDate: string;

  @IsOptional()
  @IsDateString()
  approvalDate?: string;

  @IsNumber()
  userId: number;

  @IsString()
  userName: string; // Assuming we can get the name from the user service

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class MicroCreditFilterParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(MicroCreditStatus)
  status?: MicroCreditStatus;

  @IsOptional()
  @IsNumber()
  userId?: number;

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
