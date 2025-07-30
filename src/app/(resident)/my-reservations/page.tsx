"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, PlusCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import {
  getCommonAreas,
  getReservations,
  Reservation,
  CommonArea,
} from "@/services/reservationService";
import { useModal } from "@/hooks/useModal";
import ResidentReservationForm from "@/components/reservations/ResidentReservationForm";
import ResidentReservationsList from "@/components/reservations/ResidentReservationsList";
import * as ResidentCommonAreasListModule from "@/components/reservations/ResidentCommonAreasList";

export default function ResidentReservationsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const { openModal } = useModal();

  const [commonAreas, setCommonAreas] = useState<CommonArea[]>([]);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchReservationsAndCommonAreas = useCallback(async () => {
    setLoading(true);
    try {
      const [commonAreasData, reservationsData] = await Promise.all([
        getCommonAreas(),
        getReservations({ userId: user?.id }),
      ]);
      setCommonAreas(commonAreasData);
      setReservations(reservationsData);
    } catch (error: unknown) {
      console.error("Error fetching data:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar los datos de reservas: " + (error instanceof Error ? error.message : "Error desconocido"),
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [user?.id, toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchReservationsAndCommonAreas();
    }
  }, [authLoading, user, fetchReservationsAndCommonAreas]);

  const handleCreateReservation = (commonArea?: CommonArea) => {
    openModal(
      <ResidentReservationForm
        commonArea={commonArea}
        onReservationSuccess={fetchReservationsAndCommonAreas}
      />,
    );
  };

  if (authLoading || loading) {
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
        Mis Reservas de Amenidades
      </h1>

      <div className="flex justify-end mb-4">
        <Button onClick={() => handleCreateReservation()}>
          <PlusCircle className="mr-2 h-4 w-4" /> Crear Nueva Reserva
        </Button>
      </div>

      <h2 className="text-2xl font-bold text-gray-900 mb-4">
        Áreas Comunes Disponibles
      </h2>
      <ResidentCommonAreasListModule.default
        commonAreas={commonAreas}
        onCreateReservation={handleCreateReservation}
      />

      <h2 className="text-2xl font-bold text-gray-900 mb-4 mt-8">
        Mis Reservas
      </h2>
      <ResidentReservationsList reservations={reservations} />
    </div>
  );
}
