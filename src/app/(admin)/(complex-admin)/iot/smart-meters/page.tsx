"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Loader2, Zap, DollarSign, RefreshCw } from "lucide-react";

interface SmartMeterReading {
  id: string;
  unitId: string;
  reading: number;
  unit: string; // e.g., kWh, m3
  timestamp: string;
}

export default function SmartMetersPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [readings, setReadings] = useState<SmartMeterReading[]>([]);
  const [billingStatus, setBillingStatus] = useState<string | null>(null);

  const fetchSmartMeterData = useCallback(async () => {
    setLoading(true);
    try {
      // TODO: Call backend API to fetch smart meter readings
      const fetchedReadings: SmartMeterReading[] = [
        {
          id: "meter1",
          unitId: "Apto 101",
          reading: 150.2,
          unit: "kWh",
          timestamp: "2024-07-15T10:00:00",
        },
        {
          id: "meter2",
          unitId: "Apto 102",
          reading: 200.5,
          unit: "kWh",
          timestamp: "2024-07-15T10:05:00",
        },
        {
          id: "meter3",
          unitId: "Apto 103",
          reading: 50.1,
          unit: "m3",
          timestamp: "2024-07-15T10:10:00",
        },
      ];
      setReadings(fetchedReadings);

      // TODO: Call backend API to get automated billing status
      setBillingStatus("Última facturación: 2024-07-01");
    } catch (error) {
      console.error("Error fetching smart meter data:", error);
      toast({
        title: "Error",
        description:
          "No se pudieron cargar los datos de medidores inteligentes.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (user) {
      fetchSmartMeterData();
    }
  }, [user, fetchSmartMeterData]);

  const handleAutomatedBilling = async () => {
    setLoading(true);
    try {
      // TODO: Call backend API to trigger automated billing
      console.log("Triggering automated billing...");
      toast({
        title: "Facturación Iniciada",
        description: "La facturación automatizada ha sido iniciada.",
      });
      // Refresh data after billing
      fetchSmartMeterData();
    } catch (error) {
      console.error("Error triggering automated billing:", error);
      toast({
        title: "Error",
        description: "Error al iniciar la facturación automatizada.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
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
        Integración IoT: Medidores Inteligentes
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Estado de Medidores</CardTitle>
          <CardDescription>
            Lecturas recientes de los medidores inteligentes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {readings.length === 0 ? (
            <p className="text-center text-gray-500">
              No hay lecturas de medidores disponibles.
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Unidad</TableHead>
                  <TableHead>Lectura</TableHead>
                  <TableHead>Unidad de Medida</TableHead>
                  <TableHead>Fecha/Hora</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {readings.map((reading) => (
                  <TableRow key={reading.id}>
                    <TableCell className="font-medium">
                      {reading.unitId}
                    </TableCell>
                    <TableCell>{reading.reading}</TableCell>
                    <TableCell>{reading.unit}</TableCell>
                    <TableCell>
                      {new Date(reading.timestamp).toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Facturación Automatizada</CardTitle>
          <CardDescription>
            Gestión de la facturación basada en lecturas de medidores.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <Label>Estado de la Facturación:</Label>
            <span>{billingStatus || "Desconocido"}</span>
          </div>
          <Button onClick={handleAutomatedBilling} disabled={loading}>
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            <DollarSign className="mr-2 h-4 w-4" /> Iniciar Facturación Ahora
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
