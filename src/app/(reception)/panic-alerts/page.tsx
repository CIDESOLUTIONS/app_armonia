"use client";

import { useEffect, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { getPanicAlerts, updatePanicAlertStatus } from "@/services/panicService";

interface PanicAlert {
  id: string;
  userId: string;
  userName: string;
  location: string;
  status: "PENDING" | "RESOLVED" | "DISMISSED";
  timestamp: string;
}

export default function PanicAlertsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [alerts, setAlerts] = useState<PanicAlert[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    setLoading(true);
    try {
      const fetchedAlerts = await getPanicAlerts();
      setAlerts(fetchedAlerts);
    } catch (error) {
      console.error("Error fetching panic alerts:", error);
      toast({
        title: "Error",
        description: "No se pudieron cargar las alertas de pánico.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) {
      fetchAlerts();
    }
  }, [authLoading, user]);

  const handleUpdateStatus = async (id: string, status: "RESOLVED" | "DISMISSED") => {
    try {
      await updatePanicAlertStatus(id, status);
      toast({
        title: "Éxito",
        description: `Alerta marcada como ${status === "RESOLVED" ? "resuelta" : "descartada"}.`,
      });
      fetchAlerts();
    } catch (error) {
      console.error("Error updating panic alert status:", error);
      toast({
        title: "Error",
        description: "Error al actualizar el estado de la alerta.",
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

  if (!user || (user.role !== "ADMIN" && user.role !== "COMPLEX_ADMIN" && user.role !== "STAFF")) {
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
        Alertas de Pánico
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {alerts.length > 0 ? (
          alerts.map((alert) => (
            <Card key={alert.id}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
                  Alerta de Pánico de {alert.userName}
                </CardTitle>
                <CardContent className="text-sm text-gray-600">
                  <p>Ubicación: {alert.location}</p>
                  <p>Estado: {alert.status}</p>
                  <p>Hora: {new Date(alert.timestamp).toLocaleString()}</p>
                </CardContent>
              </CardHeader>
              <CardContent className="flex justify-end gap-2">
                {alert.status === "PENDING" && (
                  <>
                    <Button
                      variant="outline"
                      onClick={() => handleUpdateStatus(alert.id, "RESOLVED")}
                    >
                      <CheckCircle className="mr-2 h-4 w-4" />
                      Marcar como Resuelta
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => handleUpdateStatus(alert.id, "DISMISSED")}
                    >
                      <XCircle className="mr-2 h-4 w-4" />
                      Descartar
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <div className="col-span-full text-center py-12 text-gray-500">
            <CheckCircle className="h-12 w-12 mx-auto mb-4 text-gray-400" />
            <h3 className="text-lg font-medium mb-2">
              No hay alertas de pánico pendientes
            </h3>
            <p>Todo tranquilo por ahora.</p>
          </div>
        )}
      </div>
    </div>
  );
}