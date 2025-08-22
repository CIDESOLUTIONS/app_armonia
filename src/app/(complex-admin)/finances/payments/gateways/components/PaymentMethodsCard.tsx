"use client";

import React from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getPaymentMethods, deletePaymentMethod, setDefaultPaymentMethod } from "@/services/paymentGatewayService";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { 
  CreditCard, 
  Banknote, 
  Smartphone, 
  MoreVertical, 
  Star, 
  StarOff, 
  Trash2,
  PlusCircle
} from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { toast } from "@/components/ui/use-toast";
import PaymentMethodForm from "./PaymentMethodForm";

export default function PaymentMethodsCard() {
  const { openModal } = useModal();
  const queryClient = useQueryClient();

  const { data: paymentMethods, isLoading, error } = useQuery({
    queryKey: ["paymentMethods"],
    queryFn: () => getPaymentMethods(),
  });

  const deleteMutation = useMutation({
    mutationFn: (methodId: string) => deletePaymentMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries(["paymentMethods"]);
      toast({ 
        title: "Método eliminado",
        description: "El método de pago ha sido eliminado exitosamente"
      });
    },
    onError: (error) => {
      toast({
        title: "Error al eliminar",
        description: error.message || "No se pudo eliminar el método de pago",
        variant: "destructive",
      });
    },
  });

  const defaultMutation = useMutation({
    mutationFn: (methodId: string) => setDefaultPaymentMethod(methodId),
    onSuccess: () => {
      queryClient.invalidateQueries(["paymentMethods"]);
      toast({ 
        title: "Método predeterminado actualizado",
        description: "El método de pago se ha establecido como predeterminado"
      });
    },
    onError: (error) => {
      toast({
        title: "Error al actualizar",
        description: error.message || "No se pudo establecer como predeterminado",
        variant: "destructive",
      });
    },
  });

  const handleAddMethod = () => {
    openModal(<PaymentMethodForm />);
  };

  const handleDelete = (methodId) => {
    if (window.confirm("\u00bfEst\u00e1s seguro de que quieres eliminar este m\u00e9todo de pago?")) {
      deleteMutation.mutate(methodId);
    }
  };

  const handleSetDefault = (methodId) => {
    defaultMutation.mutate(methodId);
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

  const getProviderColor = (provider) => {
    switch (provider) {
      case "STRIPE":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "PAYPAL":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "PSE":
        return "bg-green-100 text-green-800 border-green-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getMethodDisplayName = (method) => {
    switch (method.provider) {
      case "STRIPE":
        if (method.type === "card") {
          const last4 = method.details?.last4 || "****";
          const brand = method.details?.brand || "Tarjeta";
          return `${brand} ****${last4}`;
        }
        return "Stripe ACH";
      case "PAYPAL":
        return method.details?.email || "Cuenta PayPal";
      case "PSE":
        return method.details?.bankName || "Transferencia PSE";
      default:
        return `${method.provider} ${method.type}`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
          <CardDescription>Cargando métodos de pago...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Métodos de Pago</CardTitle>
          <CardDescription>Error al cargar los métodos de pago</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Métodos de Pago</CardTitle>
              <CardDescription>
                Gestiona los métodos de pago configurados para procesar transacciones
              </CardDescription>
            </div>
            <Button onClick={handleAddMethod}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Agregar Método
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!paymentMethods || paymentMethods.length === 0 ? (
            <div className="text-center py-8">
              <CreditCard className="mx-auto h-12 w-12 text-muted-foreground" />
              <h3 className="mt-2 text-sm font-semibold">No hay métodos configurados</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Agrega tu primer método de pago para comenzar a procesar transacciones
              </p>
              <div className="mt-6">
                <Button onClick={handleAddMethod}>
                  <PlusCircle className="mr-2 h-4 w-4" />
                  Agregar Método de Pago
                </Button>
              </div>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {paymentMethods.map((method) => (
                <Card key={method.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${getProviderColor(method.provider)}`}>
                          {getProviderIcon(method.provider)}
                        </div>
                        <div>
                          <div className="font-medium">
                            {getMethodDisplayName(method)}
                          </div>
                          <Badge 
                            variant="outline" 
                            className={getProviderColor(method.provider)}
                          >
                            {method.provider}
                          </Badge>
                        </div>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="sm">
                            <MoreVertical className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          {!method.isDefault && (
                            <DropdownMenuItem 
                              onClick={() => handleSetDefault(method.id)}
                              disabled={defaultMutation.isLoading}
                            >
                              <Star className="mr-2 h-4 w-4" />
                              Establecer como predeterminado
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem 
                            onClick={() => handleDelete(method.id)}
                            disabled={deleteMutation.isLoading}
                            className="text-red-600 focus:text-red-600"
                          >
                            <Trash2 className="mr-2 h-4 w-4" />
                            Eliminar
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <div className="text-sm text-muted-foreground mb-2">
                      Tipo: {method.type}
                    </div>
                    {method.isDefault && (
                      <div className="flex items-center gap-1 text-sm text-yellow-600">
                        <StarOff className="h-4 w-4" />
                        Método predeterminado
                      </div>
                    )}
                    <div className="text-xs text-muted-foreground mt-2">
                      Agregado: {new Date(method.createdAt).toLocaleDateString("es-CO")}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}