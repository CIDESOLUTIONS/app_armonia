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
  name: z.string().min(1, { message: "El nombre es requerido." }),
  description: z.string().optional(),
  capacity: z.number().optional(),
});

export default function CommonAreaForm({ commonArea }) {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: commonArea || {
      name: "",
      description: "",
      capacity: undefined,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) =>
      commonArea
        ? inventoryService.updateCommonArea(commonArea.id, data)
        : inventoryService.createCommonArea(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["commonAreas"]);
      toast({
        title: `Área común ${commonArea ? "actualizada" : "creada"} con éxito`,
      });
      closeModal();
    },
    onError: () => {
      toast({
        title: `Error al ${commonArea ? "actualizar" : "crear"} el área común`,
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
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre</FormLabel>
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
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="capacity"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Capacidad</FormLabel>
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
