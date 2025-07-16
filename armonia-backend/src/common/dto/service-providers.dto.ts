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

  @IsEnum(ServiceProviderCategory)
  category: ServiceProviderCategory;

  @IsString()
  description: string;

  @IsString()
  contactPhone: string;

  @IsString()
  contactEmail: string;

  @IsString()
  address: string;
}

export class UpdateServiceProviderDto {
  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsEnum(ServiceProviderCategory)
  category?: ServiceProviderCategory;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  address?: string;
}

export class ServiceProviderDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsEnum(ServiceProviderCategory)
  category: ServiceProviderCategory;

  @IsString()
  description: string;

  @IsString()
  contactPhone: string;

  @IsString()
  contactEmail: string;

  @IsString()
  address: string;

  @IsNumber()
  rating: number;

  @IsNumber()
  reviewCount: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
}

export class ServiceProviderFilterParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ServiceProviderCategory)
  category?: ServiceProviderCategory;

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
  @IsNumber()
  serviceProviderId: number;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;
}

export class ReviewDto {
  @IsNumber()
  id: number;

  @IsNumber()
  serviceProviderId: number;

  @IsNumber()
  userId: number;

  @IsString()
  userName: string;

  @IsNumber()
  rating: number;

  @IsOptional()
  @IsString()
  comment?: string;

  @IsDateString()
  createdAt: string;
}
