"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Plus, Upload as UploadIcon, BarChart3, Users, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  DocumentUploader,
  DocumentFilters,
  DocumentsList,
  DocumentViewer,
  DocumentResponse,
  DocumentListResponse,
  DocumentSearchParams,
  DocumentStatsResponse,
  downloadDocument,
  searchDocuments,
  getDocumentStats,
  approveDocument,
  updateDocument,
  deleteDocument,
} from "@/components/documents";

export default function ComplexAdminDocumentsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  
  // Estados principales
  const [documentsData, setDocumentsData] = useState<DocumentListResponse>();
  const [statsData, setStatsData] = useState<DocumentStatsResponse>();
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
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
  const [activeTab, setActiveTab] = useState('documents');

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

  // Función para cargar estadísticas
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await getDocumentStats();
      setStatsData(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas.",
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  }, [toast]);

  // Cargar datos al montar y cuando cambien los parámetros
  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments(searchParams);
      if (activeTab === 'stats') {
        fetchStats();
      }
    }
  }, [authLoading, user, searchParams, activeTab, fetchDocuments, fetchStats]);

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

  const handleDocumentEdit = async (document: DocumentResponse) => {
    // TODO: Implementar modal de edición
    toast({
      title: "Información",
      description: "Funcionalidad de edición en desarrollo.",
    });
  };

  const handleDocumentDelete = async (document: DocumentResponse) => {
    if (!confirm(`¿Estás seguro de que quieres eliminar el documento "${document.name}"?`)) {
      return;
    }

    try {
      await deleteDocument(document.id);
      toast({
        title: "Éxito",
        description: `Documento "${document.name}" eliminado correctamente.`,
      });
      // Recargar la lista
      fetchDocuments(searchParams);
    } catch (error) {
      console.error("Error deleting document:", error);
      const description =
        error instanceof Error
          ? "Error al eliminar el documento: " + error.message
          : "Error al eliminar el documento.";
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

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
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
    return null;
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Gestión de Documentos</h1>
          <p className="text-muted-foreground mt-2">
            Administra todos los documentos del conjunto residencial
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
              maxFiles={10}
            />
          </DialogContent>
        </Dialog>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="documents" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Documentos
          </TabsTrigger>
          <TabsTrigger value="stats" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Estadísticas
          </TabsTrigger>
          <TabsTrigger value="approval" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Aprobaciones
          </TabsTrigger>
        </TabsList>

        {/* Tab: Documentos */}
        <TabsContent value="documents" className="space-y-6">
          <DocumentFilters
            onFiltersChange={handleFiltersChange}
            loading={loading}
            initialFilters={searchParams}
          />

          <DocumentsList
            data={documentsData}
            loading={loading}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
            onPageChange={handlePageChange}
            onPageSizeChange={handlePageSizeChange}
            onDocumentView={handleDocumentView}
            onDocumentDownload={handleDocumentDownload}
            onDocumentEdit={handleDocumentEdit}
            onDocumentDelete={handleDocumentDelete}
            showActions={true}
            emptyStateTitle="No se encontraron documentos"
            emptyStateDescription="No hay documentos disponibles que coincidan con los criterios de búsqueda actuales."
          />
        </TabsContent>

        {/* Tab: Estadísticas */}
        <TabsContent value="stats" className="space-y-6">
          {statsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="pb-2">
                    <div className="h-4 bg-muted rounded animate-pulse" />
                  </CardHeader>
                  <CardContent>
                    <div className="h-8 bg-muted rounded animate-pulse" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : statsData ? (
            <div className="space-y-6">
              {/* Métricas principales */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de documentos</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsData.totalDocuments}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Tamaño total</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{formatBytes(statsData.totalSize)}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de descargas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsData.totalDownloads}</div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium">Total de vistas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl font-bold">{statsData.totalViews}</div>
                  </CardContent>
                </Card>
              </div>

              {/* Documentos más populares */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Documentos más vistos</CardTitle>
                    <CardDescription>Los documentos con mayor número de visualizaciones</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {statsData.mostViewedDocuments.slice(0, 5).map((doc, index) => (
                        <div key={doc.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                          </div>
                          <Badge variant="secondary">{doc.viewCount} vistas</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Documentos más descargados</CardTitle>
                    <CardDescription>Los documentos con mayor número de descargas</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {statsData.mostDownloadedDocuments.slice(0, 5).map((doc, index) => (
                        <div key={doc.id} className="flex items-center justify-between">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium truncate">{doc.name}</p>
                          </div>
                          <Badge variant="secondary">{doc.downloadCount} descargas</Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Usuarios más activos */}
              <Card>
                <CardHeader>
                  <CardTitle>Usuarios más activos</CardTitle>
                  <CardDescription>Los usuarios que han subido más documentos</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {statsData.topUploaders.slice(0, 10).map((user, index) => (
                      <div key={user.userId} className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-sm font-medium">
                            {index + 1}
                          </div>
                          <div>
                            <p className="text-sm font-medium">{user.userName}</p>
                          </div>
                        </div>
                        <Badge variant="outline">{user.documentCount} documentos</Badge>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No se pudieron cargar las estadísticas.</p>
            </div>
          )}
        </TabsContent>

        {/* Tab: Aprobaciones */}
        <TabsContent value="approval" className="space-y-6">
          <DocumentFilters
            onFiltersChange={(filters) => handleFiltersChange({ ...filters, status: 'DRAFT' })}
            loading={loading}
            initialFilters={{ ...searchParams, status: 'DRAFT' }}
          />

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
            emptyStateTitle="No hay documentos pendientes de aprobación"
            emptyStateDescription="Todos los documentos han sido revisados y aprobados."
          />
        </TabsContent>
      </Tabs>

      {/* Visor de documentos */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          onDownload={handleDocumentDownload}
          onEdit={handleDocumentEdit}
          showActions={true}
        />
      )}
    </div>
  );
}