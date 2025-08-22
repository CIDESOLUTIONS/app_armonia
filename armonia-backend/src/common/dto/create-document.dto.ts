import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsArray, IsBoolean, MaxLength } from 'class-validator';
import { Transform } from 'class-transformer';

export enum DocumentType {
  REGULATION = 'REGULATION',
  MINUTES = 'MINUTES',
  MANUAL = 'MANUAL',
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  REPORT = 'REPORT',
  CERTIFICATE = 'CERTIFICATE',
  BUDGET = 'BUDGET',
  FINANCIAL = 'FINANCIAL',
  LEGAL = 'LEGAL',
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

export enum Priority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT',
}

export class CreateDocumentDto {
  @ApiProperty({
    description: 'Nombre del documento',
    example: 'Reglamento de Convivencia 2024',
    maxLength: 255,
  })
  @IsString()
  @MaxLength(255)
  name: string;

  @ApiProperty({
    description: 'Descripción del documento',
    example: 'Reglamento actualizado para el año 2024',
    required: false,
    maxLength: 1000,
  })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  description?: string;

  @ApiProperty({
    description: 'Tipo de documento',
    enum: DocumentType,
    example: DocumentType.REGULATION,
    required: false,
    default: DocumentType.OTHER,
  })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType = DocumentType.OTHER;

  @ApiProperty({
    description: 'Categoría del documento',
    example: 'Reglamentos',
    required: false,
  })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiProperty({
    description: 'Subcategoría del documento',
    example: 'Convivencia',
    required: false,
  })
  @IsOptional()
  @IsString()
  subcategory?: string;

  @ApiProperty({
    description: 'Nivel de acceso del documento',
    enum: AccessLevel,
    example: AccessLevel.RESIDENTS,
    required: false,
    default: AccessLevel.RESIDENTS,
  })
  @IsOptional()
  @IsEnum(AccessLevel)
  accessLevel?: AccessLevel = AccessLevel.RESIDENTS;

  @ApiProperty({
    description: 'Roles específicos que pueden acceder',
    example: ['ADMIN', 'RESIDENT'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  accessRoles?: string[];

  @ApiProperty({
    description: 'Si el documento es público',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  isPublic?: boolean = false;

  @ApiProperty({
    description: 'Prioridad del documento',
    enum: Priority,
    example: Priority.NORMAL,
    required: false,
    default: Priority.NORMAL,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority = Priority.NORMAL;

  @ApiProperty({
    description: 'Idioma del documento',
    example: 'es',
    required: false,
    default: 'es',
  })
  @IsOptional()
  @IsString()
  language?: string = 'es';

  @ApiProperty({
    description: 'Si requiere aprobación',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  requiresApproval?: boolean = false;

  @ApiProperty({
    description: 'Tags asociados al documento',
    example: ['reglamento', 'convivencia', '2024'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => Array.isArray(value) ? value : [])
  tags?: string[];

  @ApiProperty({
    description: 'Fecha de expiración',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  @IsOptional()
  @IsString()
  expirationDate?: string;

  @ApiProperty({
    description: 'ID del documento padre (para versionado)',
    example: 'clxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  parentDocumentId?: string;
}