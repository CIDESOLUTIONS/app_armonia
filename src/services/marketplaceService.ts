import { fetchApi } from "@/lib/api";
import {
  CreateListingDto,
  UpdateListingDto,
  ListingFilterParamsDto,
  ReportListingDto,
} from "@/common/dto/marketplace.dto";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

export async function getListings(
  filters?: ListingFilterParamsDto & { authorId?: number },
): Promise<any[]> {
  try {
    const query = filters ? new URLSearchParams(filters as any).toString() : "";
    const response = await fetchApi(`/marketplace/listings?${query}`);
    return response;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
}

export async function createListing(data: CreateListingDto): Promise<any> {
  try {
    const response = await fetchApi("/marketplace/listings", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating listing:", error);
    throw error;
  }
}

export async function getListingById(id: number): Promise<any> {
  try {
    const response = await fetchApi(`/marketplace/listings/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching listing by ID:", error);
    throw error;
  }
}

export async function updateListing(
  id: number,
  data: UpdateListingDto,
): Promise<any> {
  try {
    const response = await fetchApi(`/marketplace/listings/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error updating listing:", error);
    throw error;
  }
}

export async function deleteListing(id: number): Promise<any> {
  try {
    const response = await fetchApi(`/marketplace/listings/${id}`, {
      method: "DELETE",
    });
    return response;
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
    return response;
  } catch (error) {
    console.error("Error reporting listing:", error);
    throw error;
  }
}

export async function getReportedListings(): Promise<any[]> {
  try {
    const response = await fetchApi("/marketplace/moderation/reports");
    return response;
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
    return response;
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
    return response;
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
}

export async function getMarketplaceCategories(): Promise<string[]> {
  try {
    const response = await fetchApi("/marketplace/categories");
    return response;
  } catch (error) {
    console.error("Error fetching marketplace categories:", error);
    throw error;
  }
}
