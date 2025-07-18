import { IsString, IsNumber, IsDateString, IsOptional, IsBoolean, IsEnum, IsArray } from 'class-validator';
import { Type } from 'class-transformer';

export enum ReservationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  CANCELLED = 'CANCELLED',
  COMPLETED = 'COMPLETED',
}

export enum CommonAreaType {
  SALON = 'SALON',
  BBQ = 'BBQ',
  COURT = 'COURT',
  POOL = 'POOL',
  GYM = 'GYM',
  OTHER = 'OTHER',
}

export class CreateCommonAreaDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CommonAreaType)
  type: CommonAreaType;

  @IsNumber()
  @IsOptional()
  capacity?: number;

  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  availableDays?: string[]; // e.g., ["MONDAY", "TUESDAY"]

  @IsString()
  @IsOptional()
  openingTime?: string; // e.g., "08:00"

  @IsString()
  @IsOptional()
  closingTime?: string; // e.g., "22:00"
}

export class UpdateCommonAreaDto extends Partial<CreateCommonAreaDto> {}

export class CommonAreaDto {
  id: number;
  name: string;
  description?: string;
  type: CommonAreaType;
  capacity?: number;
  requiresApproval?: boolean;
  hourlyRate?: number;
  availableDays?: string[];
  openingTime?: string;
  closingTime?: string;
  createdAt: Date;
  updatedAt: Date;
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

export class UpdateReservationDto extends Partial<CreateReservationDto> {
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
  commonArea: CommonAreaDto; // Populated relation
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
