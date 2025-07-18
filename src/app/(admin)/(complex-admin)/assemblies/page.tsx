import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2, Eye, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { getAssemblies, deleteAssembly, Assembly, generateMeetingMinutes } from "@/services/assemblyService";
import Link from "next/link";

export default function AdminAssembliesPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [assemblies, setAssemblies] = useState<Assembly[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAssemblies = async () => {
    setLoading(true);
    try {
      const data = await getAssemblies();
      setAssemblies(data);
    } catch (error) {
      console.error("Error fetching assemblies:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las asambleas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssemblies();
  }, []);

  const handleDeleteAssembly = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta asamblea?")) return;
    try {
      await deleteAssembly(id);
      toast({
        title: "Éxito",
        description: "Asamblea eliminada correctamente.",
      });
      fetchAssemblies();
    } catch (error) {
      console.error("Error deleting assembly:", error);
      toast({
        title: "Error",
        description: "Error al eliminar asamblea.",
        variant: "destructive",
      });
    }
  };

  const handleGenerateMinutes = async (assemblyId: number, title: string) => {
    try {
      const pdfBlob = await generateMeetingMinutes(assemblyId);
      const url = window.URL.createObjectURL(pdfBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `Acta_Asamblea_${title.replace(/\s/g, '_')}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
      toast({
        title: "Éxito",
        description: "Acta generada y descargada correctamente.",
      });
    } catch (error) {
      console.error("Error generating meeting minutes:", error);
      toast({
        title: "Error",
        description: "Error al generar el acta de la asamblea.",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de Asambleas</h1>

      <div className="flex justify-end mb-4">
        <Link href="/admin/assemblies/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Asamblea
          </Button>
        </Link>
      </div>

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Título</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {assemblies.length > 0 ? (
            assemblies.map((assembly) => (
              <TableRow key={assembly.id}>
                <TableCell>{assembly.title}</TableCell>
                <TableCell>{new Date(assembly.scheduledDate).toLocaleDateString()}</TableCell>
                <TableCell>{assembly.type}</TableCell>
                <TableCell><Badge>{assembly.status}</Badge></TableCell>
                <TableCell>
                  <Link href={`/admin/assemblies/${assembly.id}`}>
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Eye className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Link href={`/admin/assemblies/${assembly.id}/edit`}>
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Edit className="h-4 w-4" />
                    </Button>
                  </Link>
                  <Button variant="ghost" size="sm" onClick={() => handleDeleteAssembly(assembly.id)} className="mr-2">
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm" onClick={() => handleGenerateMinutes(assembly.id, assembly.title)}>
                    <Download className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={5} className="text-center">
                No hay asambleas registradas.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}