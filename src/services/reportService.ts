import { fetchApi } from "@/lib/apiClient";

export const generatePeaceAndSafePdf = async (
  residentId: number,
): Promise<ArrayBuffer> => {
  return fetchApi(`/reports/peace-and-safe/pdf/${residentId}`, {
    responseType: "arraybuffer",
  });
};

export const generateConsolidatedFinancialReportPdf = async (
  schemaNames: string[],
  startDate: string,
  endDate: string,
): Promise<ArrayBuffer> => {
  return fetchApi(`/reports/consolidated-financial/pdf`, {
    method: "POST",
    data: { schemaNames, startDate, endDate },
    responseType: "arraybuffer",
  });
};
