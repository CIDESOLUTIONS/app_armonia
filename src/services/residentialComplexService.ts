import { fetchApi } from "@/lib/apiClient";

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
  return fetchApi('/residential-complexes');
};

export const getResidentialComplexById = async (id: number): Promise<ResidentialComplex> => {
  return fetchApi(`/residential-complexes/${id}`);
};

export const updateResidentialComplex = async (
  id: number,
  data: UpdateResidentialComplexData,
): Promise<ResidentialComplex> => {
  return fetchApi(`/residential-complexes/${id}`, { method: 'PUT', data });
};