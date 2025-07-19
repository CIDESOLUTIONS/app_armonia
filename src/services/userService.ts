import { apiClient } from "@/lib/api";

export async function getAssignableUsers(): Promise<any[]> {
  // Implementar lógica para obtener usuarios asignables si es necesario
  return Promise.resolve([]);
}

export async function getUserProfile(userId: number): Promise<any> {
  const response = await apiClient.get(`/user/${userId}`);
  return response.data;
}
