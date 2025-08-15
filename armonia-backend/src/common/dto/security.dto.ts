import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsBoolean,
} from 'class-validator';
import { SecurityEventType } from '../enums/security-event-type.enum';

export class CreateSecurityEventDto {
  @IsEnum(SecurityEventType)
  type: SecurityEventType;

  @IsString()
  description: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString() // Changed to string
  @IsOptional()
  reportedByUserId?: string;

  @IsString() // Changed to string
  residentialComplexId: string; // Renamed from complexId
}

export class UpdateSecurityEventDto {
  @IsOptional()
  @IsEnum(SecurityEventType)
  type?: SecurityEventType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString() // Changed to string
  reportedByUserId?: string;
}

export class SecurityEventDto {
  id: string; // Changed to string
  type: SecurityEventType;
  description: string;
  location?: string;
  reportedByUserId?: string; // Changed to string
  residentialComplexId: string; // Renamed from complexId
  createdAt: Date;
  updatedAt: Date;
}

export class SecurityEventFilterParamsDto {
  @IsOptional()
  @IsEnum(SecurityEventType)
  type?: SecurityEventType;

  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;
}

export class CreateAccessAttemptDto {
  @IsString()
  ipAddress: string;

  @IsString()
  username: string;

  @IsBoolean()
  isSuccess: boolean;

  @IsString()
  @IsOptional()
  reason?: string;

  @IsString() // Changed to string
  @IsOptional()
  userId?: string;

  @IsString()
  residentialComplexId: string; // Added
}
