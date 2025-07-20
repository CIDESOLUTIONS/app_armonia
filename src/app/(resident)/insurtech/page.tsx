"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, DollarSign, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  getInsuranceQuote,
  registerPolicy,
  InsuranceQuote,
  Policy,
} from "@/services/insurtechService";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function InsurtechPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [quoteData, setQuoteData] = useState<any>({});
  const [policyData, setPolicyData] = useState<any>({});
  const [quoteResult, setQuoteResult] = useState<InsuranceQuote | null>(null);
  const [policyResult, setPolicyResult] = useState<Policy | null>(null);

  const handleGetQuote = async () => {
    setLoading(true);
    try {
      const result = await getInsuranceQuote(quoteData);
      setQuoteResult(result);
      toast({
        title: "Cotización Obtenida",
        description: `Cotización de ${result.provider} por ${result.premium} ${result.currency}.`,
      });
    } catch (error: Error) {
      console.error("Error getting quote:", error);
      toast({
        title: "Error",
        description: "Error al obtener la cotización: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleRegisterPolicy = async () => {
    setLoading(true);
    try {
      const result = await registerPolicy(policyData);
      setPolicyResult(result);
      toast({
        title: "Póliza Registrada",
        description: `Póliza ${result.policyId} registrada con estado ${result.status}.`,
      });
    } catch (error: Error) {
      console.error("Error registering policy:", error);
      toast({
        title: "Error",
        description: "Error al registrar la póliza: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
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
      <h1 className="text-3xl font-bold text-gray-900 mb-6">
        Servicios InsurTech (Simulado)
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Obtener Cotización de Seguro</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="propertyType">Tipo de Propiedad</Label>
            <Input
              id="propertyType"
              name="propertyType"
              value={quoteData.propertyType || ""}
              onChange={(e) =>
                setQuoteData({ ...quoteData, propertyType: e.target.value })
              }
              placeholder="Ej: Apartamento, Casa"
            />
          </div>
          <div>
            <Label htmlFor="coverageAmount">Monto de Cobertura Deseado</Label>
            <Input
              id="coverageAmount"
              name="coverageAmount"
              type="number"
              value={quoteData.coverageAmount || ""}
              onChange={(e) =>
                setQuoteData({
                  ...quoteData,
                  coverageAmount: parseFloat(e.target.value),
                })
              }
              placeholder="Ej: 100000"
            />
          </div>
          <Button onClick={handleGetQuote} disabled={loading}>
            <DollarSign className="mr-2 h-4 w-4" /> Obtener Cotización
          </Button>
          {quoteResult && (
            <Alert>
              <AlertTitle>Cotización:</AlertTitle>
              <AlertDescription>
                Proveedor: {quoteResult.provider}, Prima: {quoteResult.premium}{" "}
                {quoteResult.currency}, Cobertura: {quoteResult.coverage}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Registrar Póliza Existente</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="policyNumber">Número de Póliza</Label>
            <Input
              id="policyNumber"
              name="policyNumber"
              value={policyData.policyNumber || ""}
              onChange={(e) =>
                setPolicyData({ ...policyData, policyNumber: e.target.value })
              }
              placeholder="Ej: POL123456"
            />
          </div>
          <div>
            <Label htmlFor="policyProvider">Proveedor de Póliza</Label>
            <Input
              id="policyProvider"
              name="policyProvider"
              value={policyData.policyProvider || ""}
              onChange={(e) =>
                setPolicyData({ ...policyData, policyProvider: e.target.value })
              }
              placeholder="Ej: Seguros XYZ"
            />
          </div>
          <Button onClick={handleRegisterPolicy} disabled={loading}>
            <FileText className="mr-2 h-4 w-4" /> Registrar Póliza
          </Button>
          {policyResult && (
            <Alert>
              <AlertTitle>Póliza Registrada:</AlertTitle>
              <AlertDescription>
                ID: {policyResult.policyId}, Estado: {policyResult.status},
                Inicio: {new Date(policyResult.startDate).toLocaleDateString()},
                Fin: {new Date(policyResult.endDate).toLocaleDateString()}
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}