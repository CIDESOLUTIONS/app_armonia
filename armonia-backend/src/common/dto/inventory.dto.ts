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
  @IsNumber()
  complexId: number;

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

export class UpdateCommonAreaDto extends PartialType(CreateCommonAreaDto) {}

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

  @IsEnum(ParkingSpotType)
  type: ParkingSpotType;

  @IsEnum(ParkingSpotStatus)
  @IsOptional()
  status?: ParkingSpotStatus;

  @IsNumber()
  @IsOptional()
  propertyId?: number;

  @IsNumber()
  @IsOptional()
  residentId?: number;

  @IsNumber()
  complexId: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateParkingSpotDto extends PartialType(CreateParkingSpotDto) {}

export class ParkingSpotDto {
  id: number;
  number: string;
  type: ParkingSpotType;
  status: ParkingSpotStatus;
  propertyId?: number;
  residentId?: number;
  complexId: number;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export class PropertyWithDetailsDto {
  @IsNumber()
  id: number;

  @IsNumber()
  complexId: number;

  @IsString()
  unitNumber: string;

  @IsString()
  type: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsString()
  block?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsNumber()
  ownerId?: number;

  @IsOptional()
  @IsString()
  ownerName?: string;

  @IsOptional()
  @IsString()
  ownerEmail?: string;

  @IsNumber()
  totalResidents: number;

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}

export class PetWithDetailsDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsBoolean()
  vaccinated: boolean;

  @IsOptional()
  @IsDateString()
  vaccineExpiryDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  propertyId: number;

  @IsNumber()
  residentId: number;

  @IsString()
  unitNumber: string;

  @IsString()
  residentName: string;

  @IsDateString()
  createdAt: Date;
}

export class VehicleWithDetailsDto {
  @IsNumber()
  id: number;

  @IsString()
  licensePlate: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsString()
  color: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  parkingSpot?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  propertyId: number;

  @IsNumber()
  residentId: number;
}

export class CreatePropertyDto {
  @IsNumber()
  complexId: number;

  @IsString()
  unitNumber: string;

  @IsString()
  type: string;

  @IsString()
  status: string;

  @IsOptional()
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsString()
  block?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsNumber()
  ownerId?: number;
}

export class UpdatePropertyDto {
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
  @IsNumber()
  area?: number;

  @IsOptional()
  @IsString()
  block?: string;

  @IsOptional()
  @IsString()
  zone?: string;

  @IsOptional()
  @IsNumber()
  ownerId?: number;
}

export class CreatePetDto {
  @IsNumber()
  complexId: number;

  @IsString()
  name: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  breed?: string;

  @IsOptional()
  @IsNumber()
  age?: number;

  @IsOptional()
  @IsNumber()
  weight?: number;

  @IsOptional()
  @IsString()
  color?: string;

  @IsBoolean()
  vaccinated: boolean;

  @IsOptional()
  @IsDateString()
  vaccineExpiryDate?: Date;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  propertyId: number;

  @IsNumber()
  residentId: number;
}

export class CreateVehicleDto {
  @IsNumber()
  complexId: number;

  @IsString()
  licensePlate: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  year: number;

  @IsString()
  color: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsString()
  parkingSpot?: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsNumber()
  propertyId: number;

  @IsNumber()
  residentId: number;
}

export class CreateResidentDto {
  @IsString()
  name: string;

  @IsString()
  email: string;

  @IsString()
  phone: string;

  @IsNumber()
  propertyId: number;

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
  @IsNumber()
  propertyId?: number;

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
}
