import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { PanicStatus, PanicType } from '../enums/panic.enum';

export class CreatePanicAlertDto {
  @IsString()
  userId: string;

  @IsString()
  residentialComplexId: string; // Renamed from complexId and changed to string

  @IsOptional()
  @IsString()
  propertyId?: string; // Changed to string

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
  @IsString()
  resolvedById?: string; // Changed to string

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  description?: string;
}

export class CreatePanicResponseDto {
  @IsString()
  alertId: string; // Changed to string

  @IsString()
  respondedBy: string; // Changed to string

  @IsString()
  actionTaken: string;

  @IsOptional()
  @IsString()
  notes?: string;
}
