"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import {
  getAssemblies,
  deleteAssembly,
  generateMeetingMinutes,
} from "@/services/assemblyService";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface Assembly {
  id: number;
  title: string;
  description: string;
  scheduledDate: string;
  location: string;
  status: "SCHEDULED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
}

export default function AssembliesPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(true);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [assemblyToDelete, setAssemblyToDelete] = useState<number | null>(null);

  const fetchAssemblies = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getAssemblies();
      setAssemblies(data);
    } catch (error) {
      console.error("Error fetching assemblies:", error);
      const description =
        error instanceof Error
          ? "No se pudieron cargar las asambleas: " + error.message
          : "No se pudieron cargar las asambleas.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAssemblies();
    }
  }, [authLoading, user, fetchAssemblies]);

  const handleDeleteAssembly = (id: number) => {
    setAssemblyToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeleteAssembly = async () => {
    if (assemblyToDelete === null) return;
    try {
      await deleteAssembly(assemblyToDelete);
      toast({
        title: "Éxito",
        description: "Asamblea eliminada correctamente.",
      });
      fetchAssemblies();
    } catch (error) {
      console.error("Error deleting assembly:", error);
      const description =
        error instanceof Error
          ? "Error al eliminar la asamblea: " + error.message
          : "Error al eliminar la asamblea.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setAssemblyToDelete(null);
    }
  };

  const handleGenerateMinutes = async (assemblyId: number) => {
    try {
      const pdfBlob = await generateMeetingMinutes(assemblyId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `acta_asamblea_${assemblyId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Éxito",
        description: "Acta generada y descargada correctamente.",
      });
    } catch (error) {
      console.error("Error generating minutes:", error);
      const description =
        error instanceof Error
          ? "Error al generar el acta: " + error.message
          : "Error al generar el acta.";
      toast({
        title: "Error",
        description,
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

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN")) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            No tienes permisos para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">
          Gestión de Asambleas
        </h1>
        <Link href="/complex-admin/assemblies/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Asamblea
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Fecha Programada</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assemblies.length > 0 ? (
              assemblies.map((assembly) => (
                <TableRow key={assembly.id}>
                  <TableCell>{assembly.title}</TableCell>
                  <TableCell>
                    {new Date(assembly.scheduledDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{assembly.location}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        assembly.status === "SCHEDULED"
                          ? "default"
                          : assembly.status === "IN_PROGRESS"
                            ? "secondary"
                            : "outline"
                      }
                    >
                      {assembly.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Link
                      href={`/complex-admin/assemblies/${assembly.id}/view`}
                    >
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link
                      href={`/complex-admin/assemblies/${assembly.id}/edit`}
                    >
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteAssembly(assembly.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleGenerateMinutes(assembly.id)}
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-5">
                  No hay asambleas registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Eliminación</DialogTitle>
            <DialogDescription>
              ¿Estás seguro de que quieres eliminar esta asamblea? Esta acción
              no se puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
            >
              Cancelar
            </Button>
            <Button onClick={confirmDeleteAssembly}>Eliminar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
