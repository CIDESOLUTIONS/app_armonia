"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { inventoryService } from "@/services/inventory.service";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

const formSchema = z.object({
  licensePlate: z.string().min(1, { message: "La placa es requerida." }),
  brand: z.string().min(1, { message: "La marca es requerida." }),
  model: z.string().min(1, { message: "El modelo es requerido." }),
  residentId: z.number(),
});

export default function VehicleForm({ vehicle }) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: vehicle || {
      licensePlate: "",
      brand: "",
      model: "",
      residentId: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      vehicle
        ? inventoryService.updateVehicle(vehicle.id, data)
        : inventoryService.createVehicle(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["vehicles"]);
      toast({
        title: `Vehículo ${vehicle ? "actualizado" : "creado"} con éxito`,
      });
      closeModal();
    },
    onError: () => {
      toast({
        title: `Error al ${vehicle ? "actualizar" : "crear"} el vehículo`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="licensePlate"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placa</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="brand"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Marca</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="model"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Modelo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="residentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID de Residente</FormLabel>
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
          {mutation.isLoading ? "Guardando..." : "Guardar"}
        </Button>
      </form>
    </Form>
  );
}
