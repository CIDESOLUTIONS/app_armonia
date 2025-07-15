import { fetchApi } from "@/lib/api";

interface FinanceSummary {
  totalIngresos: number;
  totalEgresos: number;
  saldoActual: number;
  cuotasPendientes: number;
}

interface FinancialTransaction {
  id: number;
  concepto: string;
  monto: number;
  fecha: string;
  estado: string;
}

export async function getFinanceSummary(): Promise<FinanceSummary> {
  try {
    const response = await fetchApi("/finances/stats");
    return response;
  } catch (error) {
    console.error("Error fetching finance summary:", error);
    throw error;
  }
}

export async function getRecentTransactions(): Promise<FinancialTransaction[]> {
  try {
    const response = await fetchApi("/finances/transactions"); // Este endpoint no existe en el backend NestJS, lo dejaré así por ahora.
    return response;
  } catch (error) {
    console.error("Error fetching recent transactions:", error);
    throw error;
  }
}

export async function uploadBankStatement(file: File): Promise<any> {
  try {
    const formData = new FormData();
    formData.append('file', file);
    const response = await fetchApi("/finances/upload-statement", {
      method: 'POST',
      body: formData,
    }, true); // El tercer parámetro indica que no se debe añadir Content-Type automáticamente
    return response;
  } catch (error) {
    console.error("Error uploading bank statement:", error);
    throw error;
  }
}