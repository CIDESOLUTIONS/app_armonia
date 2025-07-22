import { fetchApi } from "@/lib/api";

interface PanicAlertPayload {
  userId: number;
  complexId: number;
  location: string;
  message?: string;
  type: "EMERGENCY" | "MEDICAL" | "SECURITY" | "OTHER";
}

interface PanicAlert {
  id: number;
  userId: number;
  complexId: number;
  location: string;
  message?: string;
  type: "EMERGENCY" | "MEDICAL" | "SECURITY" | "OTHER";
  status: "ACTIVE" | "RESOLVED" | "DISMISSED";
  createdAt: string;
  updatedAt: string;
}

export async function triggerPanicAlert(data: PanicAlertPayload): Promise<PanicAlert> {
  return fetchApi("/panic/trigger", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getActivePanicAlerts(): Promise<PanicAlert[]> {
  return fetchApi("/panic/active");
}

export async function updatePanicAlertStatus(id: number, status: "RESOLVED" | "DISMISSED"): Promise<PanicAlert> {
  return fetchApi(`/panic/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
}