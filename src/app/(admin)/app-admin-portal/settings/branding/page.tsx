"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getResidentialComplexes,
  updateResidentialComplex,
  ResidentialComplex,
} from "@/services/residentialComplexService";

export default function BrandingPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [complexes, setComplexes] = useState<ResidentialComplex[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedComplex, setSelectedComplex] =
    useState<ResidentialComplex | null>(null);
  const [formData, setFormData] = useState({
    logoUrl: "",
    primaryColor: "",
    secondaryColor: "",
  });

  const fetchComplexes = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getResidentialComplexes();
      setComplexes(data);
    } catch (error) {
      console.error("Error fetching complexes:", error);
      const description =
        error instanceof Error
          ? "No se pudieron cargar los complejos residenciales: " +
            error.message
          : "No se pudieron cargar los complejos residenciales.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user && user.role === "ADMIN") {
      fetchComplexes();
    }
  }, [authLoading, user, fetchComplexes]);

  useEffect(() => {
    if (selectedComplex) {
      setFormData({
        logoUrl: selectedComplex.logoUrl || "",
        primaryColor: selectedComplex.primaryColor || "",
        secondaryColor: selectedComplex.secondaryColor || "",
      });
    } else {
      setFormData({
        logoUrl: "",
        primaryColor: "",
        secondaryColor: "",
      });
    }
  }, [selectedComplex]);

  const handleComplexSelect = (complexId: string) => {
    const complex = complexes.find((c) => c.id.toString() === complexId);
    setSelectedComplex(complex || null);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedComplex) return;

    setLoading(true);
    try {
      await updateResidentialComplex(selectedComplex.id, formData);
      toast({
        title: "Éxito",
        description: "Configuración de marca actualizada correctamente.",
      });
      fetchComplexes(); // Refresh list to show updated data
    } catch (error) {
      console.error("Error updating branding:", error);
      const description =
        error instanceof Error
          ? "Error al actualizar la configuración de marca: " + error.message
          : "Error al actualizar la configuración de marca.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!user || user.role !== "ADMIN") {
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
        Personalización de Marca (White-Labeling)
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Seleccionar Complejo Residencial</CardTitle>
        </CardHeader>
        <CardContent>
          <Label htmlFor="complexSelect">Complejo:</Label>
          <Select onValueChange={handleComplexSelect}>
            <SelectTrigger id="complexSelect">
              <SelectValue placeholder="Selecciona un complejo" />
            </SelectTrigger>
            <SelectContent>
              {complexes.map((complex) => (
                <SelectItem key={complex.id} value={complex.id.toString()}>
                  {complex.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {selectedComplex && (
        <Card>
          <CardHeader>
            <CardTitle>Configurar Marca para {selectedComplex.name}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="logoUrl">URL del Logo</Label>
                <Input
                  id="logoUrl"
                  name="logoUrl"
                  value={formData.logoUrl}
                  onChange={handleChange}
                  placeholder="https://ejemplo.com/logo.png"
                />
              </div>
              <div>
                <Label htmlFor="primaryColor">Color Primario</Label>
                <Input
                  id="primaryColor"
                  name="primaryColor"
                  type="color"
                  value={formData.primaryColor}
                  onChange={handleChange}
                />
              </div>
              <div>
                <Label htmlFor="secondaryColor">Color Secundario</Label>
                <Input
                  id="secondaryColor"
                  name="secondaryColor"
                  type="color"
                  value={formData.secondaryColor}
                  onChange={handleChange}
                />
              </div>
              <Button type="submit" disabled={loading}>
                <Save className="mr-2 h-4 w-4" /> Guardar Cambios
              </Button>
            </form>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
