"use client";

"use client";
import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Filter, Loader2, PlusCircle, Eye, Edit, Trash2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getPQRs, deletePQR } from "@/services/pqrService";

interface PQR {
  id: number;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "REJECTED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  reportedById: number;
  reportedByName: string; // Para mostrar en la tabla
  assignedToId?: number;
  assignedToName?: string; // Para mostrar en la tabla
  createdAt: string;
  updatedAt: string;
}

export default function PQRListPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [pqrs, setPqrs] = useState<PQR[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    status: "",
    priority: "",
    search: "",
  });
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [pqrToDelete, setPqrToDelete] = useState<number | null>(null);

  const fetchPQRs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPQRs(filters);
      setPqrs(data);
    } catch (error) {
      console.error("Error fetching PQRs:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las PQRs.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [filters, toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchPQRs();
    }
  }, [authLoading, user, fetchPQRs]);

  const handleFilterChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeletePQR = (id: number) => {
    setPqrToDelete(id);
    setShowDeleteDialog(true);
  };

  const confirmDeletePQR = async () => {
    if (pqrToDelete === null) return;
    try {
      await deletePQR(pqrToDelete);
      toast({
        title: "Éxito",
        description: "PQR eliminada correctamente.",
      });
      fetchPQRs();
    } catch (error) {
      console.error("Error deleting PQR:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la PQR.",
        variant: "destructive",
      });
    } finally {
      setShowDeleteDialog(false);
      setPqrToDelete(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (
    !user ||
    (user.role !== "ADMIN" &&
      user.role !== "COMPLEX_ADMIN" &&
      user.role !== "STAFF")
  ) {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Gestión de PQR</h1>

      <div className="flex justify-between items-center mb-4">
        <div className="flex space-x-4">
          <Input
            type="text"
            placeholder="Buscar por asunto o descripción..."
            name="search"
            value={filters.search}
            onChange={handleFilterChange}
            className="w-64"
          />
          <select
            name="status"
            value={filters.status}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="">Todos los estados</option>
            <option value="OPEN">Abierta</option>
            <option value="IN_PROGRESS">En Progreso</option>
            <option value="CLOSED">Cerrada</option>
            <option value="REJECTED">Rechazada</option>
          </select>
          <select
            name="priority"
            value={filters.priority}
            onChange={handleFilterChange}
            className="p-2 border rounded-md"
          >
            <option value="">Todas las prioridades</option>
            <option value="LOW">Baja</option>
            <option value="MEDIUM">Media</option>
            <option value="HIGH">Alta</option>
          </select>
          <Button onClick={fetchPQRs}>
            <Filter className="mr-2 h-4 w-4" /> Aplicar Filtros
          </Button>
        </div>
        <Link href="/admin/pqr/create">
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear PQR
          </Button>
        </Link>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Asunto</TableHead>
              <TableHead>Reportado Por</TableHead>
              <TableHead>Asignado A</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Prioridad</TableHead>
              <TableHead>Fecha Creación</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {pqrs.length > 0 ? (
              pqrs.map((pqr) => (
                <TableRow key={pqr.id}>
                  <TableCell>{pqr.subject}</TableCell>
                  <TableCell>{pqr.reportedByName}</TableCell>
                  <TableCell>{pqr.assignedToName || "N/A"}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pqr.status === "OPEN"
                          ? "destructive"
                          : pqr.status === "IN_PROGRESS"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {pqr.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        pqr.priority === "HIGH"
                          ? "destructive"
                          : pqr.priority === "MEDIUM"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {pqr.priority}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(pqr.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Link href={`/admin/pqr/${pqr.id}/view`}>
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/pqr/${pqr.id}/edit`}>
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeletePQR(pqr.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-5">
                  No hay PQRs registradas.
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
              ¿Estás seguro de que quieres eliminar esta PQR? Esta acción no se
              puede deshacer.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteDialog(false)}>Cancelar</Button>
            <Button onClick={confirmDeletePQR}>
              Eliminar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
