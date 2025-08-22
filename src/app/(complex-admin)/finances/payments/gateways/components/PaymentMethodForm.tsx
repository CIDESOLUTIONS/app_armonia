"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { addPaymentMethod } from "@/services/paymentGatewayService";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useModal } from "@/hooks/useModal";
import { toast } from "@/components/ui/use-toast";
import { CreditCard, Banknote, Smartphone } from "lucide-react";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  provider: z.enum(["STRIPE", "PAYPAL", "PSE"], {
    required_error: "Selecciona un proveedor",
  }),
  type: z.string().min(1, "Tipo requerido"),
  details: z.object({
    cardNumber: z.string().optional(),
    expiryMonth: z.string().optional(),
    expiryYear: z.string().optional(),
    cvc: z.string().optional(),
    holderName: z.string().optional(),
    email: z.string().email().optional(),
    bankCode: z.string().optional(),
  }),
  isDefault: z.boolean().default(false),
});

const STRIPE_TYPES = [
  { value: "card", label: "Tarjeta de Crédito/Débito" },
  { value: "ach", label: "Transferencia ACH" },
];

const PAYPAL_TYPES = [
  { value: "paypal_account", label: "Cuenta PayPal" },
];

const PSE_TYPES = [
  { value: "pse_transfer", label: "Transferencia PSE" },
];

const PSE_BANKS = [
  { code: "1007", name: "Bancolombia" },
  { code: "1019", name: "Scotiabank Colpatria" },
  { code: "1051", name: "Davivienda" },
  { code: "1001", name: "Banco de Bogotá" },
  { code: "1023", name: "Banco de Occidente" },
  { code: "1062", name: "Banco Falabella" },
  { code: "1032", name: "Banco Popular" },
  { code: "1558", name: "Banco Pichincha" },
];

export default function PaymentMethodForm() {
  const { closeModal } = useModal();
  const queryClient = useQueryClient();
  const [selectedProvider, setSelectedProvider] = useState("");

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      provider: undefined,
      type: "",
      details: {},
      isDefault: false,
    },
  });

  const mutation = useMutation({
    mutationFn: (data) => addPaymentMethod(data),
    onSuccess: () => {
      queryClient.invalidateQueries(["paymentMethods"]);
      toast({ 
        title: "Método de pago agregado",
        description: "El método de pago se ha configurado exitosamente"
      });
      closeModal();
    },
    onError: (error) => {
      toast({
        title: "Error al agregar método de pago",
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

  const getProviderTypes = (provider) => {
    switch (provider) {
      case "STRIPE":
        return STRIPE_TYPES;
      case "PAYPAL":
        return PAYPAL_TYPES;
      case "PSE":
        return PSE_TYPES;
      default:
        return [];
    }
  };

  const getProviderIcon = (provider) => {
    switch (provider) {
      case "STRIPE":
        return <CreditCard className="h-5 w-5" />;
      case "PAYPAL":
        return <Smartphone className="h-5 w-5" />;
      case "PSE":
        return <Banknote className="h-5 w-5" />;
      default:
        return <CreditCard className="h-5 w-5" />;
    }
  };

  const provider = form.watch("provider");
  const type = form.watch("type");

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CreditCard className="h-5 w-5" />
          Agregar Método de Pago
        </CardTitle>
        <CardDescription>
          Configura un nuevo método de pago para procesar transacciones
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Selección de Proveedor */}
            <FormField
              control={form.control}
              name="provider"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Pasarela de Pago</FormLabel>
                  <Select 
                    onValueChange={(value) => {
                      field.onChange(value);
                      form.setValue("type", "");
                      setSelectedProvider(value);
                    }} 
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona una pasarela" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="STRIPE">
                        <div className="flex items-center gap-2">
                          <CreditCard className="h-4 w-4" />
                          <span>Stripe</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="PAYPAL">
                        <div className="flex items-center gap-2">
                          <Smartphone className="h-4 w-4" />
                          <span>PayPal</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="PSE">
                        <div className="flex items-center gap-2">
                          <Banknote className="h-4 w-4" />
                          <span>PSE</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Tipo de Método */}
            {provider && (
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Método</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {getProviderTypes(provider).map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            {/* Formularios Específicos por Proveedor */}
            {provider && type && (
              <Tabs value={provider} className="w-full">
                <TabsContent value="STRIPE">
                  {type === "card" && (
                    <div className="space-y-4">
                      <FormField
                        control={form.control}
                        name="details.holderName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Nombre del Titular</FormLabel>
                            <FormControl>
                              <Input placeholder="Juan Pérez" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="details.cardNumber"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Número de Tarjeta</FormLabel>
                            <FormControl>
                              <Input 
                                placeholder="4242 4242 4242 4242" 
                                maxLength={19}
                                {...field} 
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <div className="grid grid-cols-3 gap-4">
                        <FormField
                          control={form.control}
                          name="details.expiryMonth"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Mes</FormLabel>
                              <FormControl>
                                <Input placeholder="MM" maxLength={2} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.expiryYear"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Año</FormLabel>
                              <FormControl>
                                <Input placeholder="YYYY" maxLength={4} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="details.cvc"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>CVC</FormLabel>
                              <FormControl>
                                <Input placeholder="123" maxLength={4} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="PAYPAL">
                  <FormField
                    control={form.control}
                    name="details.email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email de PayPal</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="usuario@ejemplo.com" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>

                <TabsContent value="PSE">
                  <FormField
                    control={form.control}
                    name="details.bankCode"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Banco</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tu banco" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {PSE_BANKS.map((bank) => (
                              <SelectItem key={bank.code} value={bank.code}>
                                {bank.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </TabsContent>
              </Tabs>
            )}

            {/* Método por Defecto */}
            <FormField
              control={form.control}
              name="isDefault"
              render={({ field }) => (
                <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                  <div className="space-y-0.5">
                    <FormLabel className="text-base">Método por Defecto</FormLabel>
                    <div className="text-sm text-muted-foreground">
                      Usar este método como predeterminado para nuevos pagos
                    </div>
                  </div>
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={closeModal}
                className="flex-1"
              >
                Cancelar
              </Button>
              <Button type="submit" disabled={mutation.isLoading} className="flex-1">
                {mutation.isLoading ? "Agregando..." : "Agregar Método"}
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}