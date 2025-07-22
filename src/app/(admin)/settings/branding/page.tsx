"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
  getBrandingSettings,
  updateBrandingSettings,
} from "@/services/brandingService";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BrandingSettingsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#4f46e5"); // Default Indigo
  const [secondaryColor, setSecondaryColor] = useState("#818cf8"); // Default Indigo-300

  useEffect(() => {
    const fetchSettings = async () => {
      setLoading(true);
      try {
        const settings = await getBrandingSettings();
        if (settings.logoUrl) {
          setLogoPreview(settings.logoUrl);
        }
        setPrimaryColor(settings.primaryColor || "#4f46e5");
        setSecondaryColor(settings.secondaryColor || "#818cf8");
      } catch (error: any) {
        console.error("Error fetching branding settings:", error);
        toast({
          title: "Error",
          description: "No se pudieron cargar las configuraciones de marca: " + error.message,
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };
    fetchSettings();
  }, [toast]);

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoFile(file);
      setLogoPreview(URL.createObjectURL(file));
    } else {
      setLogoFile(null);
      setLogoPreview(null);
    }
  };

  const handleSaveSettings = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      if (logoFile) {
        formData.append("logo", logoFile);
      }
      formData.append("primaryColor", primaryColor);
      formData.append("secondaryColor", secondaryColor);

      await updateBrandingSettings(formData);
      toast({
        title: "Éxito",
        description: "Configuración de marca guardada correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving branding settings:", error);
      toast({
        title: "Error",
        description: "Error al guardar la configuración de marca: " + error.message,
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

  if (!user || user.role !== "APP_ADMIN") {
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
        Personalización de Marca
      </h1>

      <Card>
        <CardHeader>
          <CardTitle>Configuración de Marca</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <Label htmlFor="logo">Logo</Label>
            <Input id="logo" type="file" accept="image/*" onChange={handleLogoChange} />
            {logoPreview && (
              <div className="mt-4">
                <img src={logoPreview} alt="Logo Preview" className="h-24 w-auto" />
              </div>
            )}
          </div>

          <div>
            <Label htmlFor="primaryColor">Color Primario</Label>
            <Input
              id="primaryColor"
              type="color"
              value={primaryColor}
              onChange={(e) => setPrimaryColor(e.target.value)}
              className="w-full h-10"
            />
          </div>

          <div>
            <Label htmlFor="secondaryColor">Color Secundario</Label>
            <Input
              id="secondaryColor"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="w-full h-10"
            />
          </div>

          <Button onClick={handleSaveSettings} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Guardar Configuración
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
