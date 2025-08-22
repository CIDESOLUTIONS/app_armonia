export class DocumentEntity {
  id: string;
  name: string;
  originalName: string;
  category: string;
  description?: string;
  schemaName: string;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  tags: string[];
  accessRoles: string[];
  isPublic: boolean;
  isActive: boolean;
  requiresApproval: boolean;
  approvalStatus: 'PENDING' | 'APPROVED' | 'REJECTED';
  approvedAt?: Date;
  approvedById?: string;
  uploadedById: string;
  createdAt: Date;
  updatedAt: Date;
  versions: DocumentVersionEntity[];
  shares: DocumentShareEntity[];
}

export class DocumentVersionEntity {
  id: string;
  documentId: string;
  version: number;
  fileUrl: string;
  fileName: string;
  fileSize: number;
  versionNotes?: string;
  changeDescription?: string;
  uploadedById: string;
  createdAt: Date;
}

export class DocumentShareEntity {
  id: string;
  documentId: string;
  sharedById: string;
  recipientEmail: string;
  shareToken: string;
  message?: string;
  expiresAt?: Date;
  accessedAt?: Date;
  isActive: boolean;
  createdAt: Date;
}

export class DocumentCategoryEntity {
  id: string;
  name: string;
  description?: string;
  schemaName: string;
  parentId?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}