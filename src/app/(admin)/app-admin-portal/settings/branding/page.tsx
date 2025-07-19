"use client";

import React, { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Palette, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function BrandingSettingsPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [primaryColor, setPrimaryColor] = useState("#4F46E5"); // Default Indigo 600
  const [secondaryColor, setSecondaryColor] = useState("#6366F1"); // Default Indigo 500

  useEffect(() => {
    // Simulate fetching existing branding settings
    const fetchBrandingSettings = async () => {
      setLoading(true);
      try {
        // In a real scenario, fetch from backend
        // const settings = await getBrandingSettings();
        // setLogoPreview(settings.logoUrl);
        // setPrimaryColor(settings.primaryColor);
        // setSecondaryColor(settings.secondaryColor);
      } catch (err: any) {
        toast({
          title: "Error",
          description: "No se pudieron cargar las configuraciones de marca.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user && user.role === "APP_ADMIN") {
      fetchBrandingSettings();
    }
  }, [authLoading, user, toast]);

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

  const handleSaveBranding = async () => {
    setLoading(true);
    try {
      // Simulate uploading logo and saving settings
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real scenario:
      // if (logoFile) {
      //   const uploadedLogo = await uploadLogo(logoFile);
      //   // Save uploadedLogo.url along with colors
      // }
      // await saveBrandingSettings({ primaryColor, secondaryColor, logoUrl: uploadedLogo?.url });

      toast({
        title: "Éxito",
        description: "Configuración de marca guardada correctamente. (Simulado)",
      });
    } catch (error) {
      console.error("Error saving branding settings:", error);
      toast({
        title: "Error",
        description: "Error al guardar la configuración de marca.",
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
        Configuración de Marca (White-Labeling)
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="logoUpload">Logo de la Aplicación</Label>
            <Input
              id="logoUpload"
              type="file"
              accept="image/*"
              onChange={handleLogoChange}
              className="mt-1"
            />
            {logoPreview && (
              <div className="mt-4">
                <img src={logoPreview} alt="Logo Preview" className="max-w-xs h-auto" />
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
              className="mt-1 h-10 w-full"
            />
          </div>

          <div>
            <Label htmlFor="secondaryColor">Color Secundario</Label>
            <Input
              id="secondaryColor"
              type="color"
              value={secondaryColor}
              onChange={(e) => setSecondaryColor(e.target.value)}
              className="mt-1 h-10 w-full"
            />
          </div>

          <Button onClick={handleSaveBranding} disabled={loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Guardar Configuración de Marca
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Palette className="mr-2 h-5 w-5" /> Vista Previa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div
              className="p-6 rounded-lg shadow-lg"
              style={{ backgroundColor: primaryColor, color: secondaryColor }}
            >
              {logoPreview && (
                <img src={logoPreview} alt="Preview Logo" className="h-12 mb-4" />
              )}
              <h3 className="text-xl font-bold mb-2">Título de Ejemplo</h3>
              <p>Este es un texto de ejemplo para mostrar los colores.</p>
              <Button
                className="mt-4"
                style={{ backgroundColor: secondaryColor, color: primaryColor }}
              >
                Botón de Ejemplo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
