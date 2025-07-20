import apiClient from "@/lib/apiClient"; // Assuming you have an apiClient configured

export interface ServiceProviderDto {
  id: number;
  name: string;
  category: string;
  description?: string;
  contact: string;
  logoUrl?: string;
  rating?: number; // Add rating field
}

export interface ServiceProviderFilters {
  search?: string;
  category?: string;
}

export const getServiceProviders = async (
  filters: ServiceProviderFilters,
): Promise<ServiceProviderDto[]> => {
  const response = await apiClient.get("/service-providers", {
    params: filters,
  });
  return response.data;
};

export const createServiceProvider = async (
  data: Omit<ServiceProviderDto, "id">,
): Promise<ServiceProviderDto> => {
  const response = await apiClient.post("/service-providers", data);
  return response.data;
};

export const updateServiceProvider = async (
  id: number,
  data: Partial<Omit<ServiceProviderDto, "id">>,
): Promise<ServiceProviderDto> => {
  const response = await apiClient.put(`/service-providers/${id}`, data);
  return response.data;
};

export const deleteServiceProvider = async (id: number): Promise<void> => {
  await apiClient.delete(`/service-providers/${id}`);
};
