import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString, IsEnum, IsArray, IsNumber, IsDateString, IsBoolean } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { DocumentType, DocumentStatus, AccessLevel, Priority } from './create-document.dto';

export class SearchDocumentDto {
  @ApiProperty({
    description: 'Término de búsqueda (busca en nombre, descripción y contenido)',
    example: 'reglamento convivencia',
    required: false,
  })
  @IsOptional()
  @IsString()
  searchTerm?: string;

  @ApiProperty({
    description: 'Tipo de documento',
    enum: DocumentType,
    required: false,
  })
  @IsOptional()
  @IsEnum(DocumentType)
  type?: DocumentType;

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
    description: 'Estado del documento',
    enum: DocumentStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(DocumentStatus)
  status?: DocumentStatus;

  @ApiProperty({
    description: 'Nivel de acceso',
    enum: AccessLevel,
    required: false,
  })
  @IsOptional()
  @IsEnum(AccessLevel)
  accessLevel?: AccessLevel;

  @ApiProperty({
    description: 'Prioridad del documento',
    enum: Priority,
    required: false,
  })
  @IsOptional()
  @IsEnum(Priority)
  priority?: Priority;

  @ApiProperty({
    description: 'Tags a buscar',
    example: ['reglamento', 'convivencia'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @Transform(({ value }) => {
    if (!value) return undefined;
    return Array.isArray(value) ? value : value.split(',').map((tag: string) => tag.trim());
  })
  tags?: string[];

  @ApiProperty({
    description: 'Tipo de archivo (extensión)',
    example: 'pdf',
    required: false,
  })
  @IsOptional()
  @IsString()
  fileType?: string;

  @ApiProperty({
    description: 'Solo documentos públicos',
    example: false,
    required: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  publicOnly?: boolean;

  @ApiProperty({
    description: 'Idioma del documento',
    example: 'es',
    required: false,
  })
  @IsOptional()
  @IsString()
  language?: string;

  @ApiProperty({
    description: 'Fecha de creación desde',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdFrom?: string;

  @ApiProperty({
    description: 'Fecha de creación hasta',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  createdTo?: string;

  @ApiProperty({
    description: 'Fecha de expiración desde',
    example: '2024-01-01',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expirationFrom?: string;

  @ApiProperty({
    description: 'Fecha de expiración hasta',
    example: '2024-12-31',
    required: false,
  })
  @IsOptional()
  @IsDateString()
  expirationTo?: string;

  @ApiProperty({
    description: 'Tamaño mínimo del archivo en bytes',
    example: 1024,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  minSize?: number;

  @ApiProperty({
    description: 'Tamaño máximo del archivo en bytes',
    example: 10485760,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  maxSize?: number;

  @ApiProperty({
    description: 'ID del usuario que subio el documento',
    example: 'clxxx123456789',
    required: false,
  })
  @IsOptional()
  @IsString()
  uploadedBy?: string;

  @ApiProperty({
    description: 'Solo versiones actuales',
    example: true,
    required: false,
    default: true,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  currentVersionsOnly?: boolean = true;

  @ApiProperty({
    description: 'Incluir documentos eliminados',
    example: false,
    required: false,
    default: false,
  })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true' || value === true)
  includeDeleted?: boolean = false;

  @ApiProperty({
    description: 'Campo por el cual ordenar',
    example: 'createdAt',
    required: false,
    enum: ['name', 'createdAt', 'updatedAt', 'fileSize', 'type', 'priority'],
  })
  @IsOptional()
  @IsString()
  sortBy?: 'name' | 'createdAt' | 'updatedAt' | 'fileSize' | 'type' | 'priority' = 'createdAt';

  @ApiProperty({
    description: 'Dirección del ordenamiento',
    example: 'desc',
    required: false,
    enum: ['asc', 'desc'],
  })
  @IsOptional()
  @IsString()
  sortOrder?: 'asc' | 'desc' = 'desc';

  @ApiProperty({
    description: 'Número de página para paginación',
    example: 1,
    required: false,
    minimum: 1,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  page?: number = 1;

  @ApiProperty({
    description: 'Número de elementos por página',
    example: 20,
    required: false,
    minimum: 1,
    maximum: 100,
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  limit?: number = 20;
}