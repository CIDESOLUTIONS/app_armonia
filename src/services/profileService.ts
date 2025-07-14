import { fetchApi } from "@/lib/api";

interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  // Add other profile fields as needed
}

export async function getProfileInfo(): Promise<UserProfile> {
  try {
    const response = await fetchApi("/api/profile");
    return response;
  } catch (error) {
    console.error("Error fetching profile info:", error);
    throw error;
  }
}

export async function updateProfileInfo(
  data: Partial<UserProfile>,
): Promise<UserProfile> {
  try {
    const response = await fetchApi("/api/profile", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error updating profile info:", error);
    throw error;
  }
}
