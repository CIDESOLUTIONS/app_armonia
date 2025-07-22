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
  createReservation,
  updateReservation,
  getCommonAreas,
  Reservation,
  CommonArea,
} from "@/services/reservationService";
import { getResidents } from "@/services/residentService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";

const reservationSchema = z.object({
  commonAreaId: z.number().min(1, "El área común es requerida."),
  userId: z.number().min(1, "El usuario es requerido."),
  title: z.string().min(1, "El título es requerido."),
  description: z.string().optional(),
  startDateTime: z.string().min(1, "La fecha de inicio es requerida."),
  endDateTime: z.string().min(1, "La fecha de fin es requerida."),
  attendees: z.number().min(0).optional(),
  requiresPayment: z.boolean().optional(),
  paymentAmount: z.number().optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

interface ResidentOption {
  id: number;
  name: string;
}

export default function ReservationsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);
  const [residents, setResidents] = useState<ResidentOption[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] =
    useState<Reservation | null>(null);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      commonAreaId: 0,
      userId: 0,
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      attendees: 0,
      requiresPayment: false,
      paymentAmount: 0,
    },
  });

  const { handleSubmit, control, reset } = form;

  const fetchReservationsAndData = useCallback(async () => {
    setLoading(true);
    try {
      const [reservationsData, commonAreasData, residentsData] = await Promise.all([
        getReservations(),
        getCommonAreas(),
        getResidents(),
      ]);
      setReservations(reservationsData);
      setCommonAreas(commonAreasData);
      setResidents(residentsData.map((r) => ({ id: r.id, name: r.name })));
    } catch (error: Error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los datos de reservas.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchReservationsAndData();
    }
  }, [authLoading, user, fetchReservationsAndData]);

  const handleAddReservation = () => {
    setCurrentReservation(null);
    reset({
      commonAreaId: 0,
      userId: 0,
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      attendees: 0,
      requiresPayment: false,
      paymentAmount: 0,
    });
    setIsModalOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setCurrentReservation(reservation);
    reset({
      commonAreaId: reservation.commonAreaId,
      userId: reservation.userId,
      title: reservation.title,
      description: reservation.description || "",
      startDateTime: reservation.startDateTime.slice(0, 16),
      endDateTime: reservation.endDateTime.slice(0, 16),
      attendees: reservation.attendees || 0,
      requiresPayment: reservation.requiresPayment || false,
      paymentAmount: reservation.paymentAmount || 0,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ReservationFormValues) => {
    try {
      if (currentReservation) {
        await updateReservation(currentReservation.id, data);
        toast({
          title: "Éxito",
          description: "Reserva actualizada correctamente.",
        });
      } else {
        await createReservation(data);
        toast({
          title: "Éxito",
          description: "Reserva creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchReservationsAndData();
    } catch (error: Error) {
      console.error("Error saving reservation:", error);
      toast({
        title: "Error",
        description: "Error al guardar la reserva.",
        variant: "destructive",
      });
    }
  };

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
      fetchReservationsAndData();
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
        fetchReservationsAndData();
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
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="commonAreaId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Área Común</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 p-2 border rounded-md">
                          <SelectValue placeholder="Seleccionar Área Común" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {commonAreas.map((area) => (
                          <SelectItem key={area.id} value={String(area.id)}>
                            {area.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="userId"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Usuario</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3 p-2 border rounded-md">
                          <SelectValue placeholder="Seleccionar Usuario" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {residents.map((resident) => (
                          <SelectItem key={resident.id} value={String(resident.id)}>
                            {resident.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Título</FormLabel>
                    <FormControl>
                      <Input className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Descripción</FormLabel>
                    <FormControl>
                      <Textarea className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Inicio</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Fin</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" className="col-span-3" {...field} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="attendees"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Asistentes</FormLabel>
                    <FormControl>
                      <Input type="number" className="col-span-3" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} />
                    </FormControl>
                    <FormMessage className="col-span-full text-right" />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="requiresPayment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                    </FormControl>
                    <div className="space-y-1 leading-none">
                      <FormLabel>Requiere Pago</FormLabel>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {form.watch("requiresPayment") && (
                <FormField
                  control={control}
                  name="paymentAmount"
                  render={({ field }) => (
                    <FormItem className="grid grid-cols-4 items-center gap-4">
                      <FormLabel className="text-right">Monto de Pago</FormLabel>
                      <FormControl>
                        <Input type="number" className="col-span-3" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} />
                      </FormControl>
                      <FormMessage className="col-span-full text-right" />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                <Button type="submit" disabled={form.formState.isSubmitting}>
                  {form.formState.isSubmitting ? (
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  ) : null}{" "}
                  {currentReservation ? "Guardar Cambios" : "Crear Reserva"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}