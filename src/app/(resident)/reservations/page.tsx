"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle, Edit, Trash2, Eye, DollarSign, Calendar as CalendarIcon, Clock, MapPin } from "lucide-react";
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
  getReservations,
  createReservation,
  updateReservation,
  deleteReservation,
  getCommonAreas,
  checkAvailability,
  Reservation,
  CommonArea,
} from "@/services/reservationService";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reservationSchema, ReservationFormValues } from "@/validators/reservation-schema";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday, parseISO, isBefore, isAfter } from "date-fns";
import { es } from "date-fns/locale";
import { Checkbox } from "@/components/ui/checkbox";

export default function ResidentReservationsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentReservation, setCurrentReservation] = useState<Reservation | null>(null);
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const form = useForm<ReservationFormValues>({
    resolver: zodResolver(reservationSchema),
    defaultValues: {
      commonAreaId: 0,
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      attendees: 1,
      requiresPayment: false,
      paymentAmount: 0,
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    watch,
    setValue,
    setError,
    clearErrors,
    formState: { isSubmitting },
  } = form;

  const selectedCommonAreaId = watch("commonAreaId");
  const selectedCommonArea = commonAreas.find(area => area.id === selectedCommonAreaId);
  const startDateTime = watch("startDateTime");
  const endDateTime = watch("endDateTime");

  const fetchReservationsAndCommonAreas = useCallback(async () => {
    setLoading(true);
    try {
      const fetchedReservations = await getReservations();
      setReservations(fetchedReservations);

      const fetchedCommonAreas = await getCommonAreas();
      setCommonAreas(fetchedCommonAreas);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las reservas o áreas comunes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchReservationsAndCommonAreas();
    }
  }, [authLoading, user, fetchReservationsAndCommonAreas]);

  const handleAddReservation = (date?: Date) => {
    setCurrentReservation(null);
    reset({
      commonAreaId: 0,
      title: "",
      description: "",
      startDateTime: date ? format(date, "yyyy-MM-dd'T'HH:mm") : "",
      endDateTime: date ? format(date, "yyyy-MM-dd'T'HH:mm") : "",
      attendees: 1,
      requiresPayment: false,
      paymentAmount: 0,
    });
    setIsModalOpen(true);
  };

  const handleEditReservation = (reservation: Reservation) => {
    setCurrentReservation(reservation);
    reset({
      commonAreaId: reservation.commonAreaId,
      title: reservation.title,
      description: reservation.description || "",
      startDateTime: format(new Date(reservation.startDateTime), "yyyy-MM-dd'T'HH:mm"),
      endDateTime: format(new Date(reservation.endDateTime), "yyyy-MM-dd'T'HH:mm"),
      attendees: reservation.attendees || 1,
      requiresPayment: reservation.requiresPayment || false,
      paymentAmount: reservation.paymentAmount || 0,
    });
    setIsModalOpen(true);
  };

  const onSubmit = async (data: ReservationFormValues) => {
    try {
      if (!user?.id) {
        toast({ title: "Error", description: "Usuario no autenticado." });
        return;
      }

      // Validaciones adicionales de frontend
      if (selectedCommonArea) {
        const start = parseISO(data.startDateTime);
        const end = parseISO(data.endDateTime);
        const opening = parseISO(`2000-01-01T${selectedCommonArea.openingTime}`);
        const closing = parseISO(`2000-01-01T${selectedCommonArea.closingTime}`);

        if (isBefore(start, opening) || isAfter(start, closing) || isBefore(end, opening) || isAfter(end, closing)) {
          setError("startDateTime", { type: "manual", message: "La reserva debe estar dentro del horario de apertura y cierre del área común." });
          setError("endDateTime", { type: "manual", message: "La reserva debe estar dentro del horario de apertura y cierre del área común." });
          return;
        }
      }

      const availability = await checkAvailability(
        data.commonAreaId,
        data.startDateTime,
        data.endDateTime,
      );

      if (!availability.available) {
        setError("startDateTime", { type: "manual", message: availability.message || "El área común no está disponible en este horario." });
        setError("endDateTime", { type: "manual", message: availability.message || "El área común no está disponible en este horario." });
        return;
      }

      const payload = {
        ...data,
        userId: user.id,
      };

      if (currentReservation) {
        await updateReservation(currentReservation.id, payload);
        toast({
          title: "Éxito",
          description: "Reserva actualizada correctamente.",
        });
      } else {
        await createReservation(payload);
        toast({
          title: "Éxito",
          description: "Reserva creada correctamente.",
        });
      }
      setIsModalOpen(false);
      fetchReservationsAndCommonAreas();
    } catch (error) {
      console.error("Error saving reservation:", error);
      toast({
        title: "Error",
        description: "Error al guardar la reserva.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteReservation = async (id: number) => {
    if (!confirm("¿Estás seguro de que quieres eliminar esta reserva?")) return;
    try {
      await deleteReservation(id);
      toast({
        title: "Éxito",
        description: "Reserva eliminada correctamente.",
      });
      fetchReservationsAndCommonAreas();
    } catch (error) {
      console.error("Error deleting reservation:", error);
      toast({
        title: "Error",
        description: "Error al eliminar la reserva.",
        variant: "destructive",
      });
    }
  };

  const daysInMonth = eachDayOfInterval({
    start: startOfMonth(currentMonth),
    end: endOfMonth(currentMonth),
  });

  const getReservationsForDay = (day: Date) => {
    return reservations.filter(
      (res) =>
        isSameDay(new Date(res.startDateTime), day) ||
        (new Date(res.startDateTime) <= day && new Date(res.endDateTime) >= day),
    );
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Mis Reservas de Áreas Comunes
      </h1>

      <div className="flex justify-between items-center mb-4">
        <Button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}>
          Anterior
        </Button>
        <h2 className="text-xl font-bold">
          {format(currentMonth, "MMMM yyyy", { locale: es })}
        </h2>
        <Button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}>
          Siguiente
        </Button>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"].map((day, index) => (
          <div key={index} className="text-center font-bold">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: new Date(daysInMonth[0]).getDay() }).map(
          (_, index) => (
            <div key={`empty-${index}`} className="h-24 p-1 border rounded-md bg-gray-50"></div>
          ),
        )}
        {daysInMonth.map((day) => {
          const dayReservations = getReservationsForDay(day);
          return (
            <div
              key={day.toISOString()}
              className={`h-24 p-1 border rounded-md cursor-pointer hover:bg-gray-100 overflow-hidden ${
                isToday(day) ? "border-blue-500 border-2" : ""
              }`}
              onClick={() => handleAddReservation(day)}
            >
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">
                  {format(day, "d")}
                </span>
                {dayReservations.length > 0 && (
                  <Badge>{dayReservations.length}</Badge>
                )}
              </div>
              <div className="space-y-1 mt-1">
                {dayReservations.slice(0, 2).map((res) => (
                  <div
                    key={res.id}
                    className="text-xs truncate bg-blue-100 text-blue-800 rounded px-1"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditReservation(res);
                    }}
                  >
                    {res.title}
                  </div>
                ))}
                {dayReservations.length > 2 && (
                  <div className="text-xs text-gray-500">
                    +{dayReservations.length - 2} más
                  </div>
                )}
              </div>
            </div>
          );
        })}
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
                      onValueChange={(value) => {
                        field.onChange(parseInt(value));
                        // Reset payment amount if common area changes
                        setValue("paymentAmount", 0);
                      }}
                      value={field.value ? String(field.value) : ""}
                    >
                      <FormControl>
                        <SelectTrigger className="col-span-3">
                          <SelectValue placeholder="Selecciona un área común" />
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
              {selectedCommonArea && selectedCommonArea.rulesOfUse && (
                <div className="col-span-full p-3 border rounded-md bg-gray-50 text-sm">
                  <h4 className="font-semibold mb-1">Reglas de Uso:</h4>
                  <p className="whitespace-pre-wrap">{selectedCommonArea.rulesOfUse}</p>
                  <FormField
                    control={control}
                    name="acceptRules"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4 shadow mt-2">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                        <div className="space-y-1 leading-none">
                          <FormLabel>He leído y acepto las reglas de uso.</FormLabel>
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              )}
              <FormField
                control={control}
                name="title"
                render={({ field }) => (
                  <FormItem className="grid grid-cols-4 items-center gap-4">
                    <FormLabel className="text-right">Título</FormLabel>
                    <FormControl>
                      <Input id="title" {...field} className="col-span-3" />
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
                      <Textarea id="description" {...field} className="col-span-3" />
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
                      <Input id="startDateTime" type="datetime-local" {...field} className="col-span-3" />
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
                      <Input id="endDateTime" type="datetime-local" {...field} className="col-span-3" />
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
                      <Input id="attendees" type="number" {...field} onChange={(e) => field.onChange(parseInt(e.target.value))} className="col-span-3" />
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
                        <Input id="paymentAmount" type="number" {...field} onChange={(e) => field.onChange(parseFloat(e.target.value))} className="col-span-3" />
                      </FormControl>
                      <FormMessage className="col-span-full text-right" />
                    </FormItem>
                  )}
                />
              )}
              <DialogFooter>
                {currentReservation && (
                  <Button
                    variant="destructive"
                    onClick={() => handleDeleteReservation(currentReservation.id)}
                    type="button"
                  >
                    Eliminar
                  </Button>
                )}
                <Button type="submit" disabled={isSubmitting || (selectedCommonArea && selectedCommonArea.rulesOfUse && !form.watch("acceptRules"))}>
                  {isSubmitting ? (
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