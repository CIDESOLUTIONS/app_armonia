import { fetchApi } from "@/lib/api";

export async function getConsolidatedFinancialReport(
  schemaNames: string[],
  startDate: string,
  endDate: string,
): Promise<Blob> {
  const response = await fetchApi(
    `/reports/consolidated-financial/pdf?startDate=${startDate}&endDate=${endDate}`,
    {
      method: "POST",
      body: JSON.stringify({ schemaNames }),
      headers: {
        "Content-Type": "application/json",
      },
    },
  );
  return response.blob();
}

export const getPortfolioMetrics = async () => {
  // This is a placeholder. In a real implementation, you would fetch actual data.
  return {
    totalIncome: 120000,
    totalProperties: 15,
    totalResidents: 2500,
    totalPendingFees: 15000,
  };
};

export const getComplexMetrics = async () => {
  // This is a placeholder. In a real implementation, you would fetch actual data.
  return [
    {
      id: 1,
      name: "Conjunto A",
      residents: 500,
      pendingFees: 2000,
      income: 40000,
    },
    {
      id: 2,
      name: "Conjunto B",
      residents: 300,
      pendingFees: 1000,
      income: 25000,
    },
  ];
};