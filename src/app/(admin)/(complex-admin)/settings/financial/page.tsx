"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { getFinancialSettings, updateFinancialSettings } from "@/services/financialSettingsService";

export default function FinancialSettingsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [formData, setFormData] = useState<Partial<FinancialSettings>>({});
  const [loadingData, setLoadingData] = useState(true);

  const fetchFinancialSettings = useCallback(async () => {
    setLoadingData(true);
    try {
      const data = await getFinancialSettings();
      setFormData(data);
    } catch (error) {
      console.error("Error fetching financial settings:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la configuración financiera.",
        variant: "destructive",
      });
    } finally {
      setLoadingData(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchFinancialSettings();
    }
  }, [authLoading, user, fetchFinancialSettings]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSaveFinancialSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateFinancialSettings(formData as FinancialSettings);
      toast({
        title: "Éxito",
        description: "Configuración financiera guardada correctamente.",
      });
      fetchFinancialSettings(); // Re-fetch para asegurar que los datos estén actualizados
    } catch (error) {
      console.error("Error saving financial settings:", error);
      toast({
        title: "Error",
        description: "Error al guardar la configuración financiera.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loadingData) {
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
        Configuración Financiera
      </h1>

      <div className="bg-white shadow-md rounded-lg p-6">
        <form
          onSubmit={handleSaveFinancialSettings}
          className="grid gap-6 md:grid-cols-2"
        >
          <div className="grid gap-2">
            <Label htmlFor="bankName">Nombre del Banco</Label>
            <Input
              id="bankName"
              name="bankName"
              value={formData.bankName || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accountNumber">Número de Cuenta</Label>
            <Input
              id="accountNumber"
              name="accountNumber"
              value={formData.accountNumber || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="accountType">Tipo de Cuenta</Label>
            <Input
              id="accountType"
              name="accountType"
              value={formData.accountType || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="nit">NIT / Identificación</Label>
            <Input
              id="nit"
              name="nit"
              value={formData.nit || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2 col-span-full">
            <Label htmlFor="paymentMethods">
              Métodos de Pago (separados por coma)
            </Label>
            <Textarea
              id="paymentMethods"
              name="paymentMethods"
              value={formData.paymentMethods || ""}
              onChange={handleInputChange}
              rows={3}
            />
          </div>

          <div className="col-span-full flex justify-end">
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}{" "}
              Guardar Cambios
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
