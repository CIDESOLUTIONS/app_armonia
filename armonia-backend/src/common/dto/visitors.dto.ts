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

export class CreateVisitorDto {
  @IsString()
  name: string;

  @IsEnum(VisitorDocumentType)
  documentType: VisitorDocumentType;

  @IsString()
  documentNumber: string;

  @IsString()
  destination: string;

  @IsOptional()
  @IsString()
  residentName?: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;
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
  exitTime?: string;
}

export class VisitorDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEnum(VisitorDocumentType)
  documentType: VisitorDocumentType;

  @IsString()
  documentNumber: string;

  @IsString()
  destination: string;

  @IsOptional()
  @IsString()
  residentName?: string;

  @IsOptional()
  @IsString()
  plate?: string;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsDateString()
  entryTime: string;

  @IsOptional()
  @IsDateString()
  exitTime?: string;

  @IsEnum(VisitorStatus)
  status: VisitorStatus;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
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
