"use client";

import React, { useState, useCallback } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2, Upload, FileText, CheckCircle, XCircle } from "lucide-react";
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
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/components/ui/use-toast";
import { reconcileTransactions } from "@/services/bankReconciliationService";
import * as XLSX from 'xlsx';

interface BankTransaction {
  date: string;
  description: string;
  amount: number;
  type: string;
  reference: string;
}

interface ReconciliationResult {
  bankTransaction: BankTransaction;
  systemPayment: any; // Replace with actual PaymentDto if available
  status: 'MATCHED' | 'UNMATCHED';
}

export default function BankReconciliationPage() {
  const { user } = useAuthStore();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [reconciliationResults, setReconciliationResults] = useState<ReconciliationResult[]>([]);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setFile(event.target.files[0]);
    } else {
      setFile(null);
    }
  };

  const handleReconcile = useCallback(async () => {
    if (!file) {
      toast({
        title: "Advertencia",
        description: "Por favor, selecciona un archivo de extracto bancario.",
        variant: "warning",
      });
      return;
    }

    setLoading(true);
    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: 'array' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const json = XLSX.utils.sheet_to_json(worksheet);

        // Assuming the CSV/Excel has columns like 'Date', 'Description', 'Amount', 'Type', 'Reference'
        const bankTransactions: BankTransaction[] = json.map((row: any) => ({
          date: row.Date,
          description: row.Description,
          amount: row.Amount,
          type: row.Type,
          reference: row.Reference,
        }));

        if (!user?.schemaName) {
          toast({
            title: "Error",
            description: "No se pudo obtener el esquema del usuario.",
            variant: "destructive",
          });
          setLoading(false);
          return;
        }

        const results = await reconcileTransactions(user.schemaName, bankTransactions);
        setReconciliationResults(results);
        toast({
          title: "Éxito",
          description: "Conciliación bancaria completada.",
        });
      };
      reader.readAsArrayBuffer(file);
    } catch (error: any) {
      console.error("Error during reconciliation:", error);
      toast({
        title: "Error",
        description: "Error al realizar la conciliación: " + error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  }, [file, user?.schemaName, toast]);

  if (loading) {
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

      <div className="bg-white shadow-md rounded-lg p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Importar Extracto Bancario</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
          <div>
            <Label htmlFor="bankStatementFile">Seleccionar Archivo (CSV/Excel)</Label>
            <Input
              id="bankStatementFile"
              type="file"
              accept=".csv, .xls, .xlsx"
              onChange={handleFileChange}
            />
          </div>
          <Button onClick={handleReconcile} disabled={!file || loading}>
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Upload className="mr-2 h-4 w-4" />
            )}
            Conciliar Extracto
          </Button>
        </div>
      </div>

      {reconciliationResults.length > 0 && (
        <div className="bg-white shadow-md rounded-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Resultados de la Conciliación</h2>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha Transacción</TableHead>
                <TableHead>Descripción Bancaria</TableHead>
                <TableHead>Monto Bancario</TableHead>
                <TableHead>Referencia Bancaria</TableHead>
                <TableHead>Pago en Sistema</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {reconciliationResults.map((result, index) => (
                <TableRow key={index}>
                  <TableCell>{result.bankTransaction.date}</TableCell>
                  <TableCell>{result.bankTransaction.description}</TableCell>
                  <TableCell>{result.bankTransaction.amount}</TableCell>
                  <TableCell>{result.bankTransaction.reference}</TableCell>
                  <TableCell>
                    {result.systemPayment ? (
                      `ID: ${result.systemPayment.id} - Monto: ${result.systemPayment.amount}`
                    ) : (
                      "N/A"
                    )}
                  </TableCell>
                  <TableCell>
                    {result.status === "MATCHED" ? (
                      <Badge variant="default" className="bg-green-100 text-green-800">
                        <CheckCircle className="h-4 w-4 mr-1" /> Conciliado
                      </Badge>
                    ) : (
                      <Badge variant="destructive">
                        <XCircle className="h-4 w-4 mr-1" /> No Conciliado
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
}
