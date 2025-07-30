"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  getResidentialComplexById,
  updateResidentialComplex,
} from "@/services/residentialComplexService";
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

const formSchema = z.object({
  logoUrl: z
    .string()
    .url("Debe ser una URL válida")
    .optional()
    .or(z.literal("")),
  primaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Formato de color inválido (ej: #RRGGBB)",
    )
    .optional()
    .or(z.literal("")),
  secondaryColor: z
    .string()
    .regex(
      /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
      "Formato de color inválido (ej: #RRGGBB)",
    )
    .optional()
    .or(z.literal("")),
});

type BrandingFormValues = z.infer<typeof formSchema>;

export default function BrandingSettingsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      logoUrl: "",
      primaryColor: "",
      secondaryColor: "",
    },
  });

  const fetchBrandingSettings = useCallback(async () => {
    if (!user?.complexId) return;
    setLoading(true);
    try {
      const complex = await getResidentialComplexById(user.complexId);
      form.reset({
        logoUrl: complex.logoUrl || "",
        primaryColor: complex.primaryColor || "",
        secondaryColor: complex.secondaryColor || "",
      });
    } catch (error: unknown) {
      console.error("Error fetching branding settings:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar las configuraciones de marca: " +
          (error instanceof Error ? error.message : "Error desconocido"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.complexId, form, toast]);

  useEffect(() => {
    if (!authLoading && user && user.complexId) {
      fetchBrandingSettings();
    }
  }, [authLoading, user, fetchBrandingSettings]);

  const onSubmit = async (values: BrandingFormValues) => {
    if (!user?.complexId) return;
    setLoading(true);
    try {
      await updateResidentialComplex(user.complexId, values);
      toast({
        title: "Éxito",
        description: "Configuración de marca actualizada.",
      });
    } catch (error: unknown) {
      console.error("Error updating branding settings:", error);
      toast({
        title: "Error",
        description:
          "Error al actualizar la configuración de marca: " +
          (error instanceof Error ? error.message : "Error desconocido"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
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
        Personalización de Marca
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="logoUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL del Logo</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="https://example.com/logo.png"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="primaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Primario</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="secondaryColor"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color Secundario</FormLabel>
                  <FormControl>
                    <Input type="color" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Upload className="mr-2 h-4 w-4" />
              )}
              Guardar Cambios
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}