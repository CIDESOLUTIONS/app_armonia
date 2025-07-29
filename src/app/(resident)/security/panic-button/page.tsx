"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Siren } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { triggerPanicAlert } from "@/services/panicService"; // Assuming this service exists

export default function PanicButtonPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handlePanicAlert = async () => {
    setLoading(true);
    try {
      if (!user?.id || !user?.complexId) {
        toast({
          title: "Error",
          description: "Información de usuario incompleta.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      // For simplicity, location can be hardcoded or derived from user's property
      const location = user.propertyId
        ? `Unidad ${user.propertyId}`
        : "Ubicación Desconocida";

      await triggerPanicAlert({
        userId: user.id,
        complexId: user.complexId,
        location: location,
        type: "MEDICAL", // Example type, could be dynamic
        status: "ACTIVE",
      });

      toast({
        title: "Alerta Enviada",
        description: "Se ha enviado una alerta de pánico a seguridad.",
      });
    } catch (error: any) {
      console.error("Error sending panic alert:", error);
      toast({
        title: "Error",
        description: error.message || "Error al enviar la alerta de pánico.",
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
    <div className="container mx-auto p-6 flex flex-col items-center justify-center min-h-[calc(100vh-100px)]">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Botón de Pánico</h1>

      <div className="bg-white shadow-md rounded-lg p-8 text-center">
        <p className="text-gray-700 mb-6">
          En caso de emergencia, presiona el botón de abajo para enviar una
          alerta a seguridad.
        </p>
        <Button
          onClick={handlePanicAlert}
          disabled={loading}
          className="w-48 h-48 rounded-full bg-red-600 hover:bg-red-700 text-white flex flex-col items-center justify-center text-lg font-bold shadow-lg transform transition-transform duration-200 hover:scale-105"
        >
          {loading ? (
            <Loader2 className="h-12 w-12 animate-spin" />
          ) : (
            <Siren className="h-16 w-16 mb-2" />
          )}
          {loading ? "Enviando..." : "PÁNICO"}
        </Button>
        <p className="mt-4 text-sm text-gray-500">
          Solo úsalo en situaciones de emergencia real.
        </p>
      </div>
    </div>
  );
}
