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
  type: string; // Changed to string as per schema.prisma

  @IsString()
  @IsOptional()
  rules?: string; // Added as per schema.prisma
}

export class UpdateCommonAreaDto extends PartialType(CreateCommonAreaDto) {}

export class CommonAreaDto {
  id: string;
  name: string;
  description?: string;
  type: string; // Changed to string as per schema.prisma
  rules?: string; // Added as per schema.prisma
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
  type: string; // Changed to string as per schema.prisma

  @IsString()
  @IsOptional()
  status?: string; // Changed to string as per schema.prisma

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
  type: string; // Changed to string as per schema.prisma
  status: string; // Changed to string as per schema.prisma
  propertyId?: string;
  residentialComplexId: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PropertyWithDetailsDto {
  id: string;
  residentialComplexId: string;
  unitNumber: string;
  type: string;
  status: string; // Kept as per schema.prisma
  ownerId?: string;
  ownerName?: string;
  ownerEmail?: string;
  totalResidents: number;
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
  status: string;

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
  status?: string;

  @IsOptional()
  @IsString()
  ownerId?: string;
}

export class PetWithDetailsDto {
  id: string;
  name: string;
  type: string; // Added as per schema.prisma
  breed?: string;
  ownerId: string;
  ownerName: string;
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
  type: string; // Added as per schema.prisma

  @IsOptional()
  @IsString()
  breed?: string;

  @IsString()
  ownerId: string;
}

export class VehicleWithDetailsDto {
  id: string;
  licensePlate: string;
  brand?: string; // Changed to optional as per schema.prisma
  model?: string; // Changed to optional as per schema.prisma
  ownerId: string;
  ownerName: string;
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
}