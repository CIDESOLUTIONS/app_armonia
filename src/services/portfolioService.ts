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
  const response = await fetchApi("/portfolio/metrics");
  return response.data;
};

export const getComplexMetrics = async () => {
  const response = await fetchApi("/portfolio/complex-metrics");
  return response.data;
};
