"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
  Trash2,
  CheckCircle,
  XCircle,
  Eye,
  CalendarDays,
  PlusCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { useToast } from "@/components/ui/use-toast";
import {
  getReservations,
  updateReservationStatus,
  deleteReservation,
  Reservation,
} from "@/services/reservationService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";

export default function ReservationsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] =
    useState<Reservation | null>(null);

  const handleAddReservation = () => {
    setCurrentReservation(null);
    // Aquí puedes inicializar un formulario vacío si usas react-hook-form
    setIsModalOpen(true);
  };

  const fetchReservations = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getReservations();
      setReservations(data);
    } catch (error: Error) {
      console.error("Error fetching reservations:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchReservations();
    }
  }, [authLoading, user, fetchReservations]);

  const handleUpdateStatus = async (
    id: number,
    status: "APPROVED" | "REJECTED",
  ) => {
    try {
      await updateReservationStatus(id, status);
      toast({
        title: "Éxito",
        description: `Reserva ${status === "APPROVED" ? "aprobada" : "rechazada"} correctamente.`,
      });
      fetchReservations();
    } catch (error: Error) {
      console.error("Error updating reservation status:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el estado de la reserva.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReservation = async (id: number) => {
    if (confirm("¿Estás seguro de que quieres eliminar esta reserva?")) {
      try {
        await deleteReservation(id);
        toast({
          title: "Éxito",
          description: "Reserva eliminada correctamente.",
        });
        fetchReservations();
      } catch (error: Error) {
        console.error("Error deleting reservation:", error);
        toast({
          title: "Error",
          description: "Error al eliminar la reserva.",
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
        Gestión de Reservas
      </h1>

      <div className="flex justify-between items-center mb-4">
        <Link href="/admin/amenities">
          <Button variant="outline">
            <CalendarDays className="mr-2 h-4 w-4" /> Gestionar Áreas Comunes
          </Button>
        </Link>
        <Button onClick={handleAddReservation}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Reserva
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Calendario de Reservas (Placeholder)</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md text-gray-500">
            Aquí irá el calendario de reservas
          </div>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Reservas Pendientes y Activas
      </h2>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full leading-normal">
          <thead>
            <tr>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Área Común
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Usuario
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Título
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Inicio
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Fin
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                Estado
              </th>
              <th className="px-5 py-3 border-b-2 border-gray-200 bg-gray-100"></th>
            </tr>
          </thead>
          <tbody>
            {reservations.length > 0 ? (
              reservations.map((reservation) => (
                <tr key={reservation.id}>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {reservation.commonArea.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {reservation.user.name}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {reservation.title}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(reservation.startDateTime).toLocaleString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    {new Date(reservation.endDateTime).toLocaleString()}
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm">
                    <Badge
                      variant={
                        reservation.status === "APPROVED"
                          ? "default"
                          : reservation.status === "PENDING"
                            ? "secondary"
                            : "destructive"
                      }
                    >
                      {reservation.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-right">
                    <Link href={`/admin/reservations/${reservation.id}`}>
                      <Button variant="ghost" size="sm" className="mr-2">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    {reservation.status === "PENDING" && (
                      <>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(reservation.id, "APPROVED")
                          }
                          className="mr-2"
                        >
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() =>
                            handleUpdateStatus(reservation.id, "REJECTED")
                          }
                          className="mr-2"
                        >
                          <XCircle className="h-4 w-4 text-red-600" />
                        </Button>
                      </>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleDeleteReservation(reservation.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-5 border-b border-gray-200 bg-white text-sm text-center"
                >
                  No hay reservas registradas.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>
              {currentReservation ? "Editar Reserva" : "Crear Nueva Reserva"}
            </DialogTitle>
          </DialogHeader>
          {/* Aquí irá el formulario de creación/edición de reservas */}
          <div className="py-4">
            <p>Formulario de reserva en construcción...</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsModalOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit">Guardar</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}