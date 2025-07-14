import { fetchApi } from "@/lib/api";

interface BrandingSettings {
  logoUrl?: string;
  primaryColor: string;
  secondaryColor: string;
}

export async function getBrandingSettings(): Promise<BrandingSettings> {
  try {
    const response = await fetchApi("/api/settings/branding");
    return response;
  } catch (error) {
    console.error("Error fetching branding settings:", error);
    throw error;
  }
}

export async function updateBrandingSettings(
  data: FormData,
): Promise<BrandingSettings> {
  try {
    const response = await fetchApi("/api/settings/branding", {
      method: "PUT",
      body: data, // FormData will be handled automatically by fetch
    });
    return response;
  } catch (error) {
    console.error("Error updating branding settings:", error);
    throw error;
  }
}
