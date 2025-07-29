"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  getCommonAreas,
  createReservation,
  getReservations,
  Reservation,
  CommonArea,
} from "@/services/reservationService";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const reservationSchema = z.object({
  commonAreaId: z.number().min(1, "El área común es requerida."),
  title: z.string().min(1, "El título es requerido."),
  description: z.string().optional(),
  startDateTime: z.string().min(1, "La fecha de inicio es requerida."),
  endDateTime: z.string().min(1, "La fecha de fin es requerida."),
  attendees: z.number().min(0).optional(),
  requiresPayment: z.boolean().optional(),
  paymentAmount: z.number().optional(),
});

type ReservationFormValues = z.infer<typeof reservationSchema>;

export default function ResidentReservationsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      commonAreaId: 0,
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

  const fetchCommonAreasAndReservations = useCallback(async () => {
    setLoading(true);
    try {
      const [commonAreasData, reservationsData] = await Promise.all([
        getCommonAreas(),
        getReservations({ userId: user?.id }),
      ]);
      setCommonAreas(commonAreasData);
      setReservations(reservationsData);
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
  }, [toast, user?.id]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchCommonAreasAndReservations();
    }
  }, [authLoading, user, fetchCommonAreasAndReservations]);

  const handleAddReservation = () => {
    reset({
      commonAreaId: 0,
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

  const onSubmit = async (data: ReservationFormValues) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Usuario no autenticado.",
        variant: "destructive",
      });
      return;
    }
    try {
      await createReservation({ ...data, userId: user.id });
      toast({
        title: "Éxito",
        description: "Reserva creada correctamente.",
      });
      setIsModalOpen(false);
      fetchCommonAreasAndReservations();
    } catch (error: Error) {
      console.error("Error saving reservation:", error);
      toast({
        title: "Error",
        description: "Error al guardar la reserva.",
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

  if (!user || user.role !== "RESIDENT") {
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
        Mis Reservas de Amenidades
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={handleAddReservation}>
          <PlusCircle className="mr-2 h-4 w-4" /> Realizar Nueva Reserva
        </Button>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Mis Reservas</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Área Común</TableHead>
                <TableHead>Título</TableHead>
                <TableHead>Inicio</TableHead>
                <TableHead>Fin</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Monto</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reservations.length > 0 ? (
                reservations.map((reservation) => (
                  <TableRow key={reservation.id}>
                    <TableCell>{reservation.commonArea.name}</TableCell>
                    <TableCell>{reservation.title}</TableCell>
                    <TableCell>
                      {new Date(reservation.startDateTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      {new Date(reservation.endDateTime).toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          reservation.status === "APPROVED"
                            ? "default"
                            : "secondary"
                        }
                      >
                        {reservation.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      ${reservation.paymentAmount?.toFixed(2) || "0.00"}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-5">
                    No tienes reservas registradas.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <div className="mt-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Calendario de Disponibilidad
        </h2>
        <div className="h-64 bg-gray-100 flex items-center justify-center rounded-md text-gray-500">
          Aquí irá el calendario de disponibilidad de amenidades.
        </div>
      </div>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Realizar Nueva Reserva</DialogTitle>
          </DialogHeader>
          <Form {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
              <FormField
                control={control}
                name="commonAreaId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Área Común</FormLabel>
                    <Select
                      onValueChange={(value) => field.onChange(parseInt(value))}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger>
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
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la Reserva</FormLabel>
                    <FormControl>
                      <Input placeholder="Ej: Cumpleaños de Juan" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción (Opcional)</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Detalles de la reserva"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="startDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha y Hora de Inicio</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="endDateTime"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Fecha y Hora de Fin</FormLabel>
                    <FormControl>
                      <Input type="datetime-local" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="attendees"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de Asistentes (Opcional)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        {...field}
                        onChange={(e) =>
                          field.onChange(parseInt(e.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={control}
                name="requiresPayment"
                render={({ field }) => (
                  <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow">
                    <FormControl>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                      />
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
                    <FormItem>
                      <FormLabel>Monto de Pago</FormLabel>
                      <FormControl>
                        <Input
                          type="number"
                          {...field}
                          onChange={(e) =>
                            field.onChange(parseFloat(e.target.value))
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              )}
              <Button
                type="submit"
                className="w-full"
                disabled={form.formState.isSubmitting}
              >
                {form.formState.isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}{" "}
                Solicitar Reserva
              </Button>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
