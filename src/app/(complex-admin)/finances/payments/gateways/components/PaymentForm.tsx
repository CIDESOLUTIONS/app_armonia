"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient, useMutation, useQuery } from "@tanstack/react-query";
import { createTransaction, getPaymentMethods } from "@/services/paymentGatewayService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useModal } from "@/hooks/useModal";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, Banknote, Smartphone } from "lucide-react";

const formSchema = z.object({
  amount: z.number().positive("El monto debe ser mayor a 0"),
  currency: z.string().min(3, "Moneda requerida"),
  paymentMethodId: z.string().min(1, "Método de pago requerido"),
  description: z.string().optional(),
});

const CURRENCIES = [
  { value: "COP", label: "Pesos Colombianos (COP)" },
  { value: "USD", label: "Dólares (USD)" },
];

export default function PaymentForm() {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState(null);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      amount: undefined,
      currency: "COP",
      paymentMethodId: "",
      description: "",
    },
  });

  const { data: paymentMethods } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: () => getPaymentMethods(),
  });

  const mutation = useMutation({
    mutationFn: (data) => createTransaction(data),
    onSuccess: (data) => {
      queryClient.invalidateQueries(["transactions"]);
      toast({ 
        title: "Transacción iniciada",
        description: `Transacción #${data.id} creada exitosamente`
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: "Error al procesar el pago",
        description: error.message || "Ocurrió un error inesperado",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data) => {
    mutation.mutate({
      ...data,
      userId: "user-123", // TODO: obtener del contexto de autenticación
    });
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case "STRIPE":
        return <CreditCard className="h-4 w-4" />;
      case "PAYPAL":
        return <Smartphone className="h-4 w-4" />;
      case "PSE":
        return <Banknote className="h-4 w-4" />;
      default:
        return <CreditCard className="h-4 w-4" />;
    }
  };

  const getProviderName = (provider) => {
    switch (provider) {
      case "STRIPE":
        return "Stripe";
      case "PAYPAL":
        return "PayPal";
      case "PSE":
        return "PSE";
      default:
        return provider;
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Procesar Pago
        </CardTitle>
        <CardDescription>
          Selecciona el método de pago y completa la transacción
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Monto</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="0.00"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="currency"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Moneda</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona la moneda" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {CURRENCIES.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="paymentMethodId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Método de Pago</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un método de pago" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {paymentMethods?.map((method) => (
                        <SelectItem key={method.id} value={method.id}>
                          <div className="flex items-center gap-2">
                            {getProviderIcon(method.provider)}
                            <span>
                              {getProviderName(method.provider)} - {method.type}
                              {method.details?.last4 && ` ****${method.details.last4}`}
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Descripción (Opcional)</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Descripción del pago..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isLoading} className="flex-1">
                {mutation.isLoading ? "Procesando..." : "Procesar Pago"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}