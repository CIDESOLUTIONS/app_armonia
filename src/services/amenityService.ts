import { fetchApi } from "@/lib/api";

interface Amenity {
  id: number;
  name: string;
  description?: string;
  location: string;
  capacity: number;
  requiresApproval: boolean;
  hasFee: boolean;
  feeAmount?: number;
  isActive: boolean;
}

interface CreateAmenityData {
  name: string;
  description?: string;
  location: string;
  capacity: number;
  requiresApproval?: boolean;
  hasFee?: boolean;
  feeAmount?: number;
  isActive?: boolean;
}

interface UpdateAmenityData {
  name?: string;
  description?: string;
  location?: string;
  capacity?: number;
  requiresApproval?: boolean;
  hasFee?: boolean;
  feeAmount?: number;
  isActive?: boolean;
}

export async function getAmenities(): Promise<Amenity[]> {
  try {
    const response = await fetchApi("/inventory/amenities");
    return response;
  } catch (error) {
    console.error("Error fetching amenities:", error);
    throw error;
  }
}

export async function createAmenity(data: CreateAmenityData): Promise<Amenity> {
  try {
    const response = await fetchApi("/inventory/amenities", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating amenity:", error);
    throw error;
  }
}

export async function updateAmenity(
  id: number,
  data: UpdateAmenityData,
): Promise<Amenity> {
  try {
    const response = await fetchApi(`/inventory/amenities/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error updating amenity:", error);
    throw error;
  }
}

export async function deleteAmenity(id: number): Promise<void> {
  try {
    await fetchApi(`/inventory/amenities/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting amenity:", error);
    throw error;
  }
}
