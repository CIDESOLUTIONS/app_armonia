import { IsString, IsOptional, IsNumber, IsBoolean, IsDateString, IsEnum } from 'class-validator';
import { SecurityEventType } from '@prisma/client';

export class CreateSecurityLogDto {
  @IsNumber()
  complexId: number;

  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsEnum(SecurityEventType)
  eventType: SecurityEventType;

  @IsString()
  description: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsOptional()
  details?: Record<string, any>;
}

export class CreateAccessAttemptDto {
  @IsOptional()
  @IsNumber()
  userId?: number;

  @IsString()
  ipAddress: string;

  @IsOptional()
  @IsString()
  userAgent?: string;

  @IsBoolean()
  success: boolean;

  @IsOptional()
  @IsString()
  reason?: string;
}