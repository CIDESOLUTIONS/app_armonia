"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { getPQRById, updatePQR } from "@/services/pqrService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { pqrSchema, PQRFormValues } from "@/validators/pqr-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

export default function EditPQRPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const router = useRouter();
  const params = useParams();
  const pqrId = params.id ? parseInt(params.id as string) : null;

  const [pqr, setPqr] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<PQRFormValues>({
    resolver: zodResolver(pqrSchema),
    defaultValues: {
      subject: "",
      description: "",
      category: "",
      priority: "MEDIUM",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchPQR = useCallback(async () => {
    try {
      if (!pqrId) {
        router.push("/complex-admin/pqr");
        return;
      }
      const fetchedPQR = await getPQRById(pqrId);
      if (fetchedPQR) {
        setPqr(fetchedPQR);
        reset({
          subject: fetchedPQR.subject,
          description: fetchedPQR.description,
          category: fetchedPQR.category,
          priority: fetchedPQR.priority,
        });
      } else {
        toast({
          title: "Error",
          description: "PQR no encontrada.",
          variant: "destructive",
        });
        router.push("/complex-admin/pqr");
      }
    } catch (error) {
      console.error("Error fetching PQR:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la PQR.",
        variant: "destructive",
      });
      router.push("/complex-admin/pqr");
    } finally {
      setLoading(false);
    }
  }, [pqrId, router, toast, reset]);

  useEffect(() => {
    if (!authLoading && user && pqrId) {
      fetchPQR();
    }
  }, [authLoading, user, pqrId, fetchPQR]);

  const onSubmit = async (data: PQRFormValues) => {
    setLoading(true);
    if (!pqrId) return;

    try {
      await updatePQR(pqrId, data);
      toast({
        title: "Éxito",
        description: "PQR actualizada correctamente.",
      });
      router.push("/complex-admin/pqr");
    } catch (error) {
      console.error("Error updating PQR:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la PQR.",
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Editar PQR</h1>

      {pqrId && (
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={control}
              name="subject"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Asunto</FormLabel>
                  <FormControl>
                    <Input placeholder="Asunto de la PQR" {...field} />
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
                      placeholder="Describe tu petición, queja o reclamo"
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
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Categoría</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una categoría" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="ADMINISTRATIVE">
                        Administrativa
                      </SelectItem>
                      <SelectItem value="MAINTENANCE">Mantenimiento</SelectItem>
                      <SelectItem value="SECURITY">Seguridad</SelectItem>
                      <SelectItem value="COEXISTENCE">Convivencia</SelectItem>
                      <SelectItem value="OTHER">Otra</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Prioridad</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una prioridad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="LOW">Baja</SelectItem>
                      <SelectItem value="MEDIUM">Media</SelectItem>
                      <SelectItem value="HIGH">Alta</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Guardar Cambios
            </Button>
          </form>
        </Form>
      )}
    </div>
  );
}
