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

export async function getPreRegisteredVisitors(): Promise<PreRegisteredVisitor[]> {
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
    // Placeholder for API call to validate QR code and get visitor info
    console.log("Scanning QR Code:", qrCode);
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

export async function registerPackage(data: any): Promise<any> {
  try {
    const response = await fetchApi("/packages/register", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error registering package:", error);
    throw error;
  }
}

export async function deliverPackage(packageId: string): Promise<any> {
  try {
    const response = await fetchApi(`/packages/${packageId}/deliver`, {
      method: "POST",
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