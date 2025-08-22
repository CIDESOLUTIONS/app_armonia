import { fetchApi } from "@/lib/api";

// Enums del backend
export enum DocumentType {
  REGULATION = 'REGULATION',
  MINUTES = 'MINUTES',
  MANUAL = 'MANUAL',
  CONTRACT = 'CONTRACT',
  INVOICE = 'INVOICE',
  REPORT = 'REPORT',
  FINANCIAL = 'FINANCIAL',
  LEGAL = 'LEGAL',
  ASSEMBLY = 'ASSEMBLY',
  BUDGET = 'BUDGET',
  EXPENSE = 'EXPENSE',
  COMMUNICATION = 'COMMUNICATION',
  CERTIFICATE = 'CERTIFICATE',
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

// Interfaces del backend
export interface DocumentResponse {
  id: string;
  name: string;
  originalName: string;
  description?: string;
  url: string;
  fileName: string;
  fileSize: number;
  mimeType: string;
  checksum?: string;
  type: DocumentType;
  category?: string;
  subcategory?: string;
  tags: string[];
  accessLevel: AccessLevel;
  accessRoles: string[];
  isPublic: boolean;
  version: number;
  isCurrentVersion: boolean;
  status: DocumentStatus;
  requiresApproval: boolean;
  approvalStatus?: string;
  approvedAt?: Date;
  expirationDate?: Date;
  priority: Priority;
  language: string;
  downloadCount: number;
  viewCount: number;
  lastAccessedAt?: Date;
  uploadedById: string;
  uploadedBy: {
    id: string;
    name: string;
    email: string;
  };
  createdAt: Date;
  updatedAt: Date;
  updatedById?: string;
  updatedBy?: {
    id: string;
    name: string;
    email: string;
  };
  residentialComplexId: string;
  versionCount?: number;
  commentCount?: number;
}

export interface DocumentListResponse {
  documents: DocumentResponse[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
  filters?: {
    types: { value: DocumentType; count: number }[];
    categories: { value: string; count: number }[];
    statuses: { value: DocumentStatus; count: number }[];
  };
}

export interface DocumentStatsResponse {
  totalDocuments: number;
  totalSize: number;
  averageSize: number;
  documentsByType: Record<DocumentType, number>;
  documentsByStatus: Record<DocumentStatus, number>;
  documentsByAccessLevel: Record<AccessLevel, number>;
  expiringDocuments: number;
  recentUploads: number;
  totalDownloads: number;
  totalViews: number;
  mostViewedDocuments: {
    id: string;
    name: string;
    viewCount: number;
  }[];
  mostDownloadedDocuments: {
    id: string;
    name: string;
    downloadCount: number;
  }[];
  topUploaders: {
    userId: string;
    userName: string;
    documentCount: number;
  }[];
}

export interface CreateDocumentData {
  name: string;
  originalName: string;
  description?: string;
  type: DocumentType;
  category?: string;
  subcategory?: string;
  tags?: string[];
  accessLevel?: AccessLevel;
  accessRoles?: string[];
  isPublic?: boolean;
  requiresApproval?: boolean;
  expirationDate?: string;
  priority?: Priority;
  language?: string;
}

export interface UpdateDocumentData {
  name?: string;
  description?: string;
  type?: DocumentType;
  category?: string;
  subcategory?: string;
  tags?: string[];
  accessLevel?: AccessLevel;
  accessRoles?: string[];
  isPublic?: boolean;
  status?: DocumentStatus;
  expirationDate?: string;
  priority?: Priority;
}

export interface DocumentSearchParams {
  query?: string;
  type?: DocumentType;
  category?: string;
  subcategory?: string;
  tags?: string[];
  status?: DocumentStatus;
  accessLevel?: AccessLevel;
  uploadedBy?: string;
  dateFrom?: string;
  dateTo?: string;
  expiringSoon?: boolean;
  hasVersions?: boolean;
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

// Funciones del servicio
export async function searchDocuments(params: DocumentSearchParams = {}): Promise<DocumentListResponse> {
  try {
    const queryParams = new URLSearchParams();
    
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(v => queryParams.append(key, v));
        } else {
          queryParams.append(key, value.toString());
        }
      }
    });

    const response = await fetchApi(`/documents/search?${queryParams.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error searching documents:", error);
    throw error;
  }
}

export async function getDocuments(params: DocumentSearchParams = {}): Promise<DocumentListResponse> {
  return searchDocuments(params);
}

export async function getDocumentById(id: string, trackView: boolean = true): Promise<DocumentResponse> {
  try {
    const response = await fetchApi(`/documents/${id}?trackView=${trackView}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching document ${id}:`, error);
    throw error;
  }
}

export async function uploadDocument(
  data: CreateDocumentData,
  file: File,
): Promise<DocumentResponse> {
  try {
    const formData = new FormData();
    
    // Agregar el archivo
    formData.append("file", file);
    
    // Agregar los datos del documento
    Object.entries(data).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        if (Array.isArray(value)) {
          formData.append(key, JSON.stringify(value));
        } else {
          formData.append(key, value.toString());
        }
      }
    });

    const response = await fetchApi("/documents/upload", {
      method: "POST",
      body: formData,
    });
    return response.data;
  } catch (error) {
    console.error("Error uploading document:", error);
    throw error;
  }
}

export async function updateDocument(
  id: string,
  data: UpdateDocumentData
): Promise<DocumentResponse> {
  try {
    const response = await fetchApi(`/documents/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error(`Error updating document ${id}:`, error);
    throw error;
  }
}

export async function deleteDocument(id: string): Promise<void> {
  try {
    await fetchApi(`/documents/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error(`Error deleting document ${id}:`, error);
    throw error;
  }
}

export async function downloadDocument(id: string): Promise<void> {
  try {
    // Obtener la información del documento primero
    const document = await getDocumentById(id, true);
    
    // Crear un enlace temporal para descargar
    const link = document.createElement('a');
    link.href = document.url;
    link.download = document.fileName;
    link.target = '_blank';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(`Error downloading document ${id}:`, error);
    throw error;
  }
}

export async function getDocumentStats(): Promise<DocumentStatsResponse> {
  try {
    const response = await fetchApi('/documents/stats');
    return response.data;
  } catch (error) {
    console.error('Error fetching document stats:', error);
    throw error;
  }
}

export async function getDocumentCategories(): Promise<{
  categories: string[];
  subcategories: Record<string, string[]>;
}> {
  try {
    const response = await fetchApi('/documents/categories');
    return response.data;
  } catch (error) {
    console.error('Error fetching document categories:', error);
    throw error;
  }
}

export async function shareDocument(data: {
  documentId: string;
  recipientEmail: string;
  message?: string;
  accessLevel?: string;
  expiresAt?: string;
}): Promise<any> {
  try {
    const response = await fetchApi('/documents/share', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error('Error sharing document:', error);
    throw error;
  }
}

export async function approveDocument(data: {
  documentId: string;
  status: 'APPROVED' | 'REJECTED';
  comments?: string;
}): Promise<any> {
  try {
    const response = await fetchApi('/documents/approve', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error('Error approving document:', error);
    throw error;
  }
}