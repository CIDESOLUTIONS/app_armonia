import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export class CreateReservationDto {
  @IsNumber()
  commonAreaId: number;

  @IsNumber()
  userId: number;

  @IsString()
  title: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsDateString()
  startDateTime: string;

  @IsDateString()
  endDateTime: string;

  @IsNumber()
  @IsOptional()
  attendees?: number;

  @IsBoolean()
  @IsOptional()
  requiresPayment?: boolean;

  @IsNumber()
  @IsOptional()
  paymentAmount?: number;
}

export class UpdateReservationDto extends Partial(CreateReservationDto) {
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
  id: number;
  commonAreaId: number;
  commonArea: any; // Will be CommonAreaDto from inventory module
  userId: number;
  user: any; // Populated relation (UserDto)
  title: string;
  description?: string;
  startDateTime: Date;
  endDateTime: Date;
  status: ReservationStatus;
  attendees?: number;
  requiresPayment?: boolean;
  paymentAmount?: number;
  paymentStatus?: string;
  rejectionReason?: string;
  approvedById?: number;
  approvedAt?: Date;
  cancellationReason?: string;
  cancelledAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class ReservationFilterParamsDto {
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  commonAreaId?: number;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  userId?: number;

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