"use client";

import React from 'react';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Download,
  Eye,
  Edit,
  Share2,
  MoreVertical,
  FileText,
  Calendar,
  User,
  Lock,
  Clock,
  AlertTriangle,
} from 'lucide-react';
import { DocumentResponse, DocumentType, AccessLevel, Priority } from '@/services/documentService';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

interface DocumentCardProps {
  document: DocumentResponse;
  onView?: (document: DocumentResponse) => void;
  onDownload?: (document: DocumentResponse) => void;
  onEdit?: (document: DocumentResponse) => void;
  onShare?: (document: DocumentResponse) => void;
  onDelete?: (document: DocumentResponse) => void;
  showActions?: boolean;
  compact?: boolean;
}

const getDocumentTypeColor = (type: DocumentType) => {
  const colors = {
    [DocumentType.REGULATION]: 'bg-blue-100 text-blue-800',
    [DocumentType.MINUTES]: 'bg-green-100 text-green-800',
    [DocumentType.MANUAL]: 'bg-purple-100 text-purple-800',
    [DocumentType.CONTRACT]: 'bg-orange-100 text-orange-800',
    [DocumentType.INVOICE]: 'bg-red-100 text-red-800',
    [DocumentType.REPORT]: 'bg-indigo-100 text-indigo-800',
    [DocumentType.FINANCIAL]: 'bg-yellow-100 text-yellow-800',
    [DocumentType.LEGAL]: 'bg-gray-100 text-gray-800',
    [DocumentType.ASSEMBLY]: 'bg-teal-100 text-teal-800',
    [DocumentType.BUDGET]: 'bg-pink-100 text-pink-800',
    [DocumentType.EXPENSE]: 'bg-amber-100 text-amber-800',
    [DocumentType.COMMUNICATION]: 'bg-cyan-100 text-cyan-800',
    [DocumentType.CERTIFICATE]: 'bg-emerald-100 text-emerald-800',
    [DocumentType.OTHER]: 'bg-slate-100 text-slate-800',
  };
  return colors[type] || colors[DocumentType.OTHER];
};

const getAccessLevelIcon = (accessLevel: AccessLevel) => {
  switch (accessLevel) {
    case AccessLevel.PUBLIC:
      return null;
    case AccessLevel.RESIDENTS:
      return <User className="h-3 w-3" />;
    case AccessLevel.ADMIN:
      return <Lock className="h-3 w-3" />;
    case AccessLevel.RESTRICTED:
      return <Lock className="h-3 w-3 text-red-500" />;
    default:
      return null;
  }
};

const getPriorityColor = (priority: Priority) => {
  const colors = {
    [Priority.LOW]: 'text-gray-500',
    [Priority.NORMAL]: 'text-blue-500',
    [Priority.HIGH]: 'text-orange-500',
    [Priority.URGENT]: 'text-red-500',
  };
  return colors[priority] || colors[Priority.NORMAL];
};

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

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

export function DocumentCard({
  document,
  onView,
  onDownload,
  onEdit,
  onShare,
  onDelete,
  showActions = true,
  compact = false,
}: DocumentCardProps) {
  const isExpiring = document.expirationDate && 
    new Date(document.expirationDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

  const handleView = () => {
    onView?.(document);
  };

  const handleDownload = () => {
    onDownload?.(document);
  };

  const handleEdit = () => {
    onEdit?.(document);
  };

  const handleShare = () => {
    onShare?.(document);
  };

  const handleDelete = () => {
    onDelete?.(document);
  };

  return (
    <Card className={`group hover:shadow-md transition-shadow ${
      compact ? 'p-3' : 'p-0'
    } ${
      isExpiring ? 'border-orange-200 bg-orange-50/30' : ''
    }`}>
      <CardContent className={compact ? 'p-0' : 'p-4 pb-2'}>
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-muted-foreground flex-shrink-0" />
              <h3 
                className="font-medium text-sm truncate cursor-pointer hover:text-primary"
                onClick={handleView}
                title={document.name}
              >
                {document.name}
              </h3>
              {isExpiring && (
                <AlertTriangle className="h-4 w-4 text-orange-500 flex-shrink-0" />
              )}
            </div>

            {/* Type and Access Level */}
            <div className="flex items-center gap-2 mb-2">
              <Badge 
                variant="secondary" 
                className={`text-xs ${getDocumentTypeColor(document.type)}`}
              >
                {getDocumentTypeLabel(document.type)}
              </Badge>
              
              {document.accessLevel !== AccessLevel.PUBLIC && (
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {getAccessLevelIcon(document.accessLevel)}
                  <span className="capitalize">{document.accessLevel.toLowerCase()}</span>
                </div>
              )}

              {document.priority !== Priority.NORMAL && (
                <div className={`flex items-center gap-1 text-xs ${
                  getPriorityColor(document.priority)
                }`}>
                  <Clock className="h-3 w-3" />
                  <span className="capitalize">{document.priority.toLowerCase()}</span>
                </div>
              )}
            </div>

            {/* Description */}
            {!compact && document.description && (
              <p className="text-xs text-muted-foreground mb-2 line-clamp-2">
                {document.description}
              </p>
            )}

            {/* Metadata */}
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1">
                <User className="h-3 w-3" />
                <span>{document.uploadedBy.name}</span>
              </div>
              
              <div className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                <span>
                  {formatDistanceToNow(new Date(document.createdAt), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
              
              <span>{formatFileSize(document.fileSize)}</span>
              
              {document.version > 1 && (
                <span>v{document.version}</span>
              )}
            </div>

            {/* Statistics */}
            {!compact && (document.viewCount > 0 || document.downloadCount > 0) && (
              <div className="flex items-center gap-4 text-xs text-muted-foreground mt-1">
                {document.viewCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Eye className="h-3 w-3" />
                    <span>{document.viewCount} vistas</span>
                  </div>
                )}
                {document.downloadCount > 0 && (
                  <div className="flex items-center gap-1">
                    <Download className="h-3 w-3" />
                    <span>{document.downloadCount} descargas</span>
                  </div>
                )}
              </div>
            )}

            {/* Expiration Warning */}
            {isExpiring && (
              <div className="flex items-center gap-1 mt-2 text-xs text-orange-600">
                <AlertTriangle className="h-3 w-3" />
                <span>
                  Expira {formatDistanceToNow(new Date(document.expirationDate!), {
                    addSuffix: true,
                    locale: es,
                  })}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          {showActions && (
            <div className="ml-2 flex-shrink-0">
              {compact ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleView}>
                      <Eye className="h-4 w-4 mr-2" />
                      Ver
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleDownload}>
                      <Download className="h-4 w-4 mr-2" />
                      Descargar
                    </DropdownMenuItem>
                    {onEdit && (
                      <DropdownMenuItem onClick={handleEdit}>
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </DropdownMenuItem>
                    )}
                    {onShare && (
                      <DropdownMenuItem onClick={handleShare}>
                        <Share2 className="h-4 w-4 mr-2" />
                        Compartir
                      </DropdownMenuItem>
                    )}
                    {onDelete && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem
                          onClick={handleDelete}
                          className="text-destructive focus:text-destructive"
                        >
                          Eliminar
                        </DropdownMenuItem>
                      </>
                    )}
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button variant="ghost" size="sm" onClick={handleView}>
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={handleDownload}>
                    <Download className="h-4 w-4" />
                  </Button>
                  {onShare && (
                    <Button variant="ghost" size="sm" onClick={handleShare}>
                      <Share2 className="h-4 w-4" />
                    </Button>
                  )}
                  {(onEdit || onDelete) && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        {onEdit && (
                          <DropdownMenuItem onClick={handleEdit}>
                            <Edit className="h-4 w-4 mr-2" />
                            Editar
                          </DropdownMenuItem>
                        )}
                        {onDelete && (
                          <>
                            {onEdit && <DropdownMenuSeparator />}
                            <DropdownMenuItem
                              onClick={handleDelete}
                              className="text-destructive focus:text-destructive"
                            >
                              Eliminar
                            </DropdownMenuItem>
                          </>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
      
      {!compact && document.tags && document.tags.length > 0 && (
        <CardFooter className="pt-0 pb-3 px-4">
          <div className="flex flex-wrap gap-1">
            {document.tags.slice(0, 3).map((tag, index) => (
              <Badge key={index} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
            {document.tags.length > 3 && (
              <Badge variant="outline" className="text-xs">
                +{document.tags.length - 3}
              </Badge>
            )}
          </div>
        </CardFooter>
      )}
    </Card>
  );
}