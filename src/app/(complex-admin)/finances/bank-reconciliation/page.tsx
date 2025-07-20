"use client";

import React, { useState } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Upload, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useToast } from "@/components/ui/use-toast";
import {
  processBankStatement,
  approveReconciliation,
} from "@/services/financeService"; // Assuming financeService exists
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ReconciliationSuggestion } from "@/services/financeService";

export default function BankReconciliationPage() {
  const { user, loading: authLoading } = useAuthStore();
  const { toast } = useToast();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<ReconciliationSuggestion[]>(
    [],
  );

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setSelectedFile(event.target.files[0]);
    } else {
      setSelectedFile(null);
    }
  };

  const handleProcessStatement = async () => {
    if (!selectedFile) {
      toast({
        title: "Advertencia",
        description: "Por favor, selecciona un archivo de extracto bancario.",
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      // Assuming processBankStatement takes a File object and returns ReconciliationSuggestion[]
      const result = await processBankStatement(
        user?.complexId || "",
        selectedFile,
      );
      setSuggestions(result);
      toast({
        title: "Éxito",
        description: "Extracto procesado y sugerencias generadas.",
      });
    } catch (error: Error) {
      console.error("Error processing bank statement:", error);
      toast({
        title: "Error",
        description: "Error al procesar el extracto bancario: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleApproveSuggestion = async (
    suggestion: ReconciliationSuggestion,
  ) => {
    setLoading(true);
    try {
      // Assuming approveReconciliation takes a reconciliationId and tenantId
      await approveReconciliation(
        user?.complexId || "",
        suggestion.transaction.id,
      ); // Assuming transaction.id can be used as reconciliationId
      toast({
        title: "Éxito",
        description: "Sugerencia de conciliación aprobada.",
      });
      // Refresh suggestions or remove approved one
      setSuggestions((prev) =>
        prev.map((s) =>
          s.transaction.description === suggestion.transaction.description
            ? { ...s, status: "APPROVED" }
            : s,
        ),
      );
    } catch (error: Error) {
      console.error("Error approving suggestion:", error);
      toast({
        title: "Error",
        description: "Error al aprobar la sugerencia: " + error.message,
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
        Conciliación Bancaria Automática
      </h1>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Subir Extracto Bancario</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col space-y-4">
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <Label htmlFor="bankStatement">
              Archivo de Extracto (CSV, Excel)
            </Label>
            <Input
              id="bankStatement"
              type="file"
              onChange={handleFileChange}
              accept=".csv,.xls,.xlsx"
            />
          </div>
          <Button
            onClick={handleProcessStatement}
            disabled={!selectedFile || loading}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Procesar Extracto
          </Button>
        </CardContent>
      </Card>

      {suggestions.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sugerencias de Conciliación</CardTitle>
            <CardDescription>
              Revisa las transacciones y aprueba las coincidencias.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha Transacción</TableHead>
                  <TableHead>Descripción Transacción</TableHead>
                  <TableHead>Monto Transacción</TableHead>
                  <TableHead>Pago Coincidente</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {suggestions.map((suggestion, index) => (
                  <TableRow key={index}>
                    <TableCell>{suggestion.transaction.date}</TableCell>
                    <TableCell>{suggestion.transaction.description}</TableCell>
                    <TableCell>{suggestion.transaction.amount}</TableCell>
                    <TableCell>
                      {suggestion.matchingPayment
                        ? `ID: ${suggestion.matchingPayment.id}, Monto: ${suggestion.matchingPayment.amount}`
                        : "N/A"}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={
                          suggestion.status === "MATCHED"
                            ? "default"
                            : suggestion.status === "APPROVED"
                              ? "outline" // Changed from 'success' to 'outline'
                              : "destructive"
                        }
                      >
                        {suggestion.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {suggestion.status === "UNMATCHED" && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleApproveSuggestion(suggestion)}
                          disabled={loading}
                        >
                          <CheckCircle className="mr-2 h-4 w-4" /> Aprobar
                        </Button>
                      )}
                      {suggestion.status === "MATCHED" && (
                        <Button variant="ghost" size="sm" disabled>
                          <CheckCircle className="mr-2 h-4 w-4" /> Coincidente
                        </Button>
                      )}
                      {suggestion.status === "APPROVED" && (
                        <Button variant="ghost" size="sm" disabled>
                          <CheckCircle className="mr-2 h-4 w-4" /> Aprobado
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
