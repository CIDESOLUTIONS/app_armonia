"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { getDocuments, downloadDocument } from "@/services/documentService";

interface Document {
  id: number;
  title: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadDate: string;
  url: string;
}

export default function DocumentsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDocuments = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDocuments();
      setDocuments(data);
    } catch (error) {
      console.error("Error fetching documents:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los documentos.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchDocuments();
    }
  }, [authLoading, user, fetchDocuments]);

  const handleDownload = async (id: number, fileName: string) => {
    try {
      const blob = await downloadDocument(id);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Éxito",
        description: "Documento descargado correctamente.",
      });
    } catch (error) {
      console.error("Error downloading document:", error);
      toast({
        title: "Error",
        description: "Error al descargar el documento.",
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Documentos</h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Nombre de Archivo</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Tamaño</TableHead>
              <TableHead>Fecha de Subida</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {documents.length > 0 ? (
              documents.map((doc) => (
                <TableRow key={doc.id}>
                  <TableCell>{doc.title}</TableCell>
                  <TableCell>{doc.fileName}</TableCell>
                  <TableCell>{doc.fileType}</TableCell>
                  <TableCell>{(doc.fileSize / 1024).toFixed(2)} KB</TableCell>
                  <TableCell>
                    {new Date(doc.uploadDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDownload(doc.id, doc.fileName)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-5">
                  No hay documentos disponibles.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
