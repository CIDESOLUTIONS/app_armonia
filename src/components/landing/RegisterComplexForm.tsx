"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  complexName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  adminName: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(7, "Teléfono inválido"),
});

type RegisterComplexFormValues = z.infer<typeof formSchema>;

export function RegisterComplexForm() {
  const { toast } = useToast();
  const { t } = useTranslation("landing");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (data: RegisterComplexFormValues) => {
    setLoading(true);
    try {
      const response = await fetch("/api/register-complex", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al registrar el conjunto.");
      }

      toast({
        title: "¡Registro Exitoso!",
        description:
          "Hemos recibido tu solicitud. Pronto nos pondremos en contacto contigo.",
      });
      form.reset();
    } catch (error) {
      console.error("Error registering complex:", error);
      const description =
        error instanceof Error
          ? error.message
          : "No pudimos procesar tu solicitud. Por favor, inténtalo de nuevo.";
      toast({
        title: "Error en el Registro",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-lg dark:bg-gray-800">
      <h2 className="text-2xl font-bold text-center">
        Registra tu Conjunto Residencial
      </h2>
      <p className="text-center text-gray-600 dark:text-gray-400">
        Inicia hoy y descubre una nueva forma de administrar.
      </p>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="complexName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre del Conjunto</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Ej: Conjunto Residencial El Bosque"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="adminName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tu Nombre Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Ej: Ana Pérez" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de Contacto</FormLabel>
                <FormControl>
                  <Input placeholder="tu@email.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono de Contacto</FormLabel>
                <FormControl>
                  <Input placeholder="300 123 4567" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Enviando..." : t("freeTrialButton")}
          </Button>
        </form>
      </Form>
    </div>
  );
}
