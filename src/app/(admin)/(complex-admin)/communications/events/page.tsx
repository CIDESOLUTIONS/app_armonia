"use client";

"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import {
  getCommunityEvents,
  createCommunityEvent,
  updateCommunityEvent,
  deleteCommunityEvent,
} from "@/services/communityEventService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";

interface CommunityEvent {
  id: number;
  title: string;
  description?: string;
  startDateTime: string;
  endDateTime: string;
  location: string;
  isPublic: boolean;
  createdBy: number;
  createdAt: string;
}

export default function CommunityEventsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [events, setEvents] = useState<CommunityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentEvent, setCurrentEvent] = useState<CommunityEvent | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    startDateTime: "",
    endDateTime: "",
    location: "",
    isPublic: true,
  });

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getCommunityEvents();
      setEvents(data);
    } catch (error) {
      console.error("Error fetching community events:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los eventos comunitarios.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchEvents();
    }
  }, [authLoading, user, fetchEvents]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value, type } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]:
        type === "checkbox" ? (e.target as HTMLInputElement).checked : value,
    }));
  };

  const handleAddEvent = () => {
    setCurrentEvent(null);
    setFormData({
      title: "",
      description: "",
      startDateTime: new Date().toISOString().slice(0, 16),
      endDateTime: new Date().toISOString().slice(0, 16),
      location: "",
      isPublic: true,
    });
    setIsModalOpen(true);
  };

  const handleEditEvent = (event: CommunityEvent) => {
    setCurrentEvent(event);
    setFormData({
      title: event.title,
      description: event.description || "",
      startDateTime: new Date(event.startDateTime).toISOString().slice(0, 16),
      endDateTime: new Date(event.endDateTime).toISOString().slice(0, 16),
      location: event.location,
      isPublic: event.isPublic,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (currentEvent) {
        await updateCommunityEvent(currentEvent.id, formData);
        toast({
          title: "Éxito",
          description: "Evento comunitario actualizado correctamente.",
        });
      } else {
        await createCommunityEvent(formData);
        toast({
          title: "Éxito",
          description: "Evento comunitario creado correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchEvents();
    } catch (error) {
      console.error("Error saving community event:", error);
      toast({
        title: "Error",
        description: "Error al guardar el evento comunitario.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEvent = async (id: number) => {
    if (
      confirm("¿Estás seguro de que quieres eliminar este evento comunitario?")
    ) {
      try {
        await deleteCommunityEvent(id);
        toast({
          title: "Éxito",
          description: "Evento comunitario eliminado correctamente.",
        });
        fetchEvents();
      } catch (error) {
        console.error("Error deleting community event:", error);
        toast({
          title: "Error",
          description: "Error al eliminar el evento comunitario.",
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
    <>
      {" "}
      {/* React.Fragment para envolver múltiples elementos raíz */}
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Gestión de Eventos Comunitarios
        </h1>

        <div className="flex justify-end mb-4">
          <Button onClick={handleAddEvent}>
            <PlusCircle className="mr-2 h-4 w-4" /> Crear Evento
          </Button>
        </div>

        <div className="bg-white shadow-md rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Público</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {events.length > 0 ? (
                events.map((event) => (
                  <TableRow key={event.id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{event.description}</TableCell>
                    <TableCell>
                      {new Date(event.startDateTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(event.endDateTime).toLocaleString()}
                    </TableCell>
                    <TableCell>{event.location}</TableCell>
                    <TableCell>
                      {event.isPublic ? (
                        <Badge variant="default">Sí</Badge>
                      ) : (
                        <Badge variant="destructive">No</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleEditEvent(event)}
                        className="mr-2"
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteEvent(event.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-5">
                    No hay eventos comunitarios registrados.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentEvent ? "Editar Evento" : "Crear Nuevo Evento"}
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
              <Label htmlFor="description" className="text-right">
                Descripción
              </Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="startDateTime" className="text-right">
                Fecha y Hora de Inicio
              </Label>
              <Input
                id="startDateTime"
                name="startDateTime"
                type="datetime-local"
                value={formData.startDateTime}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="endDateTime" className="text-right">
                Fecha y Hora de Fin
              </Label>
              <Input
                id="endDateTime"
                name="endDateTime"
                type="datetime-local"
                value={formData.endDateTime}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="location" className="text-right">
                Ubicación
              </Label>
              <Input
                id="location"
                name="location"
                value={formData.location}
                onChange={handleInputChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="isPublic"
                name="isPublic"
                checked={formData.isPublic}
                onCheckedChange={(checked) =>
                  handleInputChange({
                    target: { name: "isPublic", value: checked },
                  } as React.ChangeEvent<HTMLInputElement>)
                }
              />
              <Label htmlFor="isPublic">Público</Label>
            </div>
            <DialogFooter>
              <Button type="submit">
                {currentEvent ? "Guardar Cambios" : "Crear Evento"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
