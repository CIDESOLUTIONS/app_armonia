
import { apiClient } from "@/lib/apiClient";

export interface CreatePanicAlertData {
  userId: number;
  complexId: number;
  location: string;
  type: string;
  status: string;
}

export const createPanicAlert = async (data: CreatePanicAlertData): Promise<any> => {
  const response = await apiClient.post('/panic/alert', data);
  return response.data;
};
