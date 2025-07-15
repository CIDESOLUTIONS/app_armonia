import { fetchApi } from "@/lib/api";
import { CreatePanicAlertDto, UpdatePanicAlertDto } from "@/common/dto/panic.dto";

export async function createPanicAlert(data: CreatePanicAlertDto): Promise<any> {
  try {
    const response = await fetchApi("/panic/alert", {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating panic alert:", error);
    throw error;
  }
}

export async function getActivePanicAlerts(): Promise<any[]> {
  try {
    const response = await fetchApi("/panic/active-alerts");
    return response;
  } catch (error) {
    console.error("Error fetching active panic alerts:", error);
    throw error;
  }
}

export async function updatePanicAlertStatus(id: number, data: UpdatePanicAlertDto): Promise<any> {
  try {
    const response = await fetchApi(`/panic/alert/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error updating panic alert status:", error);
    throw error;
  }
}
