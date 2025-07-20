"use client";

import React, { useState, useCallback, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Loader2, DollarSign, CheckCircle, XCircle } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

interface MicroCreditApplication {
  id: string;
  amount: number;
  purpose: string;
  status: "pending" | "approved" | "rejected" | "paid";
  applicationDate: string;
  approvalDate?: string;
}

const formSchema = z.object({
  amount: z.preprocess(
    (val) => Number(val),
    z.number().positive("El monto debe ser un número positivo."),
  ),
  purpose: z
    .string()
    .min(10, "El propósito debe tener al menos 10 caracteres."),
});

export default function MicroCreditsPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<MicroCreditApplication[]>(
    [],
  );

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultDefaults: {
      amount: 0,
      purpose: "",
    },
  });

  const fetchApplications = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Call backend API to fetch micro-credit applications
      const fetchedApplications: MicroCreditApplication[] = [
        {
          id: "app1",
          amount: 500000,
          purpose: "Reparación de electrodoméstico",
          status: "pending",
          applicationDate: "2024-07-10T10:00:00",
        },
        {
          id: "app2",
          amount: 1000000,
          purpose: "Educación de hijo",
          status: "approved",
          applicationDate: "2024-06-01T09:00:00",
          approvalDate: "2024-06-05T14:00:00",
        },
        {
          id: "app3",
          amount: 200000,
          purpose: "Compra de víveres",
          status: "rejected",
          applicationDate: "2024-05-20T11:00:00",
        },
      ];
      setApplications(fetchedApplications);
    } catch (error: Error) {
      console.error("Error fetching applications:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar las solicitudes de micro-créditos: " +
          error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchApplications();
    }
  }, [user, fetchApplications]);

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Debes iniciar sesión para solicitar un micro-crédito.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      // TODO: Call backend API to submit micro-credit application
      // console.log("Submitting application:", values); // Removed console.log
      toast({
        title: "Solicitud Enviada",
        description:
          "Tu solicitud de micro-crédito ha sido enviada para revisión.",
      });
      form.reset();
      fetchApplications(); // Refresh list
    } catch (error: Error) {
      console.error("Error submitting application:", error);
      toast({
        title: "Error",
        description:
          "Error al enviar la solicitud de micro-crédito: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: MicroCreditApplication["status"]) => {
    switch (status) {
      case "pending":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-800">
            Pendiente
          </span>
        );
      case "approved":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
            Aprobado
          </span>
        );
      case "rejected":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
            Rechazado
          </span>
        );
      case "paid":
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
            Pagado
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-100 text-gray-800">
            Desconocido
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Acceso Denegado
          </h1>
          <p className="text-gray-600">
            Debes iniciar sesión para acceder a esta página.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Alianzas FinTech: Micro-créditos
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Solicitar Nuevo Micro-crédito</CardTitle>
          <CardDescription>
            Completa el formulario para solicitar un micro-crédito.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Monto Solicitado</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        placeholder="Ej: 500000"
                        {...field}
                      />
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
                    <FormLabel>Propósito del Crédito</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe brevemente para qué necesitas el crédito"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Enviar Solicitud
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Mis Solicitudes de Micro-créditos</CardTitle>
        </CardHeader>
        <CardContent>
          {applications.length === 0 ? (
            <p className="text-center text-gray-500">
              No has realizado ninguna solicitud de micro-crédito.
            </p>
          ) : (
            <div className="space-y-4">
              {applications.map((app) => (
                <Card key={app.id} className="p-4">
                  <div className="flex justify-between items-center">
                    <div>
                      <p className="text-lg font-semibold">
                        Monto: ${app.amount.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Propósito: {app.purpose}
                      </p>
                      <p className="text-xs text-gray-500">
                        Solicitado el:{" "}
                        {new Date(app.applicationDate).toLocaleDateString()}
                      </p>
                    </div>
                    <div>{getStatusBadge(app.status)}</div>
                  </div>
                  {app.status === "approved" && app.approvalDate && (
                    <p className="text-xs text-gray-500 mt-2">
                      Aprobado el:{" "}
                      {new Date(app.approvalDate).toLocaleDateString()}
                    </p>
                  )}
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
