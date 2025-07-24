import { apiClient } from "@/lib/apiClient";

export interface ResidentialComplex {
  id: number;
  name: string;
  address: string;
  schemaName: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export interface UpdateResidentialComplexData {
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
}

export const getResidentialComplexes = async (): Promise<ResidentialComplex[]> => {
  const response = await apiClient.get('/residential-complexes');
  return response.data;
};

export const getResidentialComplexById = async (id: number): Promise<ResidentialComplex> => {
  const response = await apiClient.get(`/residential-complexes/${id}`);
  return response.data;
};

export const updateResidentialComplex = async (
  id: number,
  data: UpdateResidentialComplexData,
): Promise<ResidentialComplex> => {
  const response = await apiClient.put(`/residential-complexes/${id}`, data);
  return response.data;
};
