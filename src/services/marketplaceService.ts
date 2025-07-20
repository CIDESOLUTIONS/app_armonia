import { fetchApi } from "@/lib/api";
import {
  CreateListingDto,
  UpdateListingDto,
  ListingFilterParamsDto,
  ReportListingDto,
} from "@/common/dto/marketplace.dto";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

interface Listing {
  id: number;
  title: string;
  description: string;
  price: number;
  category: string;
  images: string[];
  author: {
    id: number;
    name: string;
  };
  status: "ACTIVE" | "SOLD" | "PAUSED"; // Added status field
  createdAt: string;
}

export async function getListings(
  filters?: ListingFilterParamsDto & { authorId?: number },
): Promise<Listing[]> {
  try {
    const query = filters ? new URLSearchParams(filters as any).toString() : "";
    const response = await fetchApi(`/marketplace/listings?${query}`);
    return response.data; // Assuming the API returns { data: Listing[] }
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

export async function createListing(data: CreateListingDto): Promise<Listing> {
  try {
    const response = await fetchApi("/marketplace/listings", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: Listing }
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
}

export async function getListingById(id: number): Promise<Listing> {
  try {
    const response = await fetchApi(`/marketplace/listings/${id}`);
    return response.data; // Assuming the API returns { data: Listing }
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw error;
  }
}

export async function updateListing(
  id: number,
  data: UpdateListingDto,
): Promise<Listing> {
  try {
    const response = await fetchApi(`/marketplace/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: Listing }
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
}

export async function deleteListing(id: number): Promise<void> {
  try {
    await fetchApi(`/marketplace/listings/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting listing:", error);
    throw error;
  }
}

export async function reportListing(data: ReportListingDto): Promise<any> {
  try {
    const response = await fetchApi("/marketplace/listings/report", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: any }
  } catch (error) {
    console.error("Error reporting listing:", error);
    throw error;
  }
}

export async function getReportedListings(): Promise<any[]> {
  try {
    const response = await fetchApi("/marketplace/moderation/reports");
    return response.data; // Assuming the API returns { data: any[] }
  } catch (error) {
    console.error("Error fetching reported listings:", error);
    throw error;
  }
}

export async function resolveReport(
  reportId: number,
  action: "APPROVE" | "REJECT",
): Promise<any> {
  try {
    const response = await fetchApi(
      `/marketplace/moderation/reports/${reportId}/resolve`,
      {
        method: "POST",
        body: JSON.stringify({ action }),
      },
    );
    return response.data; // Assuming the API returns { data: any }
  } catch (error) {
    console.error("Error resolving report:", error);
    throw error;
  }
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetchApi(
      "/marketplace/upload-image",
      {
        method: "POST",
        body: formData,
      },
      true,
    ); // The third parameter indicates that Content-Type should not be automatically added
    return response.data; // Assuming the API returns { data: { url: string } }
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function getMarketplaceCategories(): Promise<string[]> {
  try {
    const response = await fetchApi("/marketplace/categories");
    return response.data; // Assuming the API returns { data: string[] }
  } catch (error) {
    console.error("Error fetching marketplace categories:", error);
    throw error;
  }
}
