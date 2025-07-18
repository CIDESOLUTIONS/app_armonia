"use client";
import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import { getAssemblies, Assembly } from "@/services/assemblyService";
import Link from "next/link";

export default function ResidentAssembliesPage() {
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mis Asambleas</h1>

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
                  <Link href={`/resident-portal/assemblies/${assembly.id}`}>
                    <Button variant="ghost" size="sm" className="mr-2">
                      <Eye className="h-4 w-4" /> Ver Detalles
                    </Button>
                  </Link>
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