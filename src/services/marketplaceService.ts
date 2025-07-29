import { fetchApi } from "@/lib/apiClient";
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
  const query = filters ? new URLSearchParams(filters as any).toString() : "";
  return fetchApi(`/marketplace/listings?${query}`);
}

export async function createListing(data: CreateListingDto): Promise<Listing> {
  return fetchApi("/marketplace/listings", { method: "POST", data });
}

export async function getListingById(id: number): Promise<Listing> {
  return fetchApi(`/marketplace/listings/${id}`);
}

export async function updateListing(
  id: number,
  data: UpdateListingDto,
): Promise<Listing> {
  return fetchApi(`/marketplace/listings/${id}`, { method: "PUT", data });
}

export async function deleteListing(id: number): Promise<void> {
  await fetchApi(`/marketplace/listings/${id}`, { method: "DELETE" });
}

export async function reportListing(data: ReportListingDto): Promise<any> {
  return fetchApi("/marketplace/listings/report", { method: "POST", data });
}

export async function getReportedListings(): Promise<any[]> {
  return fetchApi("/marketplace/moderation/reports");
}

export async function resolveReport(
  reportId: number,
  action: "APPROVE" | "REJECT",
): Promise<any> {
  return fetchApi(`/marketplace/moderation/reports/${reportId}/resolve`, {
    method: "POST",
    data: { action },
  });
}

export async function uploadImage(file: File): Promise<{ url: string }> {
  const formData = new FormData();
  formData.append("file", file);
  return fetchApi("/marketplace/upload-image", {
    method: "POST",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function getMarketplaceCategories(): Promise<string[]> {
  return fetchApi("/marketplace/categories");
}
