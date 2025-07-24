import { apiClient } from "@/lib/apiClient";

interface Project {
  id: number;
  title: string; // Changed from name to title
  description?: string;
  startDate: string;
  endDate?: string;
  status: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; // Consistent with schema
  budget: number; // Added
  collectedFunds: number; // Added
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

interface GetProjectsParams {
  status?: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; // Consistent with schema
  search?: string;
}

interface CreateProjectData {
  title: string; // Changed from name to title
  description?: string;
  status?: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; // Consistent with schema
  startDate: string;
  endDate?: string;
  budget: number; // Added
  collectedFunds: number; // Added
  assignedToId?: number;
}

interface UpdateProjectData {
  id: number;
  title?: string; // Changed from name to title
  description?: string;
  status?: "PLANNED" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED"; // Consistent with schema
  startDate?: string;
  endDate?: string;
  budget?: number; // Added
  collectedFunds?: number; // Added
  assignedToId?: number;
}

export async function getProjects(
  params?: GetProjectsParams,
): Promise<Project[]> {
  try {
    const query = new URLSearchParams();
    if (params?.status) query.append("status", params.status);
    if (params?.search) query.append("search", params.search);

    const response = await fetchApi(`/projects?${query.toString()}`);
    return response.data; // Assuming the API returns { data: Project[] }
  } catch (error) {
    console.error("Error fetching projects:", error);
    throw error;
  }
}

export async function getProjectById(id: number): Promise<Project> {
  try {
    const response = await fetchApi(`/projects/${id}`);
    return response.data; // Assuming the API returns { data: Project }
  } catch (error) {
    console.error(`Error fetching project ${id}:`, error);
    throw error;
  }
}

export async function createProject(data: CreateProjectData): Promise<Project> {
  try {
    const response = await fetchApi("/projects", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: Project }
  } catch (error) {
    console.error("Error creating project:", error);
    throw error;
  }
}

export async function updateProject(
  id: number,
  data: UpdateProjectData,
): Promise<Project> {
  try {
    const response = await fetchApi(`/projects/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: Project }
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
}

export async function deleteProject(id: number): Promise<void> {
  try {
    await fetchApi(`/projects/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
}

export async function getResidentProjects(
  residentId: number,
): Promise<Project[]> {
  try {
    const response = await fetchApi(`/projects/resident/${residentId}`);
    return response.data; // Assuming the API returns { data: Project[] }
  } catch (error) {
    console.error(`Error fetching projects for resident ${residentId}:`, error);
    throw error;
  }
}
