import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum DocumentType {
  GENERAL = 'GENERAL',
  FINANCIAL = 'FINANCIAL',
  LEGAL = 'LEGAL',
  ASSEMBLY = 'ASSEMBLY',
  OTHER = 'OTHER',
}

export class CreateDocumentDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  constructor(name: string, type: DocumentType, description?: string) {
    this.name = name;
    this.type = type;
    this.description = description;
  }
}

export class DocumentDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  url: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsNumber()
  uploadedBy: number;

  @IsString()
  uploadedByName: string; // Assuming we can get the name from the user service

  @IsDateString()
  uploadedAt: string;
}

export class DocumentFilterParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @IsOptional()
  @IsNumber()
  uploadedBy?: number;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number;
}
