import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { PanicStatus, PanicType } from '@prisma/client';

export class CreatePanicAlertDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  complexId: number;

  @IsOptional()
  @IsNumber()
  propertyId?: number;

  @IsEnum(PanicType)
  type: PanicType;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class UpdatePanicAlertDto {
  @IsOptional()
  @IsEnum(PanicStatus)
  status?: PanicStatus;

  @IsOptional()
  @IsDateString()
  resolvedTime?: Date;

  @IsOptional()
  @IsNumber()
  resolvedById?: number;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePanicResponseDto {
  @IsNumber()
  alertId: number;

  @IsNumber()
  respondedBy: number;

  @IsString()
  actionTaken: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
