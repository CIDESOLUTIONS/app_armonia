"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getProfileInfo, updateProfileInfo } from "@/services/profileService";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
}

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [profileInfo, setProfileInfo] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  const fetchProfileInfo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProfileInfo();
      setProfileInfo(data);
      setFormData(data);
    } catch (error) {
      console.error("Error fetching profile info:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del perfil.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfileInfo();
    }
  }, [authLoading, user, fetchProfileInfo]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileInfo?.id) return;

    setLoading(true);
    try {
      await updateProfileInfo(formData);
      toast({
        title: "Éxito",
        description: "Información del perfil actualizada correctamente.",
      });
      fetchProfileInfo();
    } catch (error) {
      console.error("Error updating profile info:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la información del perfil.",
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

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      {profileInfo && (
        <form onSubmit={handleSubmit} className="grid gap-6 md:grid-cols-2">
          <div className="grid gap-2">
            <Label htmlFor="name">Nombre</Label>
            <Input
              id="name"
              name="name"
              value={formData.name || ""}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              value={formData.email || ""}
              onChange={handleInputChange}
              disabled // Email usually not editable directly
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="phone">Teléfono</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.phone || ""}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="address">Dirección</Label>
            <Input
              id="address"
              name="address"
              value={formData.address || ""}
              onChange={handleInputChange}
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
      )}
    </div>
  );
}
