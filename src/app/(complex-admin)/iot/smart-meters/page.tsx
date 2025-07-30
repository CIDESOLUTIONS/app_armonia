"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Zap, DollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  recordSmartMeterReading,
  triggerAutomatedBilling,
  SmartMeterReading,
} from "@/services/iotService";

export default function SmartMetersPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [readingForm, setReadingForm] = useState<SmartMeterReading>({
    meterId: "",
    propertyId: 0,
    reading: 0,
    unit: "kWh",
  });
  const [billingForm, setBillingForm] = useState({
    billingPeriodStart: "",
    billingPeriodEnd: "",
  });

  const handleRecordReading = async () => {
    setLoading(true);
    try {
      await recordSmartMeterReading(readingForm);
      toast({
        title: "Lectura Registrada",
        description:
          "Lectura del medidor inteligente registrada correctamente.",
      });
      setReadingForm({
        meterId: "",
        propertyId: 0,
        reading: 0,
        unit: "kWh",
      });
    } catch (error) {
      console.error("Error recording reading:", error);
      const description =
        error instanceof Error
          ? "Error al registrar la lectura del medidor: " + error.message
          : "Error al registrar la lectura del medidor.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleTriggerBilling = async () => {
    if (!user?.complexId) {
      toast({
        title: "Error",
        description: "No se pudo obtener el ID del complejo del usuario.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      await triggerAutomatedBilling({
        ...billingForm,
        complexId: user.complexId,
      });
      toast({
        title: "Facturación Iniciada",
        description: "Facturación automatizada iniciada correctamente.",
      });
      setBillingForm({
        billingPeriodStart: "",
        billingPeriodEnd: "",
      });
    } catch (error) {
      console.error("Error triggering billing:", error);
      const description =
        error instanceof Error
          ? "Error al iniciar la facturación automatizada: " + error.message
          : "Error al iniciar la facturación automatizada.";
      toast({
        title: "Error",
        description,
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
        Gestión de Medidores Inteligentes (Simulado)
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Registrar Lectura de Medidor</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="meterId">ID del Medidor</Label>
            <Input
              id="meterId"
              name="meterId"
              value={readingForm.meterId}
              onChange={(e) =>
                setReadingForm({ ...readingForm, meterId: e.target.value })
              }
              placeholder="Ej: MED001"
            />
          </div>
          <div>
            <Label htmlFor="propertyId">ID de Propiedad</Label>
            <Input
              id="propertyId"
              name="propertyId"
              type="number"
              value={readingForm.propertyId}
              onChange={(e) =>
                setReadingForm({
                  ...readingForm,
                  propertyId: parseInt(e.target.value),
                })
              }
              placeholder="Ej: 1"
            />
          </div>
          <div>
            <Label htmlFor="reading">Lectura</Label>
            <Input
              id="reading"
              name="reading"
              type="number"
              value={readingForm.reading}
              onChange={(e) =>
                setReadingForm({
                  ...readingForm,
                  reading: parseFloat(e.target.value),
                })
              }
              placeholder="Ej: 123.45"
            />
          </div>
          <div>
            <Label htmlFor="unit">Unidad</Label>
            <Input
              id="unit"
              name="unit"
              value={readingForm.unit}
              onChange={(e) =>
                setReadingForm({ ...readingForm, unit: e.target.value })
              }
              placeholder="Ej: kWh, m3"
            />
          </div>
          <Button onClick={handleRecordReading} disabled={loading}>
            <Zap className="mr-2 h-4 w-4" /> Registrar Lectura
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Activar Facturación Automatizada</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="billingPeriodStart">
              Inicio Período Facturación
            </Label>
            <Input
              id="billingPeriodStart"
              name="billingPeriodStart"
              type="date"
              value={billingForm.billingPeriodStart}
              onChange={(e) =>
                setBillingForm({
                  ...billingForm,
                  billingPeriodStart: e.target.value,
                })
              }
            />
          </div>
          <div>
            <Label htmlFor="billingPeriodEnd">Fin Período Facturación</Label>
            <Input
              id="billingPeriodEnd"
              name="billingPeriodEnd"
              type="date"
              value={billingForm.billingPeriodEnd}
              onChange={(e) =>
                setBillingForm({
                  ...billingForm,
                  billingPeriodEnd: e.target.value,
                })
              }
            />
          </div>
          <Button onClick={handleTriggerBilling} disabled={loading}>
            <DollarSign className="mr-2 h-4 w-4" /> Activar Facturación
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
