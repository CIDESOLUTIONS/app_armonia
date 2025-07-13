import { fetchApi } from "@/lib/api";

interface FinancialSettings {
  bankName: string;
  accountNumber: string;
  accountType: string;
  nit: string;
  paymentMethods: string;
}

export async function getFinancialSettings(): Promise<FinancialSettings> {
  try {
    const response = await fetchApi("/api/settings/financial");
    return response;
  } catch (error) {
    console.error("Error fetching financial settings:", error);
    throw error;
  }
}

export async function updateFinancialSettings(data: FinancialSettings): Promise<FinancialSettings> {
  try {
    const response = await fetchApi("/api/settings/financial", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error updating financial settings:", error);
    throw error;
  }
}
