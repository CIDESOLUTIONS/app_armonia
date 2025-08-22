"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Building2, FileText, TrendingUp, AlertTriangle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  DocumentViewer,
  DocumentResponse,
  DocumentStatsResponse,
  getDocumentStats,
  searchDocuments,
} from "@/components/documents";

export default function AdminDocumentsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  
  // Estados principales
  const [statsData, setStatsData] = useState<DocumentStatsResponse>();
  const [recentDocuments, setRecentDocuments] = useState<DocumentResponse[]>([]);
  const [pendingApprovals, setPendingApprovals] = useState<DocumentResponse[]>([]);
  const [expiringDocuments, setExpiringDocuments] = useState<DocumentResponse[]>([]);
  const [statsLoading, setStatsLoading] = useState(true);
  const [documentsLoading, setDocumentsLoading] = useState(true);
  
  // Estados de modales
  const [viewerOpen, setViewerOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<DocumentResponse | null>(null);

  // Función para cargar estadísticas globales
  const fetchStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const data = await getDocumentStats();
      setStatsData(data);
    } catch (error) {
      console.error("Error fetching stats:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las estadísticas globales.",
        variant: "destructive",
      });
    } finally {
      setStatsLoading(false);
    }
  }, [toast]);

  // Función para cargar documentos recientes
  const fetchRecentDocuments = useCallback(async () => {
    setDocumentsLoading(true);
    try {
      const [recentData, pendingData, expiringData] = await Promise.all([
        searchDocuments({ page: 1, limit: 10, sortBy: 'createdAt', sortOrder: 'desc' }),
        searchDocuments({ page: 1, limit: 10, status: 'DRAFT' }),
        searchDocuments({ page: 1, limit: 10, expiringSoon: true }),
      ]);
      
      setRecentDocuments(recentData.documents);
      setPendingApprovals(pendingData.documents);
      setExpiringDocuments(expiringData.documents);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos.",
        variant: "destructive",
      });
    } finally {
      setDocumentsLoading(false);
    }
  }, [toast]);

  // Cargar datos al montar
  useEffect(() => {
    if (!authLoading && user) {
      fetchStats();
      fetchRecentDocuments();
    }
  }, [authLoading, user, fetchStats, fetchRecentDocuments]);

  const handleDocumentView = (document: DocumentResponse) => {
    setSelectedDocument(document);
    setViewerOpen(true);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const getDocumentTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      'REGULATION': 'Reglamento',
      'MINUTES': 'Actas',
      'MANUAL': 'Manual',
      'CONTRACT': 'Contrato',
      'INVOICE': 'Factura',
      'REPORT': 'Reporte',
      'FINANCIAL': 'Financiero',
      'LEGAL': 'Legal',
      'ASSEMBLY': 'Asamblea',
      'BUDGET': 'Presupuesto',
      'EXPENSE': 'Gasto',
      'COMMUNICATION': 'Comunicación',
      'CERTIFICATE': 'Certificado',
      'OTHER': 'Otro',
    };
    return labels[type] || type;
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
          <h1 className="text-3xl font-bold text-gray-900">Dashboard de Documentos</h1>
          <p className="text-muted-foreground mt-2">
            Vista global del sistema de gestión documental
          </p>
        </div>
      </div>

      {/* Métricas principales */}
      {statsLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total de documentos</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.totalDocuments}</div>
              <p className="text-xs text-muted-foreground">
                {statsData.recentUploads} subidos esta semana
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Almacenamiento usado</CardTitle>
              <Building2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{formatBytes(statsData.totalSize)}</div>
              <p className="text-xs text-muted-foreground">
                Promedio: {formatBytes(statsData.averageSize)} por archivo
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Actividad total</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{statsData.totalViews + statsData.totalDownloads}</div>
              <p className="text-xs text-muted-foreground">
                {statsData.totalViews} vistas, {statsData.totalDownloads} descargas
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Documentos por expirar</CardTitle>
              <AlertTriangle className="h-4 w-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">{statsData.expiringDocuments}</div>
              <p className="text-xs text-muted-foreground">
                Requieren atención pronto
              </p>
            </CardContent>
          </Card>
        </div>
      ) : null}

      {/* Tabs con información detallada */}
      <Tabs defaultValue="recent" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="recent">Documentos recientes</TabsTrigger>
          <TabsTrigger value="pending">Pendientes de aprobación</TabsTrigger>
          <TabsTrigger value="expiring">Por expirar</TabsTrigger>
          <TabsTrigger value="popular">Más populares</TabsTrigger>
        </TabsList>

        {/* Documentos recientes */}
        <TabsContent value="recent">
          <Card>
            <CardHeader>
              <CardTitle>Documentos recientes</CardTitle>
              <CardDescription>
                Los últimos documentos subidos al sistema
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                      </div>
                      <div className="h-6 w-16 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : recentDocuments.length > 0 ? (
                <div className="space-y-3">
                  {recentDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleDocumentView(doc)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getDocumentTypeLabel(doc.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {doc.uploadedBy.name}
                          </span>
                        </div>
                      </div>
                      <div className="text-xs text-muted-foreground">
                        {new Date(doc.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay documentos recientes
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Pendientes de aprobación */}
        <TabsContent value="pending">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                Pendientes de aprobación
                {pendingApprovals.length > 0 && (
                  <Badge variant="secondary">{pendingApprovals.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Documentos que requieren revisión y aprobación
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                      </div>
                      <div className="h-6 w-20 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : pendingApprovals.length > 0 ? (
                <div className="space-y-3">
                  {pendingApprovals.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border rounded hover:bg-muted/50 cursor-pointer transition-colors"
                      onClick={() => handleDocumentView(doc)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getDocumentTypeLabel(doc.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {doc.uploadedBy.name}
                          </span>
                        </div>
                      </div>
                      <Badge variant="secondary">Pendiente</Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay documentos pendientes de aprobación
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Por expirar */}
        <TabsContent value="expiring">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-orange-500" />
                Documentos por expirar
                {expiringDocuments.length > 0 && (
                  <Badge variant="destructive">{expiringDocuments.length}</Badge>
                )}
              </CardTitle>
              <CardDescription>
                Documentos que expiran en los próximos 7 días
              </CardDescription>
            </CardHeader>
            <CardContent>
              {documentsLoading ? (
                <div className="space-y-3">
                  {Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center justify-between p-3 border rounded">
                      <div className="flex-1 space-y-2">
                        <div className="h-4 bg-muted rounded animate-pulse" />
                        <div className="h-3 bg-muted rounded animate-pulse w-2/3" />
                      </div>
                      <div className="h-6 w-24 bg-muted rounded animate-pulse" />
                    </div>
                  ))}
                </div>
              ) : expiringDocuments.length > 0 ? (
                <div className="space-y-3">
                  {expiringDocuments.map((doc) => (
                    <div
                      key={doc.id}
                      className="flex items-center justify-between p-3 border border-orange-200 bg-orange-50/50 rounded hover:bg-orange-100/50 cursor-pointer transition-colors"
                      onClick={() => handleDocumentView(doc)}
                    >
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{doc.name}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getDocumentTypeLabel(doc.type)}
                          </Badge>
                          <span className="text-xs text-muted-foreground">
                            {doc.uploadedBy.name}
                          </span>
                        </div>
                      </div>
                      <Badge variant="destructive" className="text-xs">
                        Expira {doc.expirationDate ? new Date(doc.expirationDate).toLocaleDateString() : 'pronto'}
                      </Badge>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">
                  No hay documentos próximos a expirar
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Más populares */}
        <TabsContent value="popular">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Más vistos</CardTitle>
                <CardDescription>Documentos con mayor número de visualizaciones</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                        <div className="h-4 w-16 bg-muted rounded animate-pulse ml-4" />
                      </div>
                    ))}
                  </div>
                ) : statsData?.mostViewedDocuments.length ? (
                  <div className="space-y-3">
                    {statsData.mostViewedDocuments.slice(0, 10).map((doc, index) => (
                      <div key={doc.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                        </div>
                        <Badge variant="secondary">{doc.viewCount} vistas</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No hay datos disponibles
                  </p>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Más descargados</CardTitle>
                <CardDescription>Documentos con mayor número de descargas</CardDescription>
              </CardHeader>
              <CardContent>
                {statsLoading ? (
                  <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="h-4 bg-muted rounded animate-pulse flex-1" />
                        <div className="h-4 w-20 bg-muted rounded animate-pulse ml-4" />
                      </div>
                    ))}
                  </div>
                ) : statsData?.mostDownloadedDocuments.length ? (
                  <div className="space-y-3">
                    {statsData.mostDownloadedDocuments.slice(0, 10).map((doc, index) => (
                      <div key={doc.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-3 flex-1 min-w-0">
                          <div className="w-6 h-6 bg-primary/10 rounded-full flex items-center justify-center text-xs font-medium">
                            {index + 1}
                          </div>
                          <p className="text-sm font-medium truncate">{doc.name}</p>
                        </div>
                        <Badge variant="secondary">{doc.downloadCount} descargas</Badge>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-center text-muted-foreground py-4">
                    No hay datos disponibles
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Visor de documentos */}
      {selectedDocument && (
        <DocumentViewer
          document={selectedDocument}
          open={viewerOpen}
          onOpenChange={setViewerOpen}
          showActions={false}
        />
      )}
    </div>
  );
}