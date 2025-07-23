"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  getActivePanicAlerts,
  updatePanicAlertStatus,
} from "@/services/panicService";

interface PanicAlert {
  id: number;
  userId: number;
  location: string;
  message?: string;
  createdAt: string;
  status: "ACTIVE" | "RESOLVED" | "DISMISSED";
  user?: { name: string }; // Assuming user object might be nested
}

export default function PanicAlertsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PanicAlert[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!authLoading && user) {
      fetchPanicAlerts();
    }
  }, [authLoading, user]);

  const fetchPanicAlerts = async () => {
    setLoading(true);
    try {
      const fetchedAlerts = await getActivePanicAlerts();
      setAlerts(fetchedAlerts);
    } catch (error: Error) {
      console.error("Error fetching panic alerts:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar las alertas de pánico: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResolveAlert = async (
    alertId: number,
    status: "RESOLVED" | "DISMISSED",
  ) => {
    try {
      await updatePanicAlertStatus(alertId, {
        status,
        resolvedBy: user?.name || "Desconocido",
      });
      toast({
        title: "Alerta Actualizada",
        description: `Alerta ${status === "RESOLVED" ? "resuelta" : "descartada"} correctamente.`,
      });
      fetchPanicAlerts(); // Refrescar la lista
    } catch (error: Error) {
      console.error("Error resolving panic alert:", error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la alerta: " + error.message,
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

  if (!user || (user.role !== "RECEPTION" && user.role !== "ADMIN")) {
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
        Alertas de Pánico Activas
      </h1>

      {alerts.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
          <h3 className="text-lg font-medium mb-2">
            No hay alertas de pánico activas.
          </h3>
          <p>Todo está tranquilo en este momento.</p>
        </div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Usuario</TableHead>
              <TableHead>Ubicación</TableHead>
              <TableHead>Mensaje</TableHead>
              <TableHead>Fecha/Hora</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {alerts.map((alert) => (
              <TableRow key={alert.id} className="bg-red-50">
                <TableCell>{alert.user?.name || "Desconocido"}</TableCell>
                <TableCell>{alert.location}</TableCell>
                <TableCell>{alert.message || "N/A"}</TableCell>
                <TableCell>
                  {new Date(alert.createdAt).toLocaleString()}
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="outline"
                    size="sm"
                    className="mr-2"
                    onClick={() => handleResolveAlert(alert.id, "RESOLVED")}
                  >
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Resolver
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => handleResolveAlert(alert.id, "DISMISSED")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Descartar
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      )}
    </div>
  );
}