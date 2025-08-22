"use client";

import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Download,
  Share2,
  FileText,
  Eye,
  Calendar,
  User,
  Tag,
  ExternalLink,
  Clock,
  Shield,
  AlertTriangle,
  Info,
} from 'lucide-react';
import { DocumentResponse, DocumentType, AccessLevel, Priority } from '@/services/documentService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from '@/components/ui/use-toast';

interface DocumentViewerProps {
  document: DocumentResponse;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onDownload?: (document: DocumentResponse) => void;
  onShare?: (document: DocumentResponse) => void;
  onEdit?: (document: DocumentResponse) => void;
  showActions?: boolean;
}

const getDocumentTypeLabel = (type: DocumentType) => {
  const labels = {
    [DocumentType.REGULATION]: 'Reglamento',
    [DocumentType.MINUTES]: 'Actas',
    [DocumentType.MANUAL]: 'Manual',
    [DocumentType.CONTRACT]: 'Contrato',
    [DocumentType.INVOICE]: 'Factura',
    [DocumentType.REPORT]: 'Reporte',
    [DocumentType.FINANCIAL]: 'Financiero',
    [DocumentType.LEGAL]: 'Legal',
    [DocumentType.ASSEMBLY]: 'Asamblea',
    [DocumentType.BUDGET]: 'Presupuesto',
    [DocumentType.EXPENSE]: 'Gasto',
    [DocumentType.COMMUNICATION]: 'Comunicación',
    [DocumentType.CERTIFICATE]: 'Certificado',
    [DocumentType.OTHER]: 'Otro',
  };
  return labels[type] || labels[DocumentType.OTHER];
};

const getAccessLevelLabel = (accessLevel: AccessLevel) => {
  const labels = {
    [AccessLevel.PUBLIC]: 'Público',
    [AccessLevel.RESIDENTS]: 'Residentes',
    [AccessLevel.ADMIN]: 'Administradores',
    [AccessLevel.RESTRICTED]: 'Restringido',
  };
  return labels[accessLevel];
};

const getPriorityLabel = (priority: Priority) => {
  const labels = {
    [Priority.LOW]: 'Baja',
    [Priority.NORMAL]: 'Normal',
    [Priority.HIGH]: 'Alta',
    [Priority.URGENT]: 'Urgente',
  };
  return labels[priority];
};

const getPriorityColor = (priority: Priority) => {
  const colors = {
    [Priority.LOW]: 'bg-gray-100 text-gray-800',
    [Priority.NORMAL]: 'bg-blue-100 text-blue-800',
    [Priority.HIGH]: 'bg-orange-100 text-orange-800',
    [Priority.URGENT]: 'bg-red-100 text-red-800',
  };
  return colors[priority];
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

const isPreviewable = (mimeType: string) => {
  return [
    'application/pdf',
    'image/jpeg',
    'image/jpg',
    'image/png',
    'image/gif',
    'image/webp',
    'text/plain',
  ].includes(mimeType);
};

export function DocumentViewer({
  document,
  open,
  onOpenChange,
  onDownload,
  onShare,
  onEdit,
  showActions = true,
}: DocumentViewerProps) {
  const { toast } = useToast();
  const [previewError, setPreviewError] = useState(false);

  const isExpiring = document.expirationDate && 
    new Date(document.expirationDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const handleDownload = () => {
    onDownload?.(document);
  };

  const handleShare = () => {
    onShare?.(document);
  };

  const handleEdit = () => {
    onEdit?.(document);
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(document.url);
    toast({
      title: "Éxito",
      description: "Enlace copiado al portapapeles",
    });
  };

  const handleOpenInNewTab = () => {
    window.open(document.url, '_blank');
  };

  const renderPreview = () => {
    if (previewError) {
      return (
        <div className="flex flex-col items-center justify-center h-96 bg-muted/30 rounded-lg">
          <FileText className="h-16 w-16 text-muted-foreground mb-4" />
          <p className="text-muted-foreground text-center">
            No se puede mostrar la previsualización de este documento.
            <br />
            <Button variant="link" className="p-0 h-auto" onClick={handleOpenInNewTab}>
              Abrir en nueva pestaña
            </Button>
          </p>
        </div>
      );
    }

    if (document.mimeType === 'application/pdf') {
      return (
        <div className="w-full h-96 bg-muted/30 rounded-lg overflow-hidden">
          <iframe
            src={`${document.url}#toolbar=1&navpanes=1&scrollbar=1`}
            className="w-full h-full border-0"
            title={document.name}
            onError={() => setPreviewError(true)}
          />
        </div>
      );
    }

    if (document.mimeType.startsWith('image/')) {
      return (
        <div className="w-full bg-muted/30 rounded-lg p-4 flex items-center justify-center">
          <img
            src={document.url}
            alt={document.name}
            className="max-w-full max-h-96 object-contain rounded"
            onError={() => setPreviewError(true)}
          />
        </div>
      );
    }

    if (document.mimeType === 'text/plain') {
      return (
        <div className="w-full h-96 bg-muted/30 rounded-lg overflow-hidden">
          <iframe
            src={document.url}
            className="w-full h-full border-0"
            title={document.name}
            onError={() => setPreviewError(true)}
          />
        </div>
      );
    }

    return (
      <div className="flex flex-col items-center justify-center h-96 bg-muted/30 rounded-lg">
        <FileText className="h-16 w-16 text-muted-foreground mb-4" />
        <p className="text-muted-foreground text-center mb-4">
          Previsualización no disponible para este tipo de archivo.
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={handleOpenInNewTab}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Abrir en nueva pestaña
          </Button>
          <Button onClick={handleDownload}>
            <Download className="h-4 w-4 mr-2" />
            Descargar
          </Button>
        </div>
      </div>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <DialogTitle className="text-xl truncate pr-4">
                {document.name}
              </DialogTitle>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {getDocumentTypeLabel(document.type)}
                </Badge>
                {document.priority !== Priority.NORMAL && (
                  <Badge className={getPriorityColor(document.priority)}>
                    {getPriorityLabel(document.priority)}
                  </Badge>
                )}
                {isExpiring && (
                  <Badge variant="destructive" className="flex items-center gap-1">
                    <AlertTriangle className="h-3 w-3" />
                    Expira pronto
                  </Badge>
                )}
              </div>
            </div>
            
            {showActions && (
              <div className="flex items-center gap-2 flex-shrink-0">
                <Button variant="outline" size="sm" onClick={handleCopyLink}>
                  Copiar enlace
                </Button>
                {onShare && (
                  <Button variant="outline" size="sm" onClick={handleShare}>
                    <Share2 className="h-4 w-4 mr-2" />
                    Compartir
                  </Button>
                )}
                <Button size="sm" onClick={handleDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Descargar
                </Button>
              </div>
            )}
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-hidden">
          <Tabs defaultValue="preview" className="h-full flex flex-col">
            <TabsList className="grid w-full grid-cols-2 flex-shrink-0">
              <TabsTrigger value="preview" className="flex items-center gap-2">
                <Eye className="h-4 w-4" />
                Previsualización
              </TabsTrigger>
              <TabsTrigger value="details" className="flex items-center gap-2">
                <Info className="h-4 w-4" />
                Detalles
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="preview" className="flex-1 overflow-auto mt-4">
              {isPreviewable(document.mimeType) ? (
                renderPreview()
              ) : (
                <div className="flex flex-col items-center justify-center h-96 bg-muted/30 rounded-lg">
                  <FileText className="h-16 w-16 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground text-center mb-4">
                    Tipo de archivo no compatible con previsualización.
                  </p>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={handleOpenInNewTab}>
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Abrir en nueva pestaña
                    </Button>
                    <Button onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="details" className="flex-1 overflow-auto mt-4">
              <div className="space-y-6">
                {/* Información básica */}
                <div>
                  <h3 className="font-semibold mb-3">Información básica</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Nombre original:</span>
                      <p>{document.originalName}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Tamaño:</span>
                      <p>{formatFileSize(document.fileSize)}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Tipo MIME:</span>
                      <p>{document.mimeType}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Versión:</span>
                      <p>v{document.version}</p>
                    </div>
                  </div>
                </div>

                {/* Descripción */}
                {document.description && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Descripción</h3>
                      <p className="text-sm text-muted-foreground">{document.description}</p>
                    </div>
                  </>
                )}

                {/* Metadatos */}
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3">Metadatos</h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Categoría:</span>
                      <p>{document.category || 'Sin categoría'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Subcategoría:</span>
                      <p>{document.subcategory || 'Sin subcategoría'}</p>
                    </div>
                    <div>
                      <span className="font-medium text-muted-foreground">Idioma:</span>
                      <p>{document.language === 'es' ? 'Español' : document.language}</p>
                    </div>
                    <div className="flex items-center gap-1">
                      <Shield className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium text-muted-foreground">Acceso:</span>
                      <span>{getAccessLevelLabel(document.accessLevel)}</span>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                {document.tags && document.tags.length > 0 && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3 flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Tags
                      </h3>
                      <div className="flex flex-wrap gap-2">
                        {document.tags.map((tag, index) => (
                          <Badge key={index} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </>
                )}

                {/* Fechas importantes */}
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Fechas importantes
                  </h3>
                  <div className="grid grid-cols-1 gap-3 text-sm">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-muted-foreground">Subido:</span>
                      <span>
                        {formatDistanceToNow(new Date(document.createdAt), {
                          addSuffix: true,
                          locale: es,
                        })}
                      </span>
                    </div>
                    {document.updatedAt && new Date(document.updatedAt) > new Date(document.createdAt) && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground">Última modificación:</span>
                        <span>
                          {formatDistanceToNow(new Date(document.updatedAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    )}
                    {document.expirationDate && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground">Expira:</span>
                        <span className={isExpiring ? 'text-orange-600 font-medium' : ''}>
                          {formatDistanceToNow(new Date(document.expirationDate), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    )}
                    {document.lastAccessedAt && (
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground">Último acceso:</span>
                        <span>
                          {formatDistanceToNow(new Date(document.lastAccessedAt), {
                            addSuffix: true,
                            locale: es,
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Autor y estadísticas */}
                <Separator />
                <div>
                  <h3 className="font-semibold mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Autor y estadísticas
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="font-medium text-muted-foreground">Subido por:</span>
                      <p>{document.uploadedBy.name}</p>
                      <p className="text-xs text-muted-foreground">{document.uploadedBy.email}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground flex items-center gap-1">
                          <Eye className="h-3 w-3" />
                          Vistas:
                        </span>
                        <span>{document.viewCount}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="font-medium text-muted-foreground flex items-center gap-1">
                          <Download className="h-3 w-3" />
                          Descargas:
                        </span>
                        <span>{document.downloadCount}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Estado de aprobación */}
                {document.requiresApproval && (
                  <>
                    <Separator />
                    <div>
                      <h3 className="font-semibold mb-3">Estado de aprobación</h3>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant={document.approvalStatus === 'APPROVED' ? 'default' : 
                                  document.approvalStatus === 'REJECTED' ? 'destructive' : 'secondary'}
                        >
                          {document.approvalStatus === 'APPROVED' ? 'Aprobado' :
                           document.approvalStatus === 'REJECTED' ? 'Rechazado' : 'Pendiente'}
                        </Badge>
                        {document.approvedAt && (
                          <span className="text-sm text-muted-foreground">
                            {formatDistanceToNow(new Date(document.approvedAt), {
                              addSuffix: true,
                              locale: es,
                            })}
                          </span>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </DialogContent>
    </Dialog>
  );
}