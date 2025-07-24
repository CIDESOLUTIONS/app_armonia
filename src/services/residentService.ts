import { apiClient } from "@/lib/apiClient";

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
  const response = await apiClient.get("/residents/dashboard-metrics");
  return response.data;
};

export const getResidents = async (): Promise<ResidentData[]> => {
  const response = await apiClient.get("/inventory/residents");
  return response.data;
};

export const updateResident = async (
  id: number,
  data: UpdateResidentData,
): Promise<ResidentData> => {
  const response = await apiClient.put(`/inventory/residents/${id}`, data);
  return response.data;
};

export const createResident = async (
  data: CreateResidentData,
): Promise<ResidentData> => {
  const response = await apiClient.post("/inventory/residents", data);
  return response.data;
};

export const deleteResident = async (id: number): Promise<void> => {
  await apiClient.delete(`/inventory/residents/${id}`);
};
