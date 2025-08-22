"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { getTransactions } from "@/services/paymentGatewayService";
import TransactionsDataTable from "./components/TransactionsDataTable";
import PaymentMethodsCard from "./components/PaymentMethodsCard";
import { Button } from "@/components/ui/button";
import { PlusCircle, CreditCard, Settings } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import PaymentForm from "./components/PaymentForm";
import PaymentMethodForm from "./components/PaymentMethodForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function PaymentGatewaysPage() {
  const { openModal } = useModal();

  const {
    data: transactions,
    isLoading: loadingTransactions,
    error: transactionsError,
  } = useQuery({
    queryKey: ["transactions"],
    queryFn: () => getTransactions(),
  });

  const handleNewPayment = () => {
    openModal(<PaymentForm />);
  };

  const handleAddPaymentMethod = () => {
    openModal(<PaymentMethodForm />);
  };

  if (loadingTransactions) return <div className="p-6">Cargando...</div>;
  if (transactionsError) return <div className="p-6">Error al cargar las transacciones</div>;

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Pasarelas de Pago</h1>
          <p className="text-muted-foreground">
            Gestiona transacciones, métodos de pago y configuración de pasarelas
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleAddPaymentMethod} variant="outline">
            <CreditCard className="mr-2 h-4 w-4" />
            Agregar Método
          </Button>
          <Button onClick={handleNewPayment}>
            <PlusCircle className="mr-2 h-4 w-4" />
            Nuevo Pago
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Transacciones</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{transactions?.length || 0}</div>
            <p className="text-xs text-muted-foreground">En el último mes</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Exitosas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">
              {transactions?.filter(t => t.status === 'COMPLETED').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Pagos completados</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pendientes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">
              {transactions?.filter(t => t.status === 'PENDING').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">En proceso</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fallidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">
              {transactions?.filter(t => t.status === 'FAILED').length || 0}
            </div>
            <p className="text-xs text-muted-foreground">Error en pago</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content Tabs */}
      <Tabs defaultValue="transactions" className="w-full">
        <TabsList>
          <TabsTrigger value="transactions">Transacciones</TabsTrigger>
          <TabsTrigger value="methods">Métodos de Pago</TabsTrigger>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
        </TabsList>
        
        <TabsContent value="transactions" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Transacciones</CardTitle>
              <CardDescription>
                Visualiza y gestiona todas las transacciones procesadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TransactionsDataTable data={transactions || []} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="methods" className="mt-6">
          <PaymentMethodsCard />
        </TabsContent>
        
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Configuración de Pasarelas</CardTitle>
              <CardDescription>
                Administra la configuración de Stripe, PayPal y PSE
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-center py-8">
                  <Settings className="mx-auto h-12 w-12 text-muted-foreground" />
                  <h3 className="mt-2 text-sm font-semibold">Configuración de Pasarelas</h3>
                  <p className="mt-1 text-sm text-muted-foreground">
                    La configuración se encuentra en las variables de entorno
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}