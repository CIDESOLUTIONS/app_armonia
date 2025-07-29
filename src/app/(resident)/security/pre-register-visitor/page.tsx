
"use client";

import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuthStore } from '@/store/authStore';
import { Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Textarea } from "@/components/ui/textarea";
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import QRCode from 'qrcode.react';
import { createVisitor } from '@/services/visitorService'; // Assuming this service exists

const formSchema = z.object({
  name: z.string().min(1, { message: 'El nombre del visitante es requerido.' }),
  documentType: z.string().min(1, { message: 'El tipo de documento es requerido.' }),
  documentNumber: z.string().min(1, { message: 'El número de documento es requerido.' }),
  purpose: z.string().min(1, { message: 'El propósito de la visita es requerido.' }),
  expectedDate: z.string().min(1, { message: 'La fecha esperada es requerida.' }),
  expectedTime: z.string().min(1, { message: 'La hora esperada es requerida.' }),
});

export default function PreRegisterVisitorPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [qrCodeValue, setQrCodeValue] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      documentType: '',
      documentNumber: '',
      purpose: '',
      expectedDate: '',
      expectedTime: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      if (!user?.id || !user?.complexId || !user?.propertyId) {
        toast({ title: "Error", description: "Información de usuario incompleta.", variant: "destructive" });
        setLoading(false);
        return;
      }

      const visitorData = {
        ...values,
        residentId: user.id,
        complexId: user.complexId,
        propertyId: user.propertyId,
        entryTime: `${values.expectedDate}T${values.expectedTime}:00.000Z`, // Combine date and time
        status: "PRE_REGISTERED", // Custom status for pre-registered
      };

      const newVisitor = await createVisitor(visitorData);
      // Assuming the backend returns a QR code URL or ID
      // For now, we'll just use a dummy value or the visitor ID
      setQrCodeValue(`ARM-${newVisitor.id}-${Date.now()}`); // Example QR value

      toast({ title: "Éxito", description: "Visitante preregistrado y QR generado." });
    } catch (error: any) {
      console.error("Error preregistering visitor:", error);
      toast({ title: "Error", description: error.message || "Error al preregistrar visitante.", variant: "destructive" });
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

  if (!user || user.role !== "RESIDENT") {
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
        Pre-registro de Visitantes
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
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
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
              name="purpose"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Propósito de la Visita</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
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
                  <FormLabel>Fecha Esperada</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="expectedTime"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Hora Esperada</FormLabel>
                  <FormControl>
                    <Input type="time" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}{" "}
              Generar QR
            </Button>
          </form>
        </Form>

        {qrCodeValue && (
          <div className="mt-8 text-center">
            <h2 className="text-xl font-bold mb-4">Código QR para el Visitante</h2>
            <QRCode value={qrCodeValue} size={256} level="H" includeMargin={true} />
            <p className="mt-4 text-gray-600">
              Muestra este código QR al visitante para un acceso rápido.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
