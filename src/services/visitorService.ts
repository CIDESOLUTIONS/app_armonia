import { fetchApi } from "@/lib/api";

export interface PreRegisteredVisitor {
  id: number;
  name: string;
  documentType: string;
  documentNumber: string;
  expectedDate: string;
  validFrom: string;
  validUntil: string;
  purpose?: string;
  residentId: number;
  unitId: number;
  complexId: string;
  qrCodeUrl?: string; // URL del QR generado
  photoUrl?: string; // URL de la foto del visitante
}

export interface CreatePreRegisteredVisitorDto {
  name: string;
  documentType: string;
  documentNumber: string;
  expectedDate: string;
  validFrom: string;
  validUntil: string;
  purpose?: string;
  residentId: number;
  unitId: number;
  complexId: string;
  photoUrl?: string; // URL de la foto del visitante
}

export interface Package {
  id: number;
  trackingNumber: string;
  recipientUnit: string;
  sender?: string;
  description?: string;
  status: "REGISTERED" | "DELIVERED" | "RETURNED";
  registrationDate: string;
  deliveryDate?: string;
  photoUrl?: string; // Added photoUrl for packages
}

export interface RegisterPackageDto {
  trackingNumber: string;
  recipientUnit: string;
  sender?: string;
  description?: string;
  photoUrl?: string; // Added photoUrl for packages
}

export interface PackageFilterParams {
  status?: "REGISTERED" | "DELIVERED" | "RETURNED";
  recipientUnit?: string;
  search?: string;
}

export async function createPreRegisteredVisitor(
  data: CreatePreRegisteredVisitorDto,
): Promise<PreRegisteredVisitor> {
  try {
    const response = await fetchApi("/visitors/pre-register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: PreRegisteredVisitor }
  } catch (error) {
    console.error("Error creating pre-registered visitor:", error);
    throw error;
  }
}

export async function getPreRegisteredVisitors(): Promise<
  PreRegisteredVisitor[]
> {
  try {
    const response = await fetchApi("/visitors/pre-registered");
    return response.data; // Assuming the API returns { data: PreRegisteredVisitor[] }
  } catch (error) {
    console.error("Error fetching pre-registered visitors:", error);
    throw error;
  }
}

export async function scanQrCode(qrCode: string): Promise<any> {
  try {
    const response = await fetchApi("/visitors/scan-qr", {
      method: "POST",
      body: JSON.stringify({ qrCode }),
    });
    return response.data;
  } catch (error) {
    console.error("Error scanning QR code:", error);
    throw error;
  }
}

export async function registerPackage(
  data: RegisterPackageDto,
): Promise<Package> {
  try {
    const response = await fetchApi("/packages", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error registering package:", error);
    throw error;
  }
}

export async function deliverPackage(packageId: number): Promise<Package> {
  try {
    const response = await fetchApi(`/packages/${packageId}/deliver`, {
      method: "PUT", // Changed to PUT as per common REST practices for updates
    });
    return response.data;
  } catch (error) {
    console.error("Error delivering package:", error);
    throw error;
  }
}

export async function uploadVisitorImage(file: File): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetchApi(
      "/visitors/upload-image",
      {
        method: "POST",
        body: formData,
      },
      true,
    ); // The third parameter indicates that Content-Type should not be automatically added
    return response.data; // Assuming the API returns { data: { url: string } }
  } catch (error) {
    console.error("Error uploading visitor image:", error);
    throw error;
  }
}

export async function uploadPackageImage(file: File): Promise<{ url: string }> {
  try {
    const formData = new FormData();
    formData.append("file", file);
    const response = await fetchApi(
      "/packages/upload-image",
      {
        method: "POST",
        body: formData,
      },
      true,
    ); // The third parameter indicates that Content-Type should not be automatically added
    return response.data; // Assuming the API returns { data: { url: string } }
  } catch (error) {
    console.error("Error uploading package image:", error);
    throw error;
  }
}

export async function getPackages(
  filters?: PackageFilterParams,
): Promise<Package[]> {
  try {
    const query = new URLSearchParams();
    if (filters) {
      for (const key in filters) {
        if (filters[key as keyof PackageFilterParams]) {
          query.append(
            key,
            filters[key as keyof PackageFilterParams] as string,
          );
        }
      }
    }
    const response = await fetchApi(`/packages?${query.toString()}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching packages:", error);
    throw error;
  }
}

export async function getPackageById(id: number): Promise<Package> {
  try {
    const response = await fetchApi(`/packages/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching package with ID ${id}:`, error);
    throw error;
  }
}
