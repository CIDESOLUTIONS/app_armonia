import { fetchApi } from "@/lib/api";

export async function generateVisitorsReport(
  type: "pdf" | "excel",
  startDate: string,
  endDate: string,
): Promise<Blob> {
  try {
    const response = await fetchApi(
      `/reports/visitors/${type}?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.blob();
  } catch (error) {
    console.error(`Error generating visitors ${type} report:`, error);
    throw error;
  }
}

export async function generatePackagesReport(
  type: "pdf" | "excel",
  startDate: string,
  endDate: string,
): Promise<Blob> {
  try {
    const response = await fetchApi(
      `/reports/packages/${type}?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.blob();
  } catch (error) {
    console.error(`Error generating packages ${type} report:`, error);
    throw error;
  }
}

export async function generateIncidentsReport(
  type: "pdf" | "excel",
  startDate: string,
  endDate: string,
): Promise<Blob> {
  try {
    const response = await fetchApi(
      `/reports/incidents/${type}?startDate=${startDate}&endDate=${endDate}`,
    );
    return response.blob();
  } catch (error) {
    console.error(`Error generating incidents ${type} report:`, error);
    throw error;
  }
}
