"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2, FileText } from "lucide-react";
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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import {
  getDigitalLogs,
  createDigitalLog,
  updateDigitalLog,
  deleteDigitalLog,
} from "@/services/digitalLogService";

interface DigitalLog {
  id: number;
  title: string;
  content: string;
  logDate: string;
  createdBy: number;
  createdByName: string;
}

export default function DigitalLogsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [logs, setLogs] = useState<DigitalLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentLog, setCurrentLog] = useState<DigitalLog | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    logDate: new Date().toISOString().slice(0, 16),
  });

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getDigitalLogs();
      setLogs(data);
    } catch (error) {
      console.error("Error fetching digital logs:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las minutas digitales.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchLogs();
    }
  }, [authLoading, user, fetchLogs]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleAddLog = () => {
    setCurrentLog(null);
    setFormData({
      title: "",
      content: "",
      logDate: new Date().toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const handleEditLog = (log: DigitalLog) => {
    setCurrentLog(log);
    setFormData({
      title: log.title,
      content: log.content,
      logDate: new Date(log.logDate).toISOString().slice(0, 16),
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentLog) {
        await updateDigitalLog(currentLog.id, formData);
        toast({
          title: "Éxito",
          description: "Minuta digital actualizada correctamente.",
        });
      } else {
        await createDigitalLog(formData);
        toast({
          title: "Éxito",
          description: "Minuta digital creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchLogs();
    } catch (error) {
      console.error("Error saving digital log:", error);
      toast({
        title: "Error",
        description: "Error al guardar la minuta digital.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteLog = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta minuta digital?")) {
      try {
        await deleteDigitalLog(id);
        toast({
          title: "Éxito",
          description: "Minuta digital eliminada correctamente.",
        });
        fetchLogs();
      } catch (error) {
        console.error("Error deleting digital log:", error);
        toast({
          title: "Error",
          description: "Error al eliminar la minuta digital.",
          variant: "destructive",
        });
      }
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Gestión de Minutas Digitales
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddLog}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Minuta
        </Button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead>Creado Por</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {logs.length > 0 ? (
              logs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.title}</TableCell>
                  <TableCell>
                    {new Date(log.logDate).toLocaleString()}
                  </TableCell>
                  <TableCell>{log.createdByName}</TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleEditLog(log)}
                      className="mr-2"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteLog(log.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-5">
                  No hay minutas digitales registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentLog
                ? "Editar Minuta Digital"
                : "Crear Nueva Minuta Digital"}
            </DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="title" className="text-right">
                Título
              </Label>
              <Input
                id="title"
                name="title"
                value={formData.title}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="content" className="text-right">
                Contenido
              </Label>
              <Textarea
                id="content"
                name="content"
                value={formData.content}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="logDate" className="text-right">
                Fecha y Hora
              </Label>
              <Input
                id="logDate"
                name="logDate"
                type="datetime-local"
                value={formData.logDate}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentLog ? "Guardar Cambios" : "Crear Minuta"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
