"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createVisitor } from "@/services/visitorService";

const formSchema = z.object({
  name: z.string().min(1, { message: "El nombre del visitante es requerido." }),
  documentType: z
    .string()
    .min(1, { message: "El tipo de documento es requerido." }),
  documentNumber: z
    .string()
    .min(1, { message: "El número de documento es requerido." }),
  visitedUnit: z
    .string()
    .min(1, { message: "La unidad a visitar es requerida." }),
  purpose: z.string().optional(),
  plate: z.string().optional(),
});

export default function ManualVisitorRegisterPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      documentType: "",
      documentNumber: "",
      visitedUnit: "",
      purpose: "",
      plate: "",
    } as BrandingFormValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (!user?.complexId) {
        toast({
          title: "Error",
          description: "Información de complejo no disponible.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const visitorData = {
        ...values,
        complexId: user.complexId,
        entryTime: new Date().toISOString(),
        status: "ACTIVE",
      };

      await createVisitor(visitorData);

      toast({
        title: "Éxito",
        description: "Visitante registrado manualmente.",
      });
      form.reset();
    } catch (error: unknown) {
      console.error("Error registering visitor manually:", error);
      toast({
        title: "Error",
        description:
          (error instanceof Error ? error.message : "Error al registrar visitante manualmente."),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || (user.role !== "RECEPTION" && user.role !== "SECURITY")) {
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
        Registro Manual de Visitantes
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre del Visitante</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Documento</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar tipo" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="CC">Cédula de Ciudadanía</SelectItem>
                      <SelectItem value="TI">Tarjeta de Identidad</SelectItem>
                      <SelectItem value="CE">Cédula de Extranjería</SelectItem>
                      <SelectItem value="PASSPORT">Pasaporte</SelectItem>
                      <SelectItem value="OTHER">Otro</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="documentNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Número de Documento</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="visitedUnit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unidad a Visitar</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propósito de la Visita (Opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="plate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Placa del Vehículo (Opcional)</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}{" "}
              Registrar Visitante
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
