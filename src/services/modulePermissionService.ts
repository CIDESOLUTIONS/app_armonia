import { fetchApi } from "@/lib/api";

interface ModulePermission {
  id: string;
  name: string;
  description: string;
  enabled: boolean;
  permissions: { role: string; canView: boolean; canEdit: boolean }[];
}

export async function getModulePermissions(): Promise<ModulePermission[]> {
  try {
    const response = await fetchApi("/api/settings/modules-permissions");
    return response;
  } catch (error) {
    console.error("Error fetching module permissions:", error);
    throw error;
  }
}

export async function updateModulePermissions(
  data: ModulePermission[],
): Promise<ModulePermission[]> {
  try {
    const response = await fetchApi("/api/settings/modules-permissions", {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error updating module permissions:", error);
    throw error;
  }
}
