import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum VisitorDocumentType {
  CC = 'cc',
  CE = 'ce',
  PASSPORT = 'passport',
  OTHER = 'other',
}

export enum VisitorStatus {
  ACTIVE = 'active',
  DEPARTED = 'departed',
}

export enum PreRegistrationStatus {
  ACTIVE = 'active',
  USED = 'used',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export class CreateVisitorDto {
  @IsString()
  name: string;

  @IsEnum(VisitorDocumentType)
  documentType: VisitorDocumentType;

  @IsString()
  documentNumber: string;

  @IsString()
  propertyId: string; // Added propertyId as per schema.prisma

  @IsString()
  residentialComplexId: string; // Added residentialComplexId

  @IsString()
  @IsOptional()
  destination?: string;

  @IsOptional()
  @IsString()
  residentName?: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsString()
  purpose?: string; // Added purpose as per schema.prisma

  @IsOptional()
  @IsString()
  registeredBy?: string; // Added registeredBy as per schema.prisma
}

export class UpdateVisitorDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(VisitorDocumentType)
  documentType?: VisitorDocumentType;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  propertyId?: string; // Added propertyId as per schema.prisma

  @IsOptional()
  @IsString()
  residentialComplexId?: string; // Added residentialComplexId

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  residentName?: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus;

  @IsOptional()
  @IsDateString()
  exitTime?: Date; // Changed to Date

  @IsOptional()
  @IsString()
  purpose?: string; // Added purpose as per schema.prisma

  @IsOptional()
  @IsString()
  registeredBy?: string; // Added registeredBy as per schema.prisma
}

export class VisitorDto {
  id: string; // Changed to string
  name: string;
  documentType: VisitorDocumentType;
  documentNumber: string;
  propertyId: string; // Added propertyId as per schema.prisma
  residentialComplexId: string; // Added residentialComplexId
  destination?: string;
  residentName?: string;
  plate?: string;
  photoUrl?: string;
  entryTime: Date; // Changed to Date
  exitTime?: Date; // Changed to Date
  status: VisitorStatus;
  createdAt: Date; // Changed to Date
  updatedAt: Date; // Changed to Date
  purpose?: string; // Added purpose as per schema.prisma
  registeredBy?: string; // Added registeredBy as per schema.prisma
}

export class VisitorFilterParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(VisitorStatus)
  status?: VisitorStatus;

  @IsOptional()
  @IsEnum(VisitorDocumentType)
  documentType?: VisitorDocumentType;

  @IsOptional()
  @IsString()
  documentNumber?: string;

  @IsOptional()
  @IsString()
  destination?: string;

  @IsOptional()
  @IsString()
  residentName?: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class ScanQrCodeDto {
  @IsString()
  qrCode: string;
}