"use client";

import React from 'react';
import { DocumentCard } from './DocumentCard';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileText, Grid, List } from 'lucide-react';
import { DocumentResponse, DocumentListResponse } from '@/services/documentService';

interface DocumentsListProps {
  data?: DocumentListResponse;
  loading?: boolean;
  viewMode?: 'grid' | 'list';
  onViewModeChange?: (mode: 'grid' | 'list') => void;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
  onDocumentView?: (document: DocumentResponse) => void;
  onDocumentDownload?: (document: DocumentResponse) => void;
  onDocumentEdit?: (document: DocumentResponse) => void;
  onDocumentShare?: (document: DocumentResponse) => void;
  onDocumentDelete?: (document: DocumentResponse) => void;
  showActions?: boolean;
  emptyStateTitle?: string;
  emptyStateDescription?: string;
}

const PAGE_SIZE_OPTIONS = [
  { value: '12', label: '12 por página' },
  { value: '24', label: '24 por página' },
  { value: '48', label: '48 por página' },
  { value: '96', label: '96 por página' },
];

function DocumentSkeleton({ viewMode }: { viewMode: 'grid' | 'list' }) {
  return (
    <div className={viewMode === 'grid' ? 'aspect-[4/3]' : 'h-20'}>
      <Skeleton className="w-full h-full" />
    </div>
  );
}

function EmptyState({ title, description }: { title: string; description: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4">
      <div className="bg-muted rounded-full p-6 mb-4">
        <FileText className="h-12 w-12 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-semibold text-center mb-2">{title}</h3>
      <p className="text-muted-foreground text-center max-w-md">{description}</p>
    </div>
  );
}

export function DocumentsList({
  data,
  loading = false,
  viewMode = 'grid',
  onViewModeChange,
  onPageChange,
  onPageSizeChange,
  onDocumentView,
  onDocumentDownload,
  onDocumentEdit,
  onDocumentShare,
  onDocumentDelete,
  showActions = true,
  emptyStateTitle = "No se encontraron documentos",
  emptyStateDescription = "No hay documentos que coincidan con los criterios de búsqueda actuales.",
}: DocumentsListProps) {
  const currentPage = data?.pagination.page || 1;
  const totalPages = data?.pagination.totalPages || 1;
  const total = data?.pagination.total || 0;
  const pageSize = data?.pagination.limit || 12;
  
  const startItem = ((currentPage - 1) * pageSize) + 1;
  const endItem = Math.min(currentPage * pageSize, total);

  const generatePaginationItems = () => {
    const items = [];
    const maxVisible = 5;
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) {
        items.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        items.push(1);
        items.push('ellipsis');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          items.push(i);
        }
      } else {
        items.push(1);
        items.push('ellipsis');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          items.push(i);
        }
        items.push('ellipsis');
        items.push(totalPages);
      }
    }
    
    return items;
  };

  return (
    <div className="space-y-6">
      {/* Header con controles */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="text-sm text-muted-foreground">
            {loading ? (
              <Skeleton className="h-4 w-32" />
            ) : total > 0 ? (
              `Mostrando ${startItem}-${endItem} de ${total} documentos`
            ) : (
              '0 documentos'
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {/* Tamaño de página */}
          {onPageSizeChange && (
            <Select
              value={pageSize.toString()}
              onValueChange={(value) => onPageSizeChange(parseInt(value))}
            >
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PAGE_SIZE_OPTIONS.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}

          {/* Modo de vista */}
          {onViewModeChange && (
            <div className="flex items-center border rounded-md">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                className="rounded-r-none"
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                className="rounded-l-none"
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Lista/Grid de documentos */}
      {loading ? (
        <div className={`grid gap-4 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {Array.from({ length: pageSize }).map((_, index) => (
            <DocumentSkeleton key={index} viewMode={viewMode} />
          ))}
        </div>
      ) : data?.documents && data.documents.length > 0 ? (
        <div className={`grid gap-4 ${
          viewMode === 'grid'
            ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
            : 'grid-cols-1'
        }`}>
          {data.documents.map((document) => (
            <DocumentCard
              key={document.id}
              document={document}
              onView={onDocumentView}
              onDownload={onDocumentDownload}
              onEdit={onDocumentEdit}
              onShare={onDocumentShare}
              onDelete={onDocumentDelete}
              showActions={showActions}
              compact={viewMode === 'list'}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          title={emptyStateTitle}
          description={emptyStateDescription}
        />
      )}

      {/* Paginación */}
      {data && totalPages > 1 && (
        <div className="flex items-center justify-center">
          <Pagination>
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage > 1) {
                      onPageChange?.(currentPage - 1);
                    }
                  }}
                  className={currentPage <= 1 ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
              
              {generatePaginationItems().map((item, index) => (
                <PaginationItem key={index}>
                  {item === 'ellipsis' ? (
                    <PaginationEllipsis />
                  ) : (
                    <PaginationLink
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        onPageChange?.(item as number);
                      }}
                      isActive={currentPage === item}
                    >
                      {item}
                    </PaginationLink>
                  )}
                </PaginationItem>
              ))}
              
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    if (currentPage < totalPages) {
                      onPageChange?.(currentPage + 1);
                    }
                  }}
                  className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : ''}
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      )}
    </div>
  );
}