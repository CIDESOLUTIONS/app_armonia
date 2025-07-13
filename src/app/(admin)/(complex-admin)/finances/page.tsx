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
import { getFinanceSummary, getRecentTransactions } from "@/services/financeService";

export default function FinancesPage() {
  const { user, loading, logout } = useAuthStore();
  const [summary, setSummary] = useState<any>(null);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loadingData, setLoadingData] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [financeSummary, recentTransactions] = await Promise.all([
          getFinanceSummary(),
          getRecentTransactions(),
        ]);
        setSummary(financeSummary);
        setTransactions(recentTransactions);
      } catch (error) {
        console.error("Error fetching finance data:", error);
        // Manejar el error, quizás mostrar un mensaje al usuario
      } finally {
        setLoadingData(false);
      }
    };

    if (!loading) {
      fetchData();
    }
  }, [loading]);

  if (loading || loadingData) {
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
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Gestión Financiera</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700">
          Generar Reporte
        </button>
      </div>

      {/* Métricas principales */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Ingresos
          </h3>
          <p className="text-2xl font-bold text-green-600">
            ${summary?.totalIngresos.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Total Egresos
          </h3>
          <p className="text-2xl font-bold text-red-600">
            ${summary?.totalEgresos.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Saldo Actual
          </h3>
          <p className="text-2xl font-bold text-blue-600">
            ${summary?.saldoActual.toLocaleString() || 0}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500">
            Cuotas Pendientes
          </h3>
          <p className="text-2xl font-bold text-orange-600">
            {summary?.cuotasPendientes || 0}
          </p>
        </div>
      </div>

      {/* Tabla de movimientos recientes */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Movimientos Recientes
          </h2>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="text-left py-2">Concepto</TableHead>
                  <TableHead className="text-left py-2">Monto</TableHead>
                  <TableHead className="text-left py-2">Fecha</TableHead>
                  <TableHead className="text-left py-2">Estado</TableHead>
                  <TableHead className="text-left py-2">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {transactions.length > 0 ? (
                  transactions.map((pago) => (
                    <TableRow key={pago.id} className="border-b">
                      <TableCell className="py-3">{pago.concepto}</TableCell>
                      <TableCell className="py-3">
                        ${pago.monto.toLocaleString()}
                      </TableCell>
                      <TableCell className="py-3">{pago.fecha}</TableCell>
                      <TableCell className="py-3">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            pago.estado === "Pagado"
                              ? "bg-green-100 text-green-800"
                              : "bg-orange-100 text-orange-800"
                          }`}
                        >
                          {pago.estado}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        <button className="text-blue-600 hover:text-blue-800 mr-2">
                          Ver
                        </button>
                        <button className="text-green-600 hover:text-green-800">
                          Editar
                        </button>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center py-5">
                      No hay movimientos recientes.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </div>
      </div>
    </div>
  );
}
