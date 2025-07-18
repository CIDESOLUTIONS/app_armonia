"use client";

"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2 } from "lucide-react";
import { createPreRegisteredVisitor } from "@/services/visitorService";
import { useAuthStore } from "@/store/authStore";

const formSchema = z.object({
  name: z.string().min(3, "El nombre es requerido."),
  documentType: z.string().min(1, "El tipo de documento es requerido."),
  documentNumber: z.string().min(5, "El número de documento es requerido."),
  expectedDate: z.string().min(1, "La fecha esperada es requerida."),
  validFrom: z.string().min(1, "La fecha de inicio de validez es requerida."),
  validUntil: z.string().min(1, "La fecha de fin de validez es requerida."),
  purpose: z.string().optional(),
});

export default function PreRegisterVisitorPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      documentType: "CC",
      documentNumber: "",
      expectedDate: "",
      validFrom: "",
      validUntil: "",
      purpose: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id || !user?.complexId) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión como residente.",
      });
      return;
    }

    setLoading(true);
    try {
      await createPreRegisteredVisitor({
        ...values,
        residentId: user.id,
        unitId: user.unitId, // Asumiendo que el unitId está en el store del usuario
        complexId: user.complexId,
      });
      toast({
        title: "Éxito",
        description: "Visitante pre-registrado correctamente.",
      });
            router.push("/resident-portal/visitors");
    } catch (error) {
      console.error("Error pre-registering visitor:", error);
      toast({
        title: "Error",
        description: "No se pudo pre-registrar al visitante.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Pre-registrar Visitante
      </h1>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre Completo</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del visitante" {...field} />
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
                <FormControl>
                  <Input placeholder="Ej: CC, CE, Pasaporte" {...field} />
                </FormControl>
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
                  <Input placeholder="Número de identificación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="expectedDate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha Esperada de Visita</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validFrom"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido Desde</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="validUntil"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Válido Hasta</FormLabel>
                <FormControl>
                  <Input type="date" {...field} />
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
                  <Input
                    placeholder="Ej: Visita familiar, entrega"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit" className="w-full" disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Pre-registrar Visitante
          </Button>
        </form>
      </Form>
    </div>
  );
}
