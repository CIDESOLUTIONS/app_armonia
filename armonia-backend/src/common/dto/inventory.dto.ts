import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

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
  residentialComplexId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  @IsOptional()
  type?: string; // Changed to optional

  @IsString()
  @IsOptional()
  rules?: string;
}

export class UpdateCommonAreaDto extends PartialType(CreateCommonAreaDto) {}

export class CommonAreaDto {
  id: string;
  name: string;
  description?: string;
  type?: string; // Changed to optional
  rules?: string;
  residentialComplexId: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum ParkingSpotType {
  COVERED = 'COVERED',
  UNCOVERED = 'UNCOVERED',
  VISITOR = 'VISITOR',
  DISABLED = 'DISABLED',
}

export enum ParkingSpotStatus {
  AVAILABLE = 'AVAILABLE',
  OCCUPIED = 'OCCUPIED',
  RESERVED = 'RESERVED',
  MAINTENANCE = 'MAINTENANCE',
}

export class CreateParkingSpotDto {
  @IsString()
  number: string;

  @IsString()
  @IsOptional()
  type?: string; // Changed to optional

  @IsString()
  @IsOptional()
  status?: string; // Changed to optional

  @IsString()
  @IsOptional()
  propertyId?: string;

  @IsString()
  residentialComplexId: string;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateParkingSpotDto extends PartialType(CreateParkingSpotDto) {}

export class ParkingSpotDto {
  id: string;
  number: string;
  type?: string; // Changed to optional
  status?: string; // Changed to optional
  propertyId?: string;
  residentialComplexId: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PropertyWithDetailsDto {
  id: string;
  residentialComplexId: string;
  number: string; // Changed from unitNumber
  type: string;
  status?: string; // Changed to optional
  ownerId?: string;
  ownerName?: string;
  totalResidents?: number; // Changed to optional
  createdAt: Date;
  updatedAt: Date;
}

export class CreatePropertyDto {
  @IsString()
  residentialComplexId: string;

  @IsString()
  unitNumber: string;

  @IsString()
  type: string;

  @IsString()
  @IsOptional()
  status?: string; // Changed to optional

  @IsOptional()
  @IsString()
  ownerId?: string;
}

export class UpdatePropertyDto {
  @IsOptional()
  @IsString()
  residentialComplexId?: string;

  @IsOptional()
  @IsString()
  unitNumber?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  status?: string; // Changed to optional

  @IsOptional()
  @IsString()
  ownerId?: string;
}

export class PetWithDetailsDto {
  id: string;
  name: string;
  type?: string; // Changed to optional
  breed?: string;
  ownerId: string;
  ownerName?: string; // Changed to optional
  residentialComplexId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreatePetDto {
  @IsString()
  residentialComplexId: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  type?: string; // Changed to optional

  @IsOptional()
  @IsString()
  breed?: string;

  @IsString()
  ownerId: string;
}

export class VehicleWithDetailsDto {
  id: string;
  plate: string; // Changed from licensePlate
  brand?: string;
  model?: string;
  ownerId: string;
  ownerName?: string; // Changed to optional
  residentialComplexId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class CreateVehicleDto {
  @IsString()
  residentialComplexId: string;

  @IsString()
  licensePlate: string;

  @IsOptional()
  @IsString()
  brand?: string;

  @IsOptional()
  @IsString()
  model?: string;

  @IsString()
  ownerId: string;
}

export class CreateResidentDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  propertyId: string;

  @IsString()
  residentialComplexId: string;

  @IsString()
  role: string;

  @IsBoolean()
  isActive: boolean;

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsOptional()
  @IsString()
  idType?: string;

  @IsOptional()
  @IsBoolean()
  isOwner?: boolean;

  @IsOptional()
  @IsString()
  relationshipWithOwner?: string;

  @IsOptional()
  @IsString()
  biometricId?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}

export class UpdateResidentDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  email?: string;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsString()
  residentialComplexId?: string;

  @IsOptional()
  @IsString()
  role?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;

  @IsOptional()
  @IsString()
  idNumber?: string;

  @IsOptional()
  @IsString()
  idType?: string;

  @IsOptional()
  @IsBoolean()
  isOwner?: boolean;

  @IsOptional()
  @IsString()
  relationshipWithOwner?: string;

  @IsOptional()
  @IsString()
  biometricId?: string;

  @IsString()
  @IsOptional()
  userId?: string;
}