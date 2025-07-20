"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getAssemblyById, updateAssembly } from "@/services/assemblyService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  assemblySchema,
  AssemblyFormValues,
} from "@/validators/assembly-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function EditAssemblyPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const assemblyId = params.id ? parseInt(params.id as string) : null;

  const [pageLoading, setPageLoading] = useState(true); // Renamed to avoid conflict

  const form = useForm<AssemblyFormValues>({
    resolver: zodResolver(assemblySchema),
    defaultValues: {
      title: "",
      description: "",
      scheduledDate: "",
      location: "",
      status: "SCHEDULED",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchAssembly = useCallback(async () => {
    setPageLoading(true);
    try {
      if (!assemblyId) {
        router.push("/complex-admin/assemblies");
        return;
      }
      const fetchedAssembly = await getAssemblyById(assemblyId);
      if (fetchedAssembly) {
        setAssembly(fetchedAssembly);
        reset({
          title: fetchedAssembly.title,
          description: fetchedAssembly.description,
          scheduledDate: fetchedAssembly.scheduledDate.slice(0, 16),
          location: fetchedAssembly.location,
          status: fetchedAssembly.status,
        });
      } else {
        toast({
          title: "Error",
          description: "Asamblea no encontrada.",
          variant: "destructive",
        });
        router.push("/complex-admin/assemblies");
      }
    } catch (error: Error) {
      console.error("Error fetching assembly:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la asamblea: " + error.message,
        variant: "destructive",
      });
      router.push("/complex-admin/assemblies");
    } finally {
      setPageLoading(false);
    }
  }, [assemblyId, router, toast, reset]);

  useEffect(() => {
    if (!authLoading && user && assemblyId) {
      fetchAssembly();
    }
  }, [authLoading, user, assemblyId, fetchAssembly]);

  const onSubmit = async (data: AssemblyFormValues) => {
    if (!assemblyId) return;

    try {
      await updateAssembly(assemblyId, data);
      toast({
        title: "Éxito",
        description: "Asamblea actualizada correctamente.",
      });
      router.push("/complex-admin/assemblies");
    } catch (error: Error) {
      console.error("Error updating assembly:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la asamblea: " + error.message,
        variant: "destructive",
      });
    }
  };

  if (authLoading || pageLoading) {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar Asamblea</h1>

      {assemblyId && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Título</FormLabel>
                  <FormControl>
                    <Input placeholder="Título de la asamblea" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Descripción detallada de la asamblea"
                      {...field}
                      rows={5}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="scheduledDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha y Hora Programada</FormLabel>
                  <FormControl>
                    <Input type="datetime-local" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ubicación</FormLabel>
                  <FormControl>
                    <Input placeholder="Ubicación de la asamblea" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estado</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar estado" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SCHEDULED">Programada</SelectItem>
                      <SelectItem value="IN_PROGRESS">En Progreso</SelectItem>
                      <SelectItem value="COMPLETED">Completada</SelectItem>
                      <SelectItem value="CANCELLED">Cancelada</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : null}{" "}
              Guardar Cambios
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
