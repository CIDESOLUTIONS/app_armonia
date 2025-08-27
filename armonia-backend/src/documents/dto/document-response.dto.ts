import { ApiProperty } from '@nestjs/swagger';
import { DocumentType, DocumentStatus, AccessLevel, Priority, User, ResidentialComplex, DocumentComment, DocumentShare, DocumentActivity } from '@prisma/client';

class UserResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
  @ApiProperty()
  email: string;
}

class ResidentialComplexResponse {
  @ApiProperty()
  id: string;
  @ApiProperty()
  name: string;
}

export class DocumentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  originalName: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  fileName: string;

  @ApiProperty({ required: false })
  filePath?: string;

  @ApiProperty()
  fileSize: number;

  @ApiProperty()
  mimeType: string;

  @ApiProperty({ required: false })
  checksum?: string;

  @ApiProperty({ enum: DocumentType })
  type: DocumentType;

  @ApiProperty({ required: false })
  category?: string;

  @ApiProperty({ required: false })
  subcategory?: string;

  @ApiProperty({ type: [String] })
  tags: string[];

  @ApiProperty({ enum: AccessLevel })
  accessLevel: AccessLevel;

  @ApiProperty({ type: [String] })
  accessRoles: string[];

  @ApiProperty()
  isPublic: boolean;

  @ApiProperty()
  version: number;

  @ApiProperty()
  isCurrentVersion: boolean;

  @ApiProperty({ required: false })
  parentDocumentId?: string;

  @ApiProperty({ enum: DocumentStatus })
  status: DocumentStatus;

  @ApiProperty()
  requiresApproval: boolean;

  @ApiProperty({ required: false })
  approvalStatus?: string;

  @ApiProperty({ type: Date, required: false })
  approvedAt?: Date;

  @ApiProperty({ required: false })
  approvedById?: string;

  @ApiProperty({ type: Date, required: false })
  expirationDate?: Date;

  @ApiProperty({ enum: Priority, required: false })
  priority?: Priority;

  @ApiProperty({ required: false })
  language?: string;

  @ApiProperty()
  downloadCount: number;

  @ApiProperty()
  viewCount: number;

  @ApiProperty({ type: Date, required: false })
  lastAccessedAt?: Date;

  @ApiProperty()
  uploadedById: string;

  @ApiProperty()
  residentialComplexId: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  @ApiProperty({ required: false })
  updatedById?: string;

  @ApiProperty({ type: () => UserResponse, required: false })
  uploadedBy?: UserResponse;

  @ApiProperty({ type: () => UserResponse, required: false })
  approvedBy?: UserResponse;

  @ApiProperty({ type: () => ResidentialComplexResponse, required: false })
  residentialComplex?: ResidentialComplexResponse;

  @ApiProperty()
  totalVersions: number;

  @ApiProperty({ type: [Object], required: false })
  versions?: any[];

  @ApiProperty({ type: [Object], required: false })
  comments?: any[];

  @ApiProperty({ type: [Object], required: false })
  shares?: any[];

  @ApiProperty({ type: [Object], required: false })
  activities?: any[];
}
