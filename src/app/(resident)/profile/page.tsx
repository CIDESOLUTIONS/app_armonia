"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { getProfileInfo, updateProfileInfo } from "@/services/profileService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  userProfileSchema,
  UserProfileFormValues,
} from "@/validators/user-profile-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

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

  const form = useForm<UserProfileFormValues>({
    resolver: zodResolver(userProfileSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      address: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchProfileInfo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getProfileInfo();
      setProfileInfo(data);
      reset({
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        address: data.address || "",
      });
    } catch (error) {
      console.error("Error fetching profile info:", error);
      const description =
        error instanceof Error
          ? "No se pudo cargar la información del perfil: " + error.message
          : "No se pudo cargar la información del perfil.";
      toast({
        title: "Error",
        description,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, reset]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchProfileInfo();
    }
  }, [authLoading, user, fetchProfileInfo]);

  const onSubmit = async (data: UserProfileFormValues) => {
    if (!profileInfo?.id) return;

    setLoading(true);
    try {
      await updateProfileInfo(data);
      toast({
        title: "Éxito",
        description: "Información del perfil actualizada correctamente.",
      });
      fetchProfileInfo();
    } catch (error) {
      console.error("Error updating profile info:", error);
      const description =
        error instanceof Error
          ? "Error al actualizar la información del perfil: " + error.message
          : "Error al actualizar la información del perfil.";
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

  if (!user) {
    return null; // Redirect handled by AuthLayout
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Mi Perfil</h1>

      {profileInfo && (
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 md:grid-cols-2"
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="name">Nombre</FormLabel>
                  <FormControl>
                    <Input id="name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="email"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="email">Email</FormLabel>
                  <FormControl>
                    <Input id="email" type="email" {...field} disabled />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="phone"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="phone">Teléfono</FormLabel>
                  <FormControl>
                    <Input id="phone" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="address"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="address">Dirección</FormLabel>
                  <FormControl>
                    <Input id="address" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="col-span-full flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? (
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                ) : null}{" "}
                Guardar Cambios
              </Button>
            </div>
          </form>
        </Form>
      )}
    </div>
  );
}
