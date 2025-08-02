import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ServiceProviderCategory {
  PLUMBING = 'Plomería',
  ELECTRICITY = 'Electricidad',
  CLEANING = 'Limpieza',
  GARDENING = 'Jardinería',
  SECURITY = 'Seguridad',
  OTHER = 'Otro',
}

export class CreateServiceProviderDto {
  @IsString()
  name: string;

  @IsString()
  service: string; // Changed from category

  @IsString()
  @IsOptional()
  phone?: string; // Changed from contactPhone

  @IsString()
  @IsOptional()
  email?: string; // Changed from contactEmail

  @IsString()
  residentialComplexId: string;
}

export class UpdateServiceProviderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  service?: string; // Changed from category

  @IsOptional()
  @IsString()
  phone?: string; // Changed from contactPhone

  @IsOptional()
  @IsString()
  email?: string; // Changed from contactEmail

  @IsOptional()
  @IsString()
  residentialComplexId?: string;
}

export class ServiceProviderDto {
  id: string; // Changed from number
  name: string;
  service: string; // Changed from category
  phone?: string; // Changed from contactPhone
  email?: string; // Changed from contactEmail
  residentialComplexId: string;
  createdAt: Date;
  updatedAt: Date;
}

export class ServiceProviderFilterParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsString()
  service?: string; // Changed from category

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minRating?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}

export class CreateReviewDto {
  @IsString() // Changed from number
  serviceProviderId: string;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class ReviewDto {
  id: string; // Changed from number
  serviceProviderId: string; // Changed from number
  userId: string; // Changed from number
  userName: string;
  rating: number;
  @IsOptional()
  @IsString()
  comment?: string;
  createdAt: Date;
}