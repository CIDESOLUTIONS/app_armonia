import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, DocumentStatus, AccessLevel, Priority } from './create-document.dto';

export class DocumentResponseDto {
  @ApiProperty({
    description: 'ID único del documento',
    example: 'clxxx123456789',
  })
  id: string;

  @ApiProperty({
    description: 'Nombre del documento',
    example: 'Reglamento de Convivencia 2024.pdf',
  })
  name: string;

  @ApiProperty({
    description: 'Nombre original del archivo',
    example: 'reglamento-convivencia-2024.pdf',
  })
  originalName: string;

  @ApiProperty({
    description: 'Descripción del documento',
    example: 'Reglamento actualizado para el año 2024',
    required: false,
  })
  description?: string;

  @ApiProperty({
    description: 'URL del documento',
    example: 'https://s3.amazonaws.com/bucket/documents/reglamento-2024.pdf',
  })
  url: string;

  @ApiProperty({
    description: 'Nombre del archivo',
    example: 'reglamento-convivencia-2024.pdf',
  })
  fileName: string;

  @ApiProperty({
    description: 'Ruta del archivo',
    example: 'documents/regulations/2024/reglamento-convivencia.pdf',
    required: false,
  })
  filePath?: string;

  @ApiProperty({
    description: 'Tamaño del archivo en bytes',
    example: 2048576,
  })
  fileSize: number;

  @ApiProperty({
    description: 'Tipo MIME del archivo',
    example: 'application/pdf',
  })
  mimeType: string;

  @ApiProperty({
    description: 'Checksum del archivo',
    example: 'sha256:abcd1234...',
    required: false,
  })
  checksum?: string;

  @ApiProperty({
    description: 'Tipo de documento',
    enum: DocumentType,
    example: DocumentType.REGULATION,
  })
  type: DocumentType;

  @ApiProperty({
    description: 'Categoría del documento',
    example: 'Reglamentos',
    required: false,
  })
  category?: string;

  @ApiProperty({
    description: 'Subcategoría del documento',
    example: 'Convivencia',
    required: false,
  })
  subcategory?: string;

  @ApiProperty({
    description: 'Tags asociados al documento',
    example: ['reglamento', 'convivencia', '2024'],
    type: [String],
  })
  tags: string[];

  @ApiProperty({
    description: 'Nivel de acceso del documento',
    enum: AccessLevel,
    example: AccessLevel.RESIDENTS,
  })
  accessLevel: AccessLevel;

  @ApiProperty({
    description: 'Roles específicos que pueden acceder',
    example: ['ADMIN', 'RESIDENT'],
    type: [String],
  })
  accessRoles: string[];

  @ApiProperty({
    description: 'Si el documento es público',
    example: false,
  })
  isPublic: boolean;

  @ApiProperty({
    description: 'Versión del documento',
    example: 1,
  })
  version: number;

  @ApiProperty({
    description: 'Si es la versión actual',
    example: true,
  })
  isCurrentVersion: boolean;

  @ApiProperty({
    description: 'ID del documento padre (para versionado)',
    example: 'clxxx123456789',
    required: false,
  })
  parentDocumentId?: string;

  @ApiProperty({
    description: 'Estado del documento',
    enum: DocumentStatus,
    example: DocumentStatus.ACTIVE,
  })
  status: DocumentStatus;

  @ApiProperty({
    description: 'Si requiere aprobación',
    example: false,
  })
  requiresApproval: boolean;

  @ApiProperty({
    description: 'Estado de aprobación',
    example: 'APPROVED',
    required: false,
  })
  approvalStatus?: string;

  @ApiProperty({
    description: 'Fecha de aprobación',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  approvedAt?: Date;

  @ApiProperty({
    description: 'ID del usuario que aprobó',
    example: 'clxxx987654321',
    required: false,
  })
  approvedById?: string;

  @ApiProperty({
    description: 'Fecha de expiración',
    example: '2024-12-31T23:59:59Z',
    required: false,
  })
  expirationDate?: Date;

  @ApiProperty({
    description: 'Prioridad del documento',
    enum: Priority,
    example: Priority.NORMAL,
  })
  priority: Priority;

  @ApiProperty({
    description: 'Idioma del documento',
    example: 'es',
  })
  language: string;

  @ApiProperty({
    description: 'Número de descargas',
    example: 15,
  })
  downloadCount: number;

  @ApiProperty({
    description: 'Número de visualizaciones',
    example: 45,
  })
  viewCount: number;

  @ApiProperty({
    description: 'Último acceso',
    example: '2024-01-15T10:30:00Z',
    required: false,
  })
  lastAccessedAt?: Date;

  @ApiProperty({
    description: 'ID del usuario que subió el documento',
    example: 'clxxx123456789',
  })
  uploadedById: string;

  @ApiProperty({
    description: 'ID del conjunto residencial',
    example: 'clxxx111222333',
  })
  residentialComplexId: string;

  @ApiProperty({
    description: 'Fecha de creación',
    example: '2024-01-15T10:30:00Z',
  })
  createdAt: Date;

  @ApiProperty({
    description: 'Fecha de última actualización',
    example: '2024-01-15T10:30:00Z',
  })
  updatedAt: Date;

  @ApiProperty({
    description: 'ID del usuario que actualizó',
    example: 'clxxx987654321',
    required: false,
  })
  updatedById?: string;

  @ApiProperty({
    description: 'Información del usuario que subió el documento',
    example: {
      id: 'clxxx123456789',
      firstName: 'Juan',
      lastName: 'Pérez',
      email: 'juan@example.com',
    },
    required: false,
  })
  uploadedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({
    description: 'Información del usuario que aprobó',
    example: {
      id: 'clxxx987654321',
      firstName: 'Ana',
      lastName: 'García',
      email: 'ana@example.com',
    },
    required: false,
  })
  approvedBy?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };

  @ApiProperty({
    description: 'Información del conjunto residencial',
    example: {
      id: 'clxxx111222333',
      name: 'Conjunto Residencial Armonía',
      slug: 'conjunto-armonia',
    },
    required: false,
  })
  residentialComplex?: {
    id: string;
    name: string;
    slug: string;
  };

  @ApiProperty({
    description: 'Número total de versiones de este documento',
    example: 3,
  })
  totalVersions?: number;

  @ApiProperty({
    description: 'Versiones del documento',
    type: [Object],
    required: false,
  })
  versions?: any[];

  @ApiProperty({
    description: 'Comentarios del documento',
    type: [Object],
    required: false,
  })
  comments?: any[];

  @ApiProperty({
    description: 'Compartidos del documento',
    type: [Object],
    required: false,
  })
  shares?: any[];

  @ApiProperty({
    description: 'Actividades del documento',
    type: [Object],
    required: false,
  })
  activities?: any[];
}