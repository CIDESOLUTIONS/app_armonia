import { apiClient, fetchApi } from "@/lib/apiClient";

export interface PanicAlert {
  id: number;
  userId: number;
  complexId: number;
  location?: string;
  type: string;
  status: "ACTIVE" | "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
  description?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePanicAlertDto {
  type: string;
  location?: string;
  description?: string;
}

export interface UpdatePanicAlertDto {
  status?: "IN_PROGRESS" | "RESOLVED" | "DISMISSED";
  description?: string;
}

export interface PanicResponseDto {
  alertId: number;
  actionTaken: string;
  notes?: string;
}

export const getPanicAlerts = (filters: any = {}): Promise<PanicAlert[]> => {
  return fetchApi("/panic/alerts", { params: filters });
};

export const getActivePanicAlerts = (): Promise<PanicAlert[]> => {
  return fetchApi("/panic/alerts", { params: { status: "ACTIVE" } });
};

export const getPanicAlertById = (id: number): Promise<PanicAlert> => {
  return fetchApi(`/panic/alerts/${id}`);
};

export const triggerPanicAlert = (
  data: CreatePanicAlertDto,
): Promise<PanicAlert> => {
  return fetchApi("/panic/alert", { method: "POST", data });
};

export const updatePanicAlert = (
  id: number,
  data: UpdatePanicAlertDto,
): Promise<PanicAlert> => {
  return fetchApi(`/panic/alerts/${id}`, { method: "PUT", data });
};

export const updatePanicAlertStatus = (
  id: number,
  status: PanicAlert["status"],
): Promise<PanicAlert> => {
  return fetchApi(`/panic/alerts/${id}`, { method: "PUT", data: { status } });
};

export const addPanicResponse = (data: PanicResponseDto): Promise<any> => {
  return fetchApi("/panic/responses", { method: "POST", data });
};
