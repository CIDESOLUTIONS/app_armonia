import { fetchApi } from "@/lib/api";

export enum AssemblyStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export interface AssemblyDto {
  id: number;
  title: string;
  description: string;
  scheduledDate: string;
  location: string;
  status: AssemblyStatus;
  realtimeChannel: string;
  createdBy: number;
  createdAt: string;
  updatedAt: string;
  attendees?: AssemblyAttendanceDto[];
  votes?: AssemblyVoteDto[];
}

export interface CreateAssemblyDto {
  title: string;
  description: string;
  scheduledDate: string;
  location: string;
}

export interface UpdateAssemblyDto {
  title?: string;
  description?: string;
  scheduledDate?: string;
  location?: string;
  status?: AssemblyStatus;
}

export interface AssemblyAttendanceDto {
  id: number;
  assemblyId: number;
  userId: number;
  unitId: number;
  checkInTime: string;
  checkOutTime?: string;
  notes?: string;
  proxyName?: string;
  proxyDocument?: string;
  isDelegate: boolean;
  isOwner: boolean;
  user: { name: string }; // Assuming user object is populated
  unit: { name: string; coefficient: number }; // Assuming unit object is populated
}

export interface AssemblyVoteDto {
  id: number;
  assemblyId: number;
  title: string;
  description: string;
  options: string[];
  startTime: string;
  endTime?: string;
  status: "ACTIVE" | "COMPLETED";
  weightedVoting: boolean;
  createdBy: string;
  results?: any; // Populated after vote ends
  voteRecords?: any[]; // Populated for results
}

export interface CreateVoteDto {
  title: string;
  description: string;
  options: string[];
  weightedVoting: boolean;
}

export interface SubmitVoteDto {
  voteId: number;
  userId: number;
  unitId: number;
  option: string;
}

export interface QuorumStatusDto {
  currentAttendance: number;
  quorumMet: boolean;
  totalUnits: number;
  presentUnits: number;
  totalCoefficients: number;
  presentCoefficients: number;
  quorumPercentage: number;
  requiredQuorum: number;
  timestamp: string;
}

export async function createAssembly(data: CreateAssemblyDto): Promise<AssemblyDto> {
  try {
    const response = await fetchApi("/assemblies", {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: AssemblyDto }
  } catch (error) {
    console.error("Error creating assembly:", error);
    throw error;
  }
}

export async function getAssemblies(): Promise<AssemblyDto[]> {
  try {
    const response = await fetchApi("/assemblies");
    return response.data; // Assuming the API returns { data: AssemblyDto[] }
  } catch (error) {
    console.error("Error fetching assemblies:", error);
    throw error;
  }
}

export async function getAssemblyById(id: number): Promise<AssemblyDto> {
  try {
    const response = await fetchApi(`/assemblies/${id}`);
    return response.data; // Assuming the API returns { data: AssemblyDto }
  } catch (error) {
    console.error(`Error fetching assembly with ID ${id}:`, error);
    throw error;
  }
}

export async function updateAssembly(
  id: number,
  data: UpdateAssemblyDto,
): Promise<AssemblyDto> {
  try {
    const response = await fetchApi(`/assemblies/${id}`, {
      method: "PUT",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: AssemblyDto }
  } catch (error) {
    console.error("Error updating assembly:", error);
    throw error;
  }
}

export async function deleteAssembly(id: number): Promise<void> {
  try {
    await fetchApi(`/assemblies/${id}`, {
      method: "DELETE",
    });
  } catch (error) {
    console.error("Error deleting assembly:", error);
    throw error;
  }
}

export async function registerAttendance(
  assemblyId: number,
  unitId: number,
  present: boolean,
): Promise<AssemblyAttendanceDto> {
  try {
    const response = await fetchApi(`/assemblies/${assemblyId}/attendance`, {
      method: "POST",
      body: JSON.stringify({ unitId, present }),
    });
    return response.data; // Assuming the API returns { data: AssemblyAttendanceDto }
  } catch (error) {
    console.error("Error registering attendance:", error);
    throw error;
  }
}

export async function getAssemblyQuorumStatus(assemblyId: number): Promise<QuorumStatusDto> {
  try {
    const response = await fetchApi(`/assemblies/${assemblyId}/quorum-status`);
    return response.data; // Assuming the API returns { data: QuorumStatusDto }
  } catch (error) {
    console.error("Error fetching quorum status:", error);
    throw error;
  }
}

export async function createVote(assemblyId: number, data: CreateVoteDto): Promise<AssemblyVoteDto> {
  try {
    const response = await fetchApi(`/assemblies/${assemblyId}/votes`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data; // Assuming the API returns { data: AssemblyVoteDto }
  } catch (error) {
    console.error("Error creating vote:", error);
    throw error;
  }
}

export async function submitVote(voteId: number, data: SubmitVoteDto): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${voteId}/submit-vote`, {
      method: "POST",
      body: JSON.stringify(data),
    });
    return response.data;
  } catch (error) {
    console.error("Error submitting vote:", error);
    throw error;
  }
}

export async function getVotingResults(voteId: number): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${voteId}/results`);
    return response.data;
  } catch (error) {
    console.error("Error fetching voting results:", error);
    throw error;
  }
}

export async function generateMeetingMinutes(assemblyId: number): Promise<any> {
  try {
    const response = await fetchApi(`/assemblies/${assemblyId}/generate-minutes`);
    return response.data;
  } catch (error) {
    console.error("Error generating meeting minutes:", error);
    throw error;
  }
}