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

  @IsNumber()
  @IsOptional()
  reportedByUserId?: number;

  @IsNumber()
  complexId: number;
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
  @IsNumber()
  reportedByUserId?: number;
}

export class SecurityEventDto {
  id: number;
  type: SecurityEventType;
  description: string;
  location?: string;
  reportedByUserId?: number;
  complexId: number;
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

  @IsNumber()
  @IsOptional()
  userId?: number;
}
