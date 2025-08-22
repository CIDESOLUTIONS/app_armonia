// Componentes principales de documentos
export { DocumentUploader } from './DocumentUploader';
export { DocumentCard } from './DocumentCard';
export { DocumentFilters } from './DocumentFilters';
export { DocumentsList } from './DocumentsList';
export { DocumentViewer } from './DocumentViewer';

// Re-exportar tipos y servicios para conveniencia
export {
  DocumentType,
  DocumentStatus,
  AccessLevel,
  Priority,
  type DocumentResponse,
  type DocumentListResponse,
  type DocumentStatsResponse,
  type CreateDocumentData,
  type UpdateDocumentData,
  type DocumentSearchParams,
} from '@/services/documentService';
