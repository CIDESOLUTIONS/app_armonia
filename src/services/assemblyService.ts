import { fetchApi } from "@/lib/api";
import { CreateAssemblyDto, UpdateAssemblyDto, RegisterAttendanceDto, CreateVoteDto, SubmitVoteDto } from "@/common/dto/assembly.dto";

export async function createAssembly(data: CreateAssemblyDto): Promise<any> {
  try {
    const response = await fetchApi("/assemblies", {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating assembly:", error);
    throw error;
  }
}

export async function getAssemblies(): Promise<any[]> {
  try {
    const response = await fetchApi("/assemblies");
    return response;
  } catch (error) {
    console.error("Error fetching assemblies:", error);
    throw error;
  }
}

export async function getAssemblyById(id: number): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${id}`);
    return response;
  } catch (error) {
    console.error("Error fetching assembly by ID:", error);
    throw error;
  }
}

export async function updateAssembly(id: number, data: UpdateAssemblyDto): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error updating assembly:", error);
    throw error;
  }
}

export async function deleteAssembly(id: number): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${id}`, {
      method: 'DELETE',
    });
    return response;
  } catch (error) {
    console.error("Error deleting assembly:", error);
    throw error;
  }
}

export async function registerAttendance(assemblyId: number, data: RegisterAttendanceDto): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${assemblyId}/attendance`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error registering attendance:", error);
    throw error;
  }
}

export async function createVote(assemblyId: number, data: CreateVoteDto): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${assemblyId}/votes`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error creating vote:", error);
    throw error;
  }
}

export async function submitVote(voteId: number, data: SubmitVoteDto): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${voteId}/submit-vote`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
    return response;
  } catch (error) {
    console.error("Error submitting vote:", error);
    throw error;
  }
}

export async function getVoteResults(voteId: number): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${voteId}/results`);
    return response;
  } catch (error) {
    console.error("Error fetching vote results:", error);
    throw error;
  }
}

export async function generateMeetingMinutes(assemblyId: number): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${assemblyId}/generate-minutes`, {
      method: 'POST',
    });
    return response;
  } catch (error) {
    console.error("Error generating meeting minutes:", error);
    throw error;
  }
}