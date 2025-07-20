import { fetchApi } from "@/lib/api";

export interface ResidentialComplex {
  id: number;
  name: string;
  address: string;
  city: string;
  country: string;
  schemaName: string;
  adminId: number;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  planId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateResidentialComplexDto {
  name: string;
  address: string;
  city: string;
  country: string;
  schemaName: string;
  adminId: number;
  contactEmail: string;
  contactPhone: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  planId: number;
  isActive?: boolean;
}

export interface UpdateResidentialComplexDto {
  name?: string;
  address?: string;
  city?: string;
  country?: string;
  contactEmail?: string;
  contactPhone?: string;
  logoUrl?: string;
  primaryColor?: string;
  secondaryColor?: string;
  planId?: number;
  isActive?: boolean;
}

export async function getResidentialComplexes(): Promise<ResidentialComplex[]> {
  try {
    const response = await fetchApi("/residential-complexes");
    return response.data;
  } catch (error) {
    console.error("Error fetching residential complexes:", error);
    throw error;
  }
}

export async function getResidentialComplexById(
  id: number,
): Promise<ResidentialComplex> {
  try {
    const response = await fetchApi(`/residential-complexes/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching residential complex ${id}:`, error);
    throw error;
  }
}

export async function createResidentialComplex(
  data: CreateResidentialComplexDto,
): Promise<ResidentialComplex> {
  try {
    const response = await fetchApi("/residential-complexes", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error creating residential complex:", error);
    throw error;
  }
}

export async function updateResidentialComplex(
  id: number,
  data: UpdateResidentialComplexDto,
): Promise<ResidentialComplex> {
  try {
    const response = await fetchApi(`/residential-complexes/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error updating residential complex:", error);
    throw error;
  }
}

export async function deleteResidentialComplex(id: number): Promise<void> {
  try {
    await fetchApi(`/residential-complexes/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting residential complex:", error);
    throw error;
  }
}
