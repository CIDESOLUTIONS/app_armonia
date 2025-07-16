import { fetchApi } from "@/lib/api";

export interface DigitalLog {
  id: number;
  complexId: number;
  shiftDate: string;
  shiftStart: string;
  shiftEnd?: string;
  guardOnDuty: number;
  relievedBy?: number;
  logType:
    | "GENERAL"
    | "INCIDENT"
    | "VISITOR"
    | "MAINTENANCE"
    | "PATROL"
    | "HANDOVER"
    | "EMERGENCY"
    | "SYSTEM_CHECK";
  priority: "LOW" | "NORMAL" | "HIGH" | "URGENT" | "CRITICAL";
  title: string;
  description: string;
  location?: string;
  involvedPersons?: Array<{
    name: string;
    documentId?: string;
    role?: string;
    unit?: string;
  }>;
  attachments?: Array<{
    url: string;
    type: string;
    name: string;
  }>;
  photos?: Array<{
    url: string;
    caption?: string;
    timestamp?: string;
  }>;
  status: "OPEN" | "IN_REVIEW" | "RESOLVED" | "CLOSED" | "CANCELLED";
  requiresFollowUp: boolean;
  followUpDate?: string;
  category:
    | "ACCESS_CONTROL"
    | "VISITOR_MGMT"
    | "INCIDENT"
    | "MAINTENANCE"
    | "SAFETY"
    | "EMERGENCY"
    | "PATROL"
    | "SYSTEM_ALERT"
    | "COMMUNICATION"
    | "OTHER";
  subcategory?: string;
  incidentId?: number;
  visitorId?: number;
  unitId?: number;
  weatherConditions?: string;
  temperature?: number;
  patrolChecks?: Array<{
    checkpoint: string;
    time: string;
    status: string;
    observations?: string;
  }>;
  systemChecks?: Array<{
    system: string;
    status: string;
    notes?: string;
  }>;
  guardSignature?: string;
  supervisorReview: boolean;
  reviewedBy?: number;
  reviewedAt?: string;
  reviewNotes?: string;
  createdAt: string;
  updatedAt: string;
  guard: {
    id: number;
    name: string;
    email: string;
  };
  reliever?: {
    id: number;
    name: string;
    email: string;
  };
  creator: {
    id: number;
    name: string;
    email: string;
  };
  reviewer?: {
    id: number;
    name: string;
    email: string;
  };
}

export interface CreateDigitalLogData {
  shiftDate: string;
  shiftStart: string;
  shiftEnd?: string;
  relievedBy?: number;
  logType?: DigitalLog["logType"];
  priority?: DigitalLog["priority"];
  title: string;
  description: string;
  location?: string;
  involvedPersons?: DigitalLog["involvedPersons"];
  attachments?: DigitalLog["attachments"];
  photos?: DigitalLog["photos"];
  requiresFollowUp?: boolean;
  followUpDate?: string;
  category?: DigitalLog["category"];
  subcategory?: string;
  incidentId?: number;
  visitorId?: number;
  unitId?: number;
  weatherConditions?: string;
  temperature?: number;
  patrolChecks?: DigitalLog["patrolChecks"];
  systemChecks?: DigitalLog["systemChecks"];
  guardSignature?: string;
}

export interface SearchFilters {
  startDate?: string;
  endDate?: string;
  logType?: string;
  priority?: string;
  status?: string;
  category?: string;
  guardId?: number;
  requiresFollowUp?: boolean;
  page?: number;
  limit?: number;
}

export interface Pagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export async function createDigitalLog(data: CreateDigitalLogData): Promise<{ success: boolean; digitalLog?: DigitalLog; message?: string }> {
  try {
    const response = await fetchApi("/security/digital-logs", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response;
  } catch (error: any) {
    return { success: false, message: error.message || "Error creando minuta digital" };
  }
}

export async function updateDigitalLog(id: number, updates: Partial<DigitalLog>): Promise<{ success: boolean; digitalLog?: DigitalLog; message?: string }> {
  try {
    const response = await fetchApi(`/security/digital-logs/${id}`, {
      method: "PUT",
      body: JSON.stringify(updates),
    });
    return response;
  } catch (error: any) {
    return { success: false, message: error.message || "Error actualizando minuta" };
  }
}

export async function deleteDigitalLog(id: number): Promise<{ success: boolean; message?: string }> {
  try {
    const response = await fetchApi(`/security/digital-logs/${id}`, {
      method: "DELETE",
    });
    return response;
  } catch (error: any) {
    return { success: false, message: error.message || "Error eliminando minuta" };
  }
}

export async function getDigitalLog(id: number): Promise<{ success: boolean; digitalLog?: DigitalLog; message?: string }> {
  try {
    const response = await fetchApi(`/security/digital-logs/${id}`);
    return response;
  } catch (error: any) {
    return { success: false, message: error.message || "Error obteniendo minuta" };
  }
}

export async function searchDigitalLogs(filters: SearchFilters): Promise<{ success: boolean; digitalLogs?: DigitalLog[]; pagination?: Pagination; message?: string }> {
  try {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        params.append(key, String(value));
      }
    });
    const response = await fetchApi(`/security/digital-logs?${params.toString()}`);
    return response;
  } catch (error: any) {
    return { success: false, message: error.message || "Error buscando minutas" };
  }
}

export async function reviewDigitalLog(id: number, reviewNotes?: string): Promise<{ success: boolean; digitalLog?: DigitalLog; message?: string }> {
  try {
    const response = await updateDigitalLog(id, {
      supervisorReview: true,
      reviewNotes,
      status: "IN_REVIEW",
    });
    return response;
  } catch (error: any) {
    return { success: false, message: error.message || "Error revisando minuta" };
  }
}