import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsBoolean,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum DocumentType {
  GENERAL = 'GENERAL',
  FINANCIAL = 'FINANCIAL',
  LEGAL = 'LEGAL',
  ASSEMBLY = 'ASSEMBLY',
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  REPORT = 'REPORT',
  MANUAL = 'MANUAL',
  REGULATION = 'REGULATION',
  MINUTES = 'MINUTES',
  OTHER = 'OTHER',
}

export enum DocumentStatus {
  DRAFT = 'DRAFT',
  ACTIVE = 'ACTIVE',
  ARCHIVED = 'ARCHIVED',
  DELETED = 'DELETED',
}

export enum AccessLevel {
  PUBLIC = 'PUBLIC',
  RESIDENTS = 'RESIDENTS',
  ADMIN = 'ADMIN',
  RESTRICTED = 'RESTRICTED',
}

export class CreateDocumentDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsEnum(AccessLevel)
  @IsOptional()
  accessLevel?: AccessLevel = AccessLevel.RESIDENTS;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean = false;

  @IsString()
  @IsOptional()
  expirationDate?: string;

  constructor(name: string, type: DocumentType, description?: string) {
    this.name = name;
    this.type = type;
    this.description = description;
  }
}

export class DocumentDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  url: string;

  @IsEnum(DocumentType)
  type: DocumentType;

  @IsEnum(DocumentStatus)
  status: DocumentStatus;

  @IsEnum(AccessLevel)
  accessLevel: AccessLevel;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  uploadedBy: string;

  @IsString()
  uploadedByName: string;

  @IsDateString()
  uploadedAt: string;

  @IsDateString()
  @IsOptional()
  updatedAt?: string;

  @IsNumber()
  version: number;

  @IsNumber()
  size: number;

  @IsString()
  mimeType: string;

  @IsString()
  @IsOptional()
  checksum?: string;

  @IsDateString()
  @IsOptional()
  expirationDate?: string;

  @IsBoolean()
  hasVersions: boolean;

  @IsNumber()
  downloadCount: number;

  @IsDateString()
  @IsOptional()
  lastAccessedAt?: string;
}

export class DocumentVersionDto {
  @IsString()
  id: string;

  @IsString()
  documentId: string;

  @IsNumber()
  version: number;

  @IsString()
  url: string;

  @IsNumber()
  size: number;

  @IsString()
  uploadedBy: string;

  @IsString()
  uploadedByName: string;

  @IsDateString()
  uploadedAt: string;

  @IsString()
  @IsOptional()
  changeNotes?: string;

  @IsString()
  checksum: string;

  @IsBoolean()
  isCurrent: boolean;
}

export class UpdateDocumentDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(DocumentType)
  @IsOptional()
  type?: DocumentType;

  @IsEnum(AccessLevel)
  @IsOptional()
  accessLevel?: AccessLevel;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;

  @IsString()
  @IsOptional()
  expirationDate?: string;

  @IsEnum(DocumentStatus)
  @IsOptional()
  status?: DocumentStatus;
}

export class UploadDocumentVersionDto {
  @IsString()
  changeNotes: string;

  @IsBoolean()
  @IsOptional()
  makeCurrentVersion?: boolean = true;
}

export class DocumentFilterParamsDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @IsOptional()
  @IsEnum(AccessLevel)
  accessLevel?: AccessLevel;

  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsArray()
  tags?: string[];

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsBoolean()
  expiringSoon?: boolean;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;

  @IsOptional()
  @IsString()
  sortBy?: string = 'uploadedAt';

  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';
}

export class DocumentStatsDto {
  @IsNumber()
  totalDocuments: number;

  @IsNumber()
  totalSize: number;

  @IsNumber()
  documentsByType: { [key in DocumentType]: number };

  @IsNumber()
  documentsByStatus: { [key in DocumentStatus]: number };

  @IsNumber()
  documentsByAccessLevel: { [key in AccessLevel]: number };

  @IsNumber()
  expiringDocuments: number;

  @IsNumber()
  recentUploads: number;

  @IsNumber()
  totalDownloads: number;
}

export class BulkDocumentActionDto {
  @IsArray()
  documentIds: string[];

  @IsString()
  action: 'delete' | 'archive' | 'restore' | 'updateAccessLevel' | 'addTags' | 'removeTags';

  @IsOptional()
  payload?: any; // Action-specific data
}