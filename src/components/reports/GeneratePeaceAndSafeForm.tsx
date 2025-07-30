"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { generatePeaceAndSafePdf } from "@/services/reportService";
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
  residentId: z.number({ required_error: "El ID del residente es requerido." }),
});

export default function GeneratePeaceAndSafeForm() {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      residentId: undefined,
    } as BrandingFormValues,
  });

  const mutation = useMutation({
    mutationFn: (data: { residentId: number }) =>
      generatePeaceAndSafePdf(data.residentId),
    onSuccess: (data) => {
      const blob = new Blob([data], { type: "application/pdf" });
      const url = window.URL.createObjectURL(blob);
      window.open(url, "_blank");
      toast({ title: "Paz y Salvo generado con éxito" });
      closeModal();
    },
    onError: (error: unknown) => {
      toast({
        title: "Error al generar Paz y Salvo",
        description: (error instanceof Error ? error.message : "Ocurrió un error"),
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: { residentId: number }) => {
    mutation.mutate(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="residentId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>ID del Residente</FormLabel>
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
          {mutation.isLoading ? "Generando..." : "Generar Paz y Salvo"}
        </Button>
      </form>
    </Form>
  );
}
