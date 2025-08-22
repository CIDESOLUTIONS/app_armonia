"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Plus, Upload as UploadIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import {
  DocumentUploader,
  DocumentFilters,
  DocumentsList,
  DocumentViewer,
  DocumentResponse,
  DocumentListResponse,
  DocumentSearchParams,
  downloadDocument,
  searchDocuments,
} from "@/components/documents";

export default function DocumentsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  
  // Estados principales
  const [documentsData, setDocumentsData] = useState<DocumentListResponse>();
  const [loading, setLoading] = useState(true);
  const [searchParams, setSearchParams] = useState<DocumentSearchParams>({
    page: 1,
    limit: 12,
    sortBy: 'createdAt',
    sortOrder: 'desc',
  });
  
  // Estados de modales
  const [uploadModalOpen, setUploadModalOpen] = useState(false);
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null);
  
  // Estado de vista
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Función para cargar documentos
  const fetchDocuments = useCallback(async (params: DocumentSearchParams) => {
    setLoading(true);
    try {
      const data = await searchDocuments(params);
      setDocumentsData(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      const description =
        error instanceof Error
          ? "No se pudieron cargar los documentos: " + error.message
          : "No se pudieron cargar los documentos.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  // Cargar documentos al montar y cuando cambien los parámetros
  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments(searchParams);
    }
  }, [authLoading, user, searchParams, fetchDocuments]);

  // Handlers
  const handleFiltersChange = (newFilters: DocumentSearchParams) => {
    setSearchParams(newFilters);
  };

  const handlePageChange = (page: number) => {
    setSearchParams(prev => ({ ...prev, page }));
  };

  const handlePageSizeChange = (pageSize: number) => {
    setSearchParams(prev => ({ ...prev, limit: pageSize, page: 1 }));
  };

  const handleDocumentView = (document: DocumentResponse) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  const handleDocumentDownload = async (document: DocumentResponse) => {
    try {
      await downloadDocument(document.id);
      toast({
        title: "Éxito",
        description: `Documento "${document.name}" descargado correctamente.`,
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      const description =
        error instanceof Error
          ? "Error al descargar el documento: " + error.message
          : "Error al descargar el documento.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    }
  };

  const handleUploadComplete = (document: DocumentResponse) => {
    toast({
      title: "Éxito",
      description: `Documento "${document.name}" subido correctamente.`,
    });
    setUploadModalOpen(false);
    // Recargar la lista de documentos
    fetchDocuments(searchParams);
  };

  const handleUploadError = (error: string) => {
    toast({
      title: "Error",
      description: `Error al subir documento: ${error}`,
      variant: "destructive",
    });
  };

  // Loading state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  // No user state
  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Documentos</h1>
          <p className="text-muted-foreground mt-2">
            Gestiona y accede a todos los documentos del conjunto residencial
          </p>
        </div>
        
        <Dialog open={uploadModalOpen} onOpenChange={setUploadModalOpen}>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus className="h-4 w-4" />
              Subir documento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <UploadIcon className="h-5 w-5" />
                Subir nuevo documento
              </DialogTitle>
            </DialogHeader>
            <DocumentUploader
              onUploadComplete={handleUploadComplete}
              onUploadError={handleUploadError}
              allowMultiple={true}
              maxFiles={5}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Filtros */}
      <DocumentFilters
        onFiltersChange={handleFiltersChange}
        loading={loading}
        initialFilters={searchParams}
      />

      {/* Lista de documentos */}
      <DocumentsList
        data={documentsData}
        loading={loading}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onPageChange={handlePageChange}
        onPageSizeChange={handlePageSizeChange}
        onDocumentView={handleDocumentView}
        onDocumentDownload={handleDocumentDownload}
        showActions={true}
        emptyStateTitle="No se encontraron documentos"
        emptyStateDescription="No hay documentos disponibles que coincidan con los criterios de búsqueda actuales. Prueba ajustando los filtros o sube un nuevo documento."
      />

      {/* Visor de documentos */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          onDownload={handleDocumentDownload}
          showActions={true}
        />
      )}
    </div>
  );
}