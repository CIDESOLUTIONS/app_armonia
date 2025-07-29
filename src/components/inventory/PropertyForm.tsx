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
  unitNumber: z
    .string()
    .min(1, { message: "El número de unidad es requerido." }),
  type: z.string().min(1, { message: "El tipo es requerido." }),
  status: z.string().min(1, { message: "El estado es requerido." }),
  ownerId: z.number().optional(),
});

export default function PropertyForm({ property }) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: property || {
      unitNumber: "",
      type: "",
      status: "",
      ownerId: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      property
        ? inventoryService.updateProperty(property.id, data)
        : inventoryService.createProperty(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
      toast({
        title: `Inmueble ${property ? "actualizado" : "creado"} con éxito`,
      });
      closeModal();
    },
    onError: () => {
      toast({
        title: `Error al ${property ? "actualizar" : "crear"} el inmueble`,
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
          name="unitNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Número de Unidad</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Estado</FormLabel>
              <FormControl>
                <Input {...field} />
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
