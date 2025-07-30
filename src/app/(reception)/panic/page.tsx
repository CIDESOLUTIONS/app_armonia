"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import {
  Loader2,
  Eye,
  CheckCircle,
  XCircle,
  MessageSquare,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  getPanicAlerts,
  getPanicAlertById,
  updatePanicAlert,
  addPanicResponse,
  PanicAlert,
  PanicResponse,
} from "@/services/panicService";
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
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";

const responseSchema = z.object({
  content: z.string().min(1, "La respuesta no puede estar vacía."),
});

type ResponseFormValues = z.infer<typeof responseSchema>;

export default function PanicAlertsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PanicAlert[]>([]);
  const [loading, setLoading] = useState(true);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isResponseModalOpen, setIsResponseModalOpen] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState<PanicAlert | null>(null);

  const responseForm = useForm<ResponseFormValues>({
    resolver: zodResolver(responseSchema),
    defaultValues: {
      content: "",
    },
  });

  const {
    handleSubmit: handleResponseSubmit,
    control: responseFormControl,
    reset: resetResponseForm,
    formState: { isSubmitting: isResponseSubmitting },
  } = responseForm;

  const fetchAlerts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getPanicAlerts();
      setAlerts(data);
    } catch (error: unknown) {
      console.error("Error fetching panic alerts:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar las alertas de pánico: " + (error instanceof Error ? error.message : "Error desconocido"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchAlerts();
    }
  }, [authLoading, user, fetchAlerts]);

  const handleViewDetails = async (alertId: number) => {
    try {
      const alert = await getPanicAlertById(alertId);
      setSelectedAlert(alert);
      setIsDetailModalOpen(true);
    } catch (error: unknown) {
      console.error("Error fetching alert details:", error);
      toast({
        title: "Error",
        description:
          "No se pudo cargar el detalle de la alerta: " + (error instanceof Error ? error.message : "Error desconocido"),
        variant: "destructive",
      });
    }
  };

  const handleUpdateStatus = async (
    alertId: number,
    status: "RESOLVED" | "IN_PROGRESS",
  ) => {
    try {
      await updatePanicAlert(alertId, { status });
      toast({ title: "Éxito", description: "Estado de alerta actualizado." });
      fetchAlerts();
    } catch (error: unknown) {
      console.error("Error updating alert status:", error);
      toast({
        title: "Error",
        description: (error instanceof Error ? error.message : "Error al actualizar el estado de la alerta."),
        variant: "destructive",
      });
    }
  };

  const handleAddResponse = (alert: PanicAlert) => {
    setSelectedAlert(alert);
    resetResponseForm();
    setIsResponseModalOpen(true);
  };

  const onResponseSubmit = async (values: ResponseFormValues) => {
    if (!selectedAlert || !user?.id) return;
    try {
      await addPanicResponse({
        alertId: selectedAlert.id,
        responderId: user.id,
        content: values.content,
      });
      toast({
        title: "Éxito",
        description: "Respuesta añadida correctamente.",
      });
      setIsResponseModalOpen(false);
      setIsDetailModalOpen(false); // Close detail modal if open
      fetchAlerts();
    } catch (error: unknown) {
      console.error("Error adding response:", error);
      toast({
        title: "Error",
        description: "Error al añadir respuesta: " + (error instanceof Error ? error.message : "Error desconocido"),
        variant: "destructive",
      });
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (
    !user ||
    (user.role !== "RECEPTION" &&
      user.role !== "SECURITY" &&
      user.role !== "COMPLEX_ADMIN" &&
      user.role !== "ADMIN")
  ) {
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
        Gestión de Alertas de Pánico
      </h1>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>ID</TableHead>
              <TableHead>Usuario</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Tipo</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha/Hora</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.length > 0 ? (
              alerts.map((alert) => (
                <TableRow key={alert.id}>
                  <TableCell>{alert.id}</TableCell>
                  <TableCell>{alert.userId}</TableCell>
                  <TableCell>{alert.location}</TableCell>
                  <TableCell>{alert.type}</TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        alert.status === "ACTIVE"
                          ? "destructive"
                          : alert.status === "IN_PROGRESS"
                            ? "secondary"
                            : "default"
                      }
                    >
                      {alert.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(alert.alertTime).toLocaleString()}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetails(alert.id)}
                      className="mr-2"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    {alert.status === "ACTIVE" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() =>
                          handleUpdateStatus(alert.id, "IN_PROGRESS")
                        }
                        className="mr-2"
                      >
                        <CheckCircle className="h-4 w-4 text-blue-600" />
                      </Button>
                    )}
                    {alert.status === "IN_PROGRESS" && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleUpdateStatus(alert.id, "RESOLVED")}
                        className="mr-2"
                      >
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      </Button>
                    )}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleAddResponse(alert)}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-5">
                  No hay alertas de pánico registradas.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Detail Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de la Alerta de Pánico</DialogTitle>
            <DialogDescription>
              Información detallada sobre la alerta de pánico.
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <div className="space-y-4 py-4">
              <p>
                <strong>ID:</strong> {selectedAlert.id}
              </p>
              <p>
                <strong>Usuario:</strong> {selectedAlert.userId}
              </p>
              <p>
                <strong>Ubicación:</strong> {selectedAlert.location}
              </p>
              <p>
                <strong>Tipo:</strong> {selectedAlert.type}
              </p>
              <p>
                <strong>Estado:</strong>{" "}
                <Badge
                  variant={
                    selectedAlert.status === "ACTIVE"
                      ? "destructive"
                      : selectedAlert.status === "IN_PROGRESS"
                        ? "secondary"
                        : "default"
                  }
                >
                  {selectedAlert.status}
                </Badge>
              </p>
              <p>
                <strong>Fecha/Hora:</strong>{" "}
                {new Date(selectedAlert.alertTime).toLocaleString()}
              </p>
              {selectedAlert.resolvedAt && (
                <p>
                  <strong>Resuelta:</strong>{" "}
                  {new Date(selectedAlert.resolvedAt).toLocaleString()}
                </p>
              )}

              <h3 className="text-lg font-semibold mt-4">Respuestas:</h3>
              {selectedAlert.responses && selectedAlert.responses.length > 0 ? (
                <div className="space-y-2">
                  {selectedAlert.responses.map((response, index) => (
                    <div key={index} className="bg-gray-100 p-3 rounded-md">
                      <p>
                        <strong>{response.responderId}:</strong>{" "}
                        {response.content}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(response.responseTime).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              ) : (
                <p>No hay respuestas registradas.</p>
              )}
            </div>
          )}
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDetailModalOpen(false)}
            >
              Cerrar
            </Button>
            {selectedAlert?.status !== "RESOLVED" && (
              <Button onClick={() => handleAddResponse(selectedAlert!)}>
                <MessageSquare className="mr-2 h-4 w-4" /> Añadir Respuesta
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Response Modal */}
      <Dialog open={isResponseModalOpen} onOpenChange={setIsResponseModalOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Añadir Respuesta a Alerta</DialogTitle>
            <DialogDescription>
              Registre la acción tomada para la alerta de pánico.
            </DialogDescription>
          </DialogHeader>
          {selectedAlert && (
            <Form {...responseForm}>
              <form
                onSubmit={handleResponseSubmit(onResponseSubmit)}
                className="space-y-4 py-4"
              >
                <p>
                  <strong>Alerta ID:</strong> {selectedAlert.id}
                </p>
                <p>
                  <strong>Ubicación:</strong> {selectedAlert.location}
                </p>
                <FormField
                  control={responseFormControl}
                  name="content"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contenido de la Respuesta</FormLabel>
                      <FormControl>
                        <Textarea {...field} rows={4} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setIsResponseModalOpen(false)}
                  >
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={isResponseSubmitting}>
                    {isResponseSubmitting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : null}{" "}
                    Enviar Respuesta
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
