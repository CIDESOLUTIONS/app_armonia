import { IsString, IsNumber, IsOptional, IsBoolean, IsArray, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

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

  @IsString()
  unitNumber: string;

  @IsString()
  residentName: string;

  @IsDateString()
  createdAt: Date;
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
}
