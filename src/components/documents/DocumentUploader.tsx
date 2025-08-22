"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Upload, X, File, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { uploadDocument, DocumentType, AccessLevel, Priority, CreateDocumentData } from '@/services/documentService';
import { useToast } from '@/components/ui/use-toast';

interface DocumentUploaderProps {
  onUploadComplete?: (document: any) => void;
  onUploadError?: (error: string) => void;
  allowMultiple?: boolean;
  maxFiles?: number;
}

const DOCUMENT_TYPES = [
  { value: DocumentType.REGULATION, label: 'Reglamento' },
  { value: DocumentType.MINUTES, label: 'Actas' },
  { value: DocumentType.MANUAL, label: 'Manual' },
  { value: DocumentType.CONTRACT, label: 'Contrato' },
  { value: DocumentType.INVOICE, label: 'Factura' },
  { value: DocumentType.REPORT, label: 'Reporte' },
  { value: DocumentType.FINANCIAL, label: 'Financiero' },
  { value: DocumentType.LEGAL, label: 'Legal' },
  { value: DocumentType.ASSEMBLY, label: 'Asamblea' },
  { value: DocumentType.BUDGET, label: 'Presupuesto' },
  { value: DocumentType.EXPENSE, label: 'Gasto' },
  { value: DocumentType.COMMUNICATION, label: 'Comunicación' },
  { value: DocumentType.CERTIFICATE, label: 'Certificado' },
  { value: DocumentType.OTHER, label: 'Otro' },
];

const ACCESS_LEVELS = [
  { value: AccessLevel.PUBLIC, label: 'Público' },
  { value: AccessLevel.RESIDENTS, label: 'Residentes' },
  { value: AccessLevel.ADMIN, label: 'Administradores' },
  { value: AccessLevel.RESTRICTED, label: 'Restringido' },
];

const PRIORITIES = [
  { value: Priority.LOW, label: 'Baja' },
  { value: Priority.NORMAL, label: 'Normal' },
  { value: Priority.HIGH, label: 'Alta' },
  { value: Priority.URGENT, label: 'Urgente' },
];

interface FileWithMetadata {
  file: File;
  metadata: CreateDocumentData;
  uploading: boolean;
  progress: number;
  error?: string;
}

export function DocumentUploader({ 
  onUploadComplete, 
  onUploadError, 
  allowMultiple = false, 
  maxFiles = 5 
}: DocumentUploaderProps) {
  const { toast } = useToast();
  const [files, setFiles] = useState<FileWithMetadata[]>([]);
  const [isUploading, setIsUploading] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    const newFiles = acceptedFiles.slice(0, allowMultiple ? maxFiles : 1).map(file => ({
      file,
      metadata: {
        name: file.name.split('.')[0],
        originalName: file.name,
        type: DocumentType.OTHER,
        accessLevel: AccessLevel.RESIDENTS,
        priority: Priority.NORMAL,
        isPublic: false,
        requiresApproval: false,
        language: 'es',
      } as CreateDocumentData,
      uploading: false,
      progress: 0,
    }));
    
    if (allowMultiple) {
      setFiles(prev => [...prev, ...newFiles].slice(0, maxFiles));
    } else {
      setFiles(newFiles);
    }
  }, [allowMultiple, maxFiles]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.jpg', '.jpeg', '.png'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/msword': ['.doc'],
    },
    maxSize: 5 * 1024 * 1024, // 5MB
    multiple: allowMultiple,
  });

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const updateFileMetadata = (index: number, updates: Partial<CreateDocumentData>) => {
    setFiles(prev => prev.map((file, i) => 
      i === index ? { ...file, metadata: { ...file.metadata, ...updates } } : file
    ));
  };

  const uploadFile = async (fileData: FileWithMetadata, index: number) => {
    try {
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, uploading: true, progress: 0 } : f
      ));

      // Simular progreso (en un caso real, esto vendría del progreso real del upload)
      const progressInterval = setInterval(() => {
        setFiles(prev => prev.map((f, i) => 
          i === index ? { ...f, progress: Math.min(f.progress + 10, 90) } : f
        ));
      }, 100);

      const result = await uploadDocument(fileData.metadata, fileData.file);
      
      clearInterval(progressInterval);
      
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, uploading: false, progress: 100 } : f
      ));

      onUploadComplete?.(result);
      
      toast({
        title: "Éxito",
        description: `Documento "${result.name}" subido correctamente.`,
      });

      // Remover el archivo de la lista después de un breve delay
      setTimeout(() => removeFile(index), 1000);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
      setFiles(prev => prev.map((f, i) => 
        i === index ? { ...f, uploading: false, error: errorMessage } : f
      ));
      onUploadError?.(errorMessage);
      toast({
        title: "Error",
        description: `Error al subir "${fileData.metadata.name}": ${errorMessage}`,
        variant: "destructive",
      });
    }
  };

  const uploadAllFiles = async () => {
    setIsUploading(true);
    try {
      for (let i = 0; i < files.length; i++) {
        if (!files[i].uploading && !files[i].error) {
          await uploadFile(files[i], i);
        }
      }
    } finally {
      setIsUploading(false);
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="space-y-6">
      {/* Área de Drop */}
      <Card className="p-6">
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors ${
            isDragActive
              ? 'border-primary bg-primary/5'
              : 'border-muted-foreground/25 hover:border-primary/50'
          }`}
        >
          <input {...getInputProps()} />
          <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
          {isDragActive ? (
            <p className="text-lg font-medium">Suelta los archivos aquí...</p>
          ) : (
            <div>
              <p className="text-lg font-medium mb-2">
                Arrastra archivos aquí o haz clic para seleccionar
              </p>
              <p className="text-sm text-muted-foreground">
                Formatos soportados: PDF, DOC, DOCX, XLS, XLSX, JPG, PNG (Máx. 5MB)
              </p>
              {allowMultiple && (
                <p className="text-sm text-muted-foreground mt-1">
                  Máximo {maxFiles} archivos
                </p>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Lista de archivos */}
      {files.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">
              Archivos seleccionados ({files.length})
            </h3>
            {files.some(f => !f.uploading && !f.error) && (
              <Button onClick={uploadAllFiles} disabled={isUploading}>
                Subir todos los archivos
              </Button>
            )}
          </div>

          {files.map((fileData, index) => (
            <Card key={index} className="p-4">
              <div className="space-y-4">
                {/* Header del archivo */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <File className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="font-medium">{fileData.file.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {formatFileSize(fileData.file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {!fileData.uploading && (
                      <Button
                        size="sm"
                        onClick={() => uploadFile(fileData, index)}
                        disabled={!!fileData.error}
                      >
                        Subir
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeFile(index)}
                      disabled={fileData.uploading}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                {/* Progreso */}
                {fileData.uploading && (
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Subiendo...</span>
                      <span>{fileData.progress}%</span>
                    </div>
                    <Progress value={fileData.progress} className="h-2" />
                  </div>
                )}

                {/* Error */}
                {fileData.error && (
                  <Alert variant="destructive">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>{fileData.error}</AlertDescription>
                  </Alert>
                )}

                {/* Metadatos del documento */}
                {!fileData.uploading && fileData.progress < 100 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                    <div className="space-y-2">
                      <Label htmlFor={`name-${index}`}>Nombre del documento</Label>
                      <Input
                        id={`name-${index}`}
                        value={fileData.metadata.name}
                        onChange={(e) => updateFileMetadata(index, { name: e.target.value })}
                        placeholder="Nombre del documento"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`type-${index}`}>Tipo de documento</Label>
                      <Select
                        value={fileData.metadata.type}
                        onValueChange={(value) => updateFileMetadata(index, { type: value as DocumentType })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar tipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {DOCUMENT_TYPES.map((type) => (
                            <SelectItem key={type.value} value={type.value}>
                              {type.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 space-y-2">
                      <Label htmlFor={`description-${index}`}>Descripción</Label>
                      <Textarea
                        id={`description-${index}`}
                        value={fileData.metadata.description || ''}
                        onChange={(e) => updateFileMetadata(index, { description: e.target.value })}
                        placeholder="Descripción del documento (opcional)"
                        rows={2}
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`access-${index}`}>Nivel de acceso</Label>
                      <Select
                        value={fileData.metadata.accessLevel}
                        onValueChange={(value) => updateFileMetadata(index, { accessLevel: value as AccessLevel })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar acceso" />
                        </SelectTrigger>
                        <SelectContent>
                          {ACCESS_LEVELS.map((level) => (
                            <SelectItem key={level.value} value={level.value}>
                              {level.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor={`priority-${index}`}>Prioridad</Label>
                      <Select
                        value={fileData.metadata.priority}
                        onValueChange={(value) => updateFileMetadata(index, { priority: value as Priority })}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar prioridad" />
                        </SelectTrigger>
                        <SelectContent>
                          {PRIORITIES.map((priority) => (
                            <SelectItem key={priority.value} value={priority.value}>
                              {priority.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="md:col-span-2 flex items-center space-x-4">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`public-${index}`}
                          checked={fileData.metadata.isPublic}
                          onCheckedChange={(checked) => 
                            updateFileMetadata(index, { isPublic: checked as boolean })
                          }
                        />
                        <Label htmlFor={`public-${index}`}>Documento público</Label>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`approval-${index}`}
                          checked={fileData.metadata.requiresApproval}
                          onCheckedChange={(checked) => 
                            updateFileMetadata(index, { requiresApproval: checked as boolean })
                          }
                        />
                        <Label htmlFor={`approval-${index}`}>Requiere aprobación</Label>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}