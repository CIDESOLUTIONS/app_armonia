import {
  IsString,
  IsNumber,
  IsOptional,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ListingCategory {
  HOME = 'HOME',
  TECHNOLOGY = 'TECHNOLOGY',
  SERVICES = 'SERVICES',
  CLASSES = 'CLASSES',
  OTHER = 'OTHER',
}

export enum ListingStatus {
  ACTIVE = 'ACTIVE',
  SOLD = 'SOLD',
  REPORTED = 'REPORTED',
  DELETED = 'DELETED',
}

export class CreateListingDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsEnum(ListingCategory)
  category: ListingCategory;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[]; // URLs de las imágenes
}

export class UpdateListingDto extends CreateListingDto {
  @IsOptional()
  @IsEnum(ListingStatus)
  status?: ListingStatus;
}

export class ListingDto {
  id: number;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  images: string[];
  status: ListingStatus;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  author: { name: string };
}

export class ReportListingDto {
  @IsNumber()
  listingId: number;

  @IsString()
  reason: string;
}

export class ResolveReportDto {
  @IsNumber()
  reportId: number;

  @IsEnum(['APPROVE', 'REJECT'])
  action: 'APPROVE' | 'REJECT';
}

export class CreateMessageDto {
  @IsNumber()
  listingId: number;

  @IsNumber()
  senderId: number;

  @IsNumber()
  receiverId: number;

  @IsString()
  content: string;
}

export class MessageDto {
  id: number;
  listingId: number;
  senderId: number;
  receiverId: number;
  content: string;
  createdAt: Date;
}

export class ListingFilterParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(ListingCategory)
  category?: ListingCategory;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
