"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { createReservation, CommonArea } from "@/services/reservationService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useModal } from "@/hooks/useModal";
import { toast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/store/authStore";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  commonAreaId: z.number({ required_error: "El área común es requerida." }),
  title: z.string().min(1, { message: "El título es requerido." }),
  description: z.string().optional(),
  startDateTime: z
    .string()
    .min(1, { message: "La fecha de inicio es requerida." }),
  endDateTime: z.string().min(1, { message: "La fecha de fin es requerida." }),
  attendees: z.number().min(0).optional(),
});

type ResidentReservationFormValues = z.infer<typeof formSchema>;

interface ResidentReservationFormProps {
  commonArea?: CommonArea;
  onReservationSuccess: () => void;
}

export default function ResidentReservationForm({
  commonArea,
  onReservationSuccess,
}: ResidentReservationFormProps) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();

  const form = useForm<ResidentReservationFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      commonAreaId: commonArea?.id || undefined,
      title: "",
      description: "",
      startDateTime: "",
      endDateTime: "",
      attendees: 0,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => createReservation({ ...data, userId: user!.id }),
    onSuccess: () => {
      queryClient.invalidateQueries(["residentReservations"]);
      toast({ title: "Reserva creada con éxito" });
      onReservationSuccess();
      closeModal();
    },
    onError: (error: unknown) => {
      toast({
        title: "Error al crear la reserva",
        description:
          error instanceof Error ? error.message : "Ocurrió un error",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ResidentReservationFormValues) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        {!commonArea && (
          <FormField
            control={form.control}
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
                    {/* You'll need to fetch common areas here if not passed as prop */}
                    {/* For now, assuming commonArea is always passed or fetched elsewhere */}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Título</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
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
          control={form.control}
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
          control={form.control}
          name="attendees"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Asistentes</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(parseInt(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={mutation.isLoading}>
          {mutation.isLoading ? "Creando..." : "Crear Reserva"}
        </Button>
      </form>
    </Form>
  );
}
