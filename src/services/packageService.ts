import { fetchApi } from "@/lib/apiClient";

export interface PackageItem {
  id: string;
  type: "package" | "mail" | "document";
  trackingNumber?: string;
  courier?: string;
  destination: string; // e.g., "Apartamento 101", "Oficina 203"
  residentName: string;
  receivedAt: string;
  deliveredAt?: string;
  receivedBy?: string;
  notes?: string;
  photoUrl?: string;
  status: "pending" | "delivered" | "returned";
}

export interface RegisterPackageDto {
  type: "package" | "mail" | "document";
  trackingNumber?: string;
  courier?: string;
  destination: string;
  residentName: string;
  notes?: string;
  photo?: File; // Para la subida de archivos
}

export interface DeliverPackageDto {
  receivedBy: string;
  notes?: string;
}

export interface PackageFilterParams {
  status?: "pending" | "delivered" | "returned" | "all";
  type?: "package" | "mail" | "document" | "all";
  search?: string;
}

export async function getPackages(
  filters?: PackageFilterParams,
): Promise<PackageItem[]> {
  const query = new URLSearchParams();
  if (filters) {
    for (const key in filters) {
      if (
        filters[key as keyof PackageFilterParams] &&
        filters[key as keyof PackageFilterParams] !== "all"
      ) {
        query.append(key, filters[key as keyof PackageFilterParams] as string);
      }
    }
  }
  return fetchApi(`/packages?${query.toString()}`);
}

export async function registerPackage(
  data: RegisterPackageDto,
): Promise<PackageItem> {
  const formData = new FormData();
  formData.append("type", data.type);
  formData.append("destination", data.destination);
  formData.append("residentName", data.residentName);
  if (data.trackingNumber)
    formData.append("trackingNumber", data.trackingNumber);
  if (data.courier) formData.append("courier", data.courier);
  if (data.notes) formData.append("notes", data.notes);
  if (data.photo) formData.append("photo", data.photo);

  return fetchApi("/packages", {
    method: "POST",
    data: formData,
    headers: { "Content-Type": "multipart/form-data" },
  });
}

export async function deliverPackage(
  id: string,
  data: DeliverPackageDto,
): Promise<PackageItem> {
  return fetchApi(`/packages/${id}/deliver`, {
    method: "PUT",
    data,
  });
}

export async function returnPackage(id: string): Promise<PackageItem> {
  return fetchApi(`/packages/${id}/return`, {
    method: "PUT",
  });
}
