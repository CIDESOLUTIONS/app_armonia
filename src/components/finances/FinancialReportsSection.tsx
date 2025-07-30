"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  reportType: z.string().min(1, "El tipo de informe es requerido"),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export const FinancialReportsSection = () => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const form = useForm<BrandingFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      reportType: "",
      startDate: "",
      endDate: "",
    } as BrandingFormValues,
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      // Call backend API to generate report
      const response = await fetch(
        `/api/finances/reports/${values.reportType}?startDate=${values.startDate}&endDate=${values.endDate}`,
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Error al generar el informe.");
      }

      const data = await response.json();
      // Assuming the API returns a downloadable URL
      window.open(data.downloadUrl, "_blank");

      toast({
        title: "Éxito",
        description: `Informe de ${values.reportType} generado correctamente.`,
      });
    } catch (error: unknown) {
      console.error("Error generating report:", error);
      toast({
        title: "Error",
        description:
          error instanceof Error
            ? error.message
            : "Error al generar el informe.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Informes Financieros</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reportType"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de Informe</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo de informe" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="income-expense">
                        Ingresos vs Gastos
                      </SelectItem>
                      <SelectItem value="balance-sheet">
                        Balance General
                      </SelectItem>
                      <SelectItem value="cash-flow">Flujo de Caja</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="startDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Inicio (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="endDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de Fin (Opcional)</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={loading}>
              {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Generar Informe
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
