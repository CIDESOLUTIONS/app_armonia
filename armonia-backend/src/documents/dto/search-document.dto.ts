import { IsString, IsOptional, IsArray, IsBoolean, IsDateString, IsEnum, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, DocumentStatus, AccessLevel, Priority } from '@prisma/client';
import { Type } from 'class-transformer';

export class SearchDocumentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiProperty({ enum: DocumentType, required: false })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiProperty({ enum: DocumentStatus, required: false })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiProperty({ enum: AccessLevel, required: false })
  @IsOptional()
  @IsEnum(AccessLevel)
  accessLevel?: AccessLevel;

  @ApiProperty({ enum: Priority, required: false })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  publicOnly?: boolean;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  currentVersionsOnly?: boolean;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  tags?: string[];

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  fileType?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expirationFrom?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsDateString()
  expirationTo?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  minSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  maxSize?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  sortBy?: string;

  @ApiProperty({ required: false, enum: ['asc', 'desc'] })
  @IsOptional()
  @IsEnum(['asc', 'desc'])
  sortOrder?: 'asc' | 'desc';

  @ApiProperty({ required: false, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false, default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsBoolean()
  includeDeleted?: boolean;
}
