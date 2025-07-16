import { fetchApi } from "@/lib/api";

interface Property {
  id: number;
  unitNumber: string;
  address: string;
  type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  isActive: boolean;
}

interface CreatePropertyData {
  unitNumber: string;
  address: string;
  type: string;
  area: number;
  bedrooms: number;
  bathrooms: number;
  parkingSpaces: number;
  isActive: boolean;
}

interface UpdatePropertyData {
  unitNumber?: string;
  address?: string;
  type?: string;
  area?: number;
  bedrooms?: number;
  bathrooms?: number;
  parkingSpaces?: number;
  isActive?: boolean;
}

export async function getProperties(): Promise<Property[]> {
  try {
    const response = await fetchApi("/inventory/properties");
    return response;
  } catch (error) {
    console.error("Error fetching properties:", error);
    throw error;
  }
}

export async function createProperty(
  data: CreatePropertyData,
): Promise<Property> {
  try {
    const response = await fetchApi("/inventory/properties", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating property:", error);
    throw error;
  }
}

export async function updateProperty(
  id: number,
  data: UpdatePropertyData,
): Promise<Property> {
  try {
    const response = await fetchApi(`/inventory/properties/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error updating property:", error);
    throw error;
  }
}

export async function deleteProperty(id: number): Promise<void> {
  try {
    await fetchApi(`/inventory/properties/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting property:", error);
    throw error;
  }
}
