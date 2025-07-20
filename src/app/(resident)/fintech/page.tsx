"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, DollarSign, CreditCard } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/components/ui/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  requestMicroCredit,
  getCreditScore,
  MicroCreditResponse,
  CreditScoreResponse,
} from "@/services/fintechService";

export default function FintechPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [microCreditForm, setMicroCreditForm] = useState({
    amount: 0,
    term: 0,
    purpose: "",
  });
  const [microCreditResult, setMicroCreditResult] =
    useState<MicroCreditResponse | null>(null);
  const [creditScoreResult, setCreditScoreResult] =
    useState<CreditScoreResponse | null>(null);

  const handleMicroCreditRequest = async () => {
    setLoading(true);
    try {
      const result = await requestMicroCredit(microCreditForm);
      setMicroCreditResult(result);
      toast({
        title: "Solicitud Enviada",
        description: `Solicitud de microcrédito ${result.applicationId} enviada con estado ${result.status}.`,
      });
    } catch (error) {
      console.error("Error requesting micro-credit:", error);
      toast({
        title: "Error",
        description: "Error al solicitar el microcrédito.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGetCreditScore = async () => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Usuario no autenticado.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    try {
      const result = await getCreditScore(user.id);
      setCreditScoreResult(result);
      toast({
        title: "Puntaje de Crédito Obtenido",
        description: `Tu puntaje de crédito es: ${result.score}.`,
      });
    } catch (error) {
      console.error("Error getting credit score:", error);
      toast({
        title: "Error",
        description: "Error al obtener el puntaje de crédito.",
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
        Servicios FinTech (Simulado)
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Solicitar Microcrédito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              name="amount"
              type="number"
              value={microCreditForm.amount}
              onChange={(e) =>
                setMicroCreditForm({
                  ...microCreditForm,
                  amount: parseFloat(e.target.value),
                })
              }
              placeholder="Ej: 500"
            />
          </div>
          <div>
            <Label htmlFor="term">Plazo (meses)</Label>
            <Input
              id="term"
              name="term"
              type="number"
              value={microCreditForm.term}
              onChange={(e) =>
                setMicroCreditForm({
                  ...microCreditForm,
                  term: parseInt(e.target.value),
                })
              }
              placeholder="Ej: 12"
            />
          </div>
          <div>
            <Label htmlFor="purpose">Propósito</Label>
            <Textarea
              id="purpose"
              name="purpose"
              value={microCreditForm.purpose}
              onChange={(e) =>
                setMicroCreditForm({
                  ...microCreditForm,
                  purpose: e.target.value,
                })
              }
              placeholder="Ej: Reparación de vivienda"
            />
          </div>
          <Button onClick={handleMicroCreditRequest} disabled={loading}>
            <DollarSign className="mr-2 h-4 w-4" /> Solicitar Microcrédito
          </Button>
          {microCreditResult && (
            <Alert>
              <AlertTitle>Resultado de la Solicitud:</AlertTitle>
              <AlertDescription>
                ID: {microCreditResult.applicationId}, Estado:{" "}
                {microCreditResult.status}, Monto: {microCreditResult.amount},
                Plazo: {microCreditResult.term} meses
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Consultar Puntaje de Crédito</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={handleGetCreditScore} disabled={loading}>
            <CreditCard className="mr-2 h-4 w-4" /> Obtener Puntaje de Crédito
          </Button>
          {creditScoreResult && (
            <Alert>
              <AlertTitle>Puntaje de Crédito:</AlertTitle>
              <AlertDescription>
                Tu puntaje es: {creditScoreResult.score} (Proveedor:{" "}
                {creditScoreResult.provider})
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
