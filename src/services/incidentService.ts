import { fetchApi } from "@/lib/api";

export interface Incident {
  id: string;
  title: string;
  description: string;
  category: "security" | "maintenance" | "emergency" | "other";
  priority: "low" | "medium" | "high" | "critical";
  location: string;
  reportedAt: string;
  reportedBy: string;
  assignedTo?: string;
  resolvedAt?: string;
  status: "reported" | "in_progress" | "resolved" | "closed";
  updates: IncidentUpdate[];
  attachments: IncidentAttachment[];
}

export interface IncidentUpdate {
  id: string;
  content: string;
  timestamp: string;
  author: string;
  attachments: IncidentAttachment[];
}

export interface IncidentAttachment {
  id: string;
  name: string;
  url: string;
  type: string;
  size: number;
}

export interface CreateIncidentDto {
  title: string;
  description: string;
  category: "security" | "maintenance" | "emergency" | "other";
  priority: "low" | "medium" | "high" | "critical";
  location: string;
  reportedBy: string;
  attachments?: string[]; // URLs de los adjuntos
}

export interface UpdateIncidentDto {
  content?: string;
  status?: "reported" | "in_progress" | "resolved" | "closed";
  attachments?: string[]; // URLs de los adjuntos
}

export async function getIncidents(): Promise<Incident[]> {
  try {
    const response = await fetchApi("/incidents");
    return response.data; // Assuming the API returns { data: Incident[] }
  } catch (error) {
    console.error("Error fetching incidents:", error);
    throw error;
  }
}

export async function getIncidentById(id: string): Promise<Incident> {
  try {
    const response = await fetchApi(`/incidents/${id}`);
    return response.data; // Assuming the API returns { data: Incident }
  } catch (error) {
    console.error(`Error fetching incident with ID ${id}:`, error);
    throw error;
  }
}

export async function createIncident(
  data: CreateIncidentDto,
): Promise<Incident> {
  try {
    const response = await fetchApi("/incidents", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: Incident }
  } catch (error) {
    console.error("Error creating incident:", error);
    throw error;
  }
}

export async function updateIncident(
  id: string,
  data: UpdateIncidentDto,
): Promise<Incident> {
  try {
    const response = await fetchApi(`/incidents/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: Incident }
  } catch (error) {
    console.error("Error updating incident:", error);
    throw error;
  }
}

export async function uploadIncidentAttachments(
  files: File[],
): Promise<{ urls: string[] }> {
  try {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("files", file); // 'files' is the field name for the array of files
    });
    const response = await fetchApi(
      "/incidents/upload-attachment",
      {
        method: "POST",
        body: formData,
      },
      true,
    ); // The third parameter indicates that Content-Type should not be automatically added
    return response.data; // Assuming the API returns { data: { urls: string[] } }
  } catch (error) {
    console.error("Error uploading incident attachments:", error);
    throw error;
  }
}
