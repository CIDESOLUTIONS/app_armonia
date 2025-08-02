import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsArray,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class CreateReservationDto {
  @IsString()
  amenityId: string;

  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startTime: string;

  @IsDateString()
  endTime: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  attendees?: string[];

  @IsBoolean()
  @IsOptional()
  requiresPayment?: boolean;

  @IsNumber()
  @IsOptional()
  paymentAmount?: number;
}

export class UpdateReservationDto extends PartialType(CreateReservationDto) {
  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsString()
  @IsOptional()
  cancellationReason?: string;
}

export class ReservationDto {
  id: string;
  amenityId: string;
  userId: string;
  startTime: Date;
  endTime: Date;
  status: ReservationStatus;
  createdAt: Date;
  updatedAt: Date;
  title?: string;
  description?: string;
  attendees?: string[];
  requiresPayment?: boolean;
  paymentAmount?: number;
}

export class ReservationFilterParamsDto {
  @IsOptional()
  @IsString()
  amenityId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsEnum(ReservationStatus)
  status?: ReservationStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;
}
