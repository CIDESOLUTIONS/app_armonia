import { apiClient } from "@/lib/apiClient";

export const generatePeaceAndSafePdf = async (residentId: number): Promise<ArrayBuffer> => {
  const response = await apiClient.get(`/reports/peace-and-safe/pdf/${residentId}`, {
    responseType: 'arraybuffer',
  });
  return response.data;
};

export const generateConsolidatedFinancialReportPdf = async (
  schemaNames: string[],
  startDate: string,
  endDate: string,
): Promise<ArrayBuffer> => {
  const response = await apiClient.post(
    `/reports/consolidated-financial/pdf`,
    { schemaNames, startDate, endDate },
    {
      responseType: 'arraybuffer',
    },
  );
  return response.data;
};
