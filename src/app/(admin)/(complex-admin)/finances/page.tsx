"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";
import { Loader2 } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  getFinanceSummary,
  getRecentTransactions,
} from "@/services/financeService";
import { BankStatementUpload } from "@/components/finances/BankStatementUpload";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Placeholder Components for missing functionalities
const FeeGenerationSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Generación de Cuotas</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Aquí se gestionará la generación de cuotas.</p>
    </CardContent>
  </Card>
);

const FineManagementSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Gestión de Multas e Intereses</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Aquí se gestionarán las multas e intereses.</p>
    </CardContent>
  </Card>
);

const PaymentGatewaySection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Integración con Pasarelas de Pago</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Aquí se configurarán las pasarelas de pago.</p>
    </CardContent>
  </Card>
);

const FinancialReportsSection = () => (
  <Card>
    <CardHeader>
      <CardTitle>Informes Financieros</CardTitle>
    </CardHeader>
    <CardContent>
      <p>Aquí se generarán los informes financieros.</p>
    </CardContent>
  </Card>
);

export default function FinancesPage() {
  const { user } = useAuthStore();
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      if (!user || !user.complexId) {
        setLoading(false);
        return;
      }
      try {
        const [summaryData, transactionsData] = await Promise.all([
          getFinanceSummary(user.complexId),
          getRecentTransactions(user.complexId),
        ]);
        setSummary(summaryData);
        setTransactions(transactionsData);
      } catch (error) {
        console.error("Error fetching financial data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

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
        Módulo Financiero
      </h1>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="fees">Cuotas</TabsTrigger>
          <TabsTrigger value="fines">Multas/Intereses</TabsTrigger>
          <TabsTrigger value="payments">Pagos</TabsTrigger>
          <TabsTrigger value="reports">Informes</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="mt-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Saldo Actual
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary?.currentBalance || "$0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary?.balanceChange || "+0.00%"} desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Ingresos del Mes
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary?.monthlyIncome || "$0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary?.incomeChange || "+0.00%"} desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Gastos del Mes
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary?.monthlyExpenses || "$0.00"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary?.expenseChange || "+0.00%"} desde el mes pasado
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Facturas Pendientes
                </CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {summary?.pendingBills || "0"}
                </div>
                <p className="text-xs text-muted-foreground">
                  {summary?.pendingBillsAmount || "$0.00"} total
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="mt-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Transacciones Recientes
            </h2>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Descripción</TableHead>
                  <TableHead>Monto</TableHead>
                  <TableHead>Tipo</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((transaction: any) => (
                    <TableRow key={transaction.id}>
                      <TableCell>
                        {new Date(transaction.date).toLocaleDateString()}
                      </TableCell>
                      <TableCell>{transaction.description}</TableCell>
                      <TableCell>{transaction.amount}</TableCell>
                      <TableCell>{transaction.type}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center">
                      No hay transacciones recientes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="fees" className="mt-6">
          <FeeGenerationSection />
        </TabsContent>

        <TabsContent value="fines" className="mt-6">
          <FineManagementSection />
        </TabsContent>

        <TabsContent value="payments" className="mt-6">
          <PaymentGatewaySection />
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <FinancialReportsSection />
        </TabsContent>
      </Tabs>

      <div className="mt-8">
        <BankStatementUpload />
      </div>
    </div>
  );
}
