"use client";

import { useState, useEffect, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getComplexInfo, updateComplexInfo } from "@/services/complexService";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  complexInfoSchema,
  ComplexInfoFormValues,
} from "@/validators/complex-info-schema";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

interface ComplexInfo {
  id: number;
  name: string;
  schemaName: string;
  totalUnits: number;
  adminEmail: string;
  adminName: string;
  adminPhone: string;
  address: string;
  city: string;
  state: string;
  country: string;
  propertyTypes: string[];
  legalName?: string;
  nit?: string;
  registrationDate?: string;
}

export default function ComplexSetupPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [complexInfo, setComplexInfo] = useState<ComplexInfo | null>(null);
  const [loading, setLoading] = useState(true);

  const form = useForm<ComplexInfoFormValues>({
    resolver: zodResolver(complexInfoSchema),
    defaultValues: {
      name: "",
      schemaName: "",
      totalUnits: 0,
      adminEmail: "",
      adminName: "",
      adminPhone: "",
      address: "",
      city: "",
      state: "",
      country: "",
      propertyTypes: [],
      legalName: "",
      nit: "",
      registrationDate: "",
    },
  });

  const {
    handleSubmit,
    control,
    reset,
    formState: { isSubmitting },
  } = form;

  const fetchComplexInfo = useCallback(async () => {
    setLoading(true);
    try {
      const data = await getComplexInfo();
      setComplexInfo(data);
      reset({
        name: data.name,
        schemaName: data.schemaName,
        totalUnits: data.totalUnits,
        adminEmail: data.adminEmail,
        adminName: data.adminName,
        adminPhone: data.adminPhone || "",
        address: data.address,
        city: data.city,
        state: data.state,
        country: data.country,
        propertyTypes: data.propertyTypes || [],
        legalName: data.legalName || "",
        nit: data.nit || "",
        registrationDate: data.registrationDate
          ? data.registrationDate.split("T")[0]
          : "",
      });
    } catch (error) {
      console.error("Error fetching complex info:", error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información del conjunto.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [toast, reset]);

  useEffect(() => {
    if (!authLoading && user) {
      fetchComplexInfo();
    }
  }, [authLoading, user, fetchComplexInfo]);

  const onSubmit = async (data: ComplexInfoFormValues) => {
    if (!complexInfo?.id) return;

    setLoading(true);
    try {
      await updateComplexInfo(complexInfo.id, data);
      toast({
        title: "Éxito",
        description: "Información del conjunto actualizada correctamente.",
      });
      fetchComplexInfo(); // Re-fetch para asegurar que los datos estén actualizados
    } catch (error) {
      console.error("Error saving complex info:", error);
      toast({
        title: "Error",
        description: "Error al guardar la información del conjunto.",
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Configuración del Conjunto Residencial
      </h1>

      {complexInfo && (
        <Form {...form}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="grid gap-6 md:grid-cols-2 lg:grid-cols-3"
          >
            <FormField
              control={control}
              name="name"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="name">Nombre del Conjunto</FormLabel>
                  <FormControl>
                    <Input id="name" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="legalName"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="legalName">
                    Razón Social / Nombre Legal
                  </FormLabel>
                  <FormControl>
                    <Input id="legalName" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="nit"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="nit">
                    NIT / Identificación Tributaria
                  </FormLabel>
                  <FormControl>
                    <Input id="nit" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="registrationDate"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="registrationDate">
                    Fecha de Registro
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="registrationDate"
                      type="date"
                      value={field.value ? field.value.split("T")[0] : ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="totalUnits"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="totalUnits">Total de Unidades</FormLabel>
                  <FormControl>
                    <Input
                      id="totalUnits"
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(parseInt(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="adminEmail"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="adminEmail">
                    Email del Administrador
                  </FormLabel>
                  <FormControl>
                    <Input id="adminEmail" type="email" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="adminName"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="adminName">
                    Nombre del Administrador
                  </FormLabel>
                  <FormControl>
                    <Input id="adminName" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="adminPhone"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="adminPhone">
                    Teléfono del Administrador
                  </FormLabel>
                  <FormControl>
                    <Input id="adminPhone" {...field} />
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
                    <Input id="address" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="city"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="city">Ciudad</FormLabel>
                  <FormControl>
                    <Input id="city" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="state"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="state">Departamento/Estado</FormLabel>
                  <FormControl>
                    <Input id="state" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="country"
              render={({ field }) => (
                <FormItem className="grid gap-2">
                  <FormLabel htmlFor="country">País</FormLabel>
                  <FormControl>
                    <Input id="country" {...field} required />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={control}
              name="propertyTypes"
              render={({ field }) => (
                <FormItem className="grid gap-2 col-span-full">
                  <FormLabel htmlFor="propertyTypes">
                    Tipos de Propiedad (separados por coma)
                  </FormLabel>
                  <FormControl>
                    <Input
                      id="propertyTypes"
                      value={field.value?.join(", ") || ""}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value.split(",").map((s) => s.trim()),
                        )
                      }
                    />
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
