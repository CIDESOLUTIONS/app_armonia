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
  const [_isModalOpen, setIsModalOpen] = useState(false);
  const [_currentEvent, setCurrentEvent] = useState<CommunityEvent | null>(
    null,
  );
  const [_formData, setFormData] = useState({
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

  const _handleInputChange = (
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
      if (_currentEvent) {
        await updateCommunityEvent(_currentEvent.id, _formData);
        toast({
          title: "Éxito",
          description: "Evento comunitario actualizado correctamente.",
        });
      } else {
        await createCommunityEvent(_formData);
        toast({
          title: "Éxito",
          description: "Evento comunitario creado correctamente.",
        });
      }
      _setIsModalOpen(false);
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
  );
}
