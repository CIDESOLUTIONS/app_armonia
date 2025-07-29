import { fetchApi } from "@/lib/apiClient";

export interface ResidentData {
  id: number;
  name: string;
  email: string;
  phone?: string;
  propertyId: number;
  unitNumber?: string;
  isOwner: boolean;
}

export interface CreateResidentData {
  name: string;
  email: string;
  phone?: string;
  propertyId: number;
  isOwner: boolean;
}

export interface UpdateResidentData extends Partial<CreateResidentData> {}

export const getResidentDashboardMetrics = async () => {
  return fetchApi("/residents/dashboard-metrics");
};

export const getResidents = async (): Promise<ResidentData[]> => {
  return fetchApi("/inventory/residents");
};

export const updateResident = async (
  id: number,
  data: UpdateResidentData,
): Promise<ResidentData> => {
  return fetchApi(`/inventory/residents/${id}`, { method: "PUT", data });
};

export const createResident = async (
  data: CreateResidentData,
): Promise<ResidentData> => {
  return fetchApi("/inventory/residents", { method: "POST", data });
};

export const deleteResident = async (id: number): Promise<void> => {
  await fetchApi(`/inventory/residents/${id}`, { method: "DELETE" });
};
