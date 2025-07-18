import { fetchApi } from "@/lib/api";

export enum AssemblyType {
  ORDINARY = 'ORDINARY',
  EXTRAORDINARY = 'EXTRAORDINARY',
}

export enum AssemblyStatus {
  SCHEDULED = 'SCHEDULED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface Assembly {
  id: number;
  title: string;
  description: string;
  scheduledDate: string;
  location: string;
  type: AssemblyType;
  status: AssemblyStatus;
  agenda: string;
  createdAt: string;
  updatedAt: string;
  currentAttendance?: number;
  quorumMet?: boolean;
}

export interface CreateAssemblyDto {
  title: string;
  description: string;
  scheduledDate: string;
  location: string;
  type: AssemblyType;
  agenda: string;
}

export interface UpdateAssemblyDto extends Partial<CreateAssemblyDto> {
  status?: AssemblyStatus;
}

export interface CreateVoteDto {
  assemblyId: number;
  question: string;
  options: string[];
  isWeighted: boolean;
}

export interface SubmitVoteDto {
  voteId: number;
  optionId: number;
  userId: number;
  weight: number;
}

export interface VoteOption {
  id: number;
  value: string;
}

export interface Vote {
  id: number;
  assemblyId: number;
  question: string;
  isWeighted: boolean;
  isActive: boolean;
  options: VoteOption[];
}

export interface VoteResult {
  voteId: number;
  question: string;
  results: { value: string; totalWeight: number }[];
}

export async function getAssemblies(): Promise<Assembly[]> {
  return fetchApi("/assembly");
}

export async function getAssemblyById(id: number): Promise<Assembly> {
  return fetchApi(`/assembly/${id}`);
}

export async function createAssembly(data: CreateAssemblyDto): Promise<Assembly> {
  return fetchApi("/assembly", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function updateAssembly(id: number, data: UpdateAssemblyDto): Promise<Assembly> {
  return fetchApi(`/assembly/${id}`, {
    method: "PUT",
    body: JSON.stringify(data),
  });
}

export async function deleteAssembly(id: number): Promise<void> {
  return fetchApi(`/assembly/${id}`, {
    method: "DELETE",
  });
}

export async function registerAttendance(assemblyId: number, userId: number, present: boolean): Promise<any> {
  return fetchApi(`/assembly/${assemblyId}/attendance`, {
    method: "POST",
    body: JSON.stringify({ userId, present }),
  });
}

export async function getAssemblyQuorumStatus(assemblyId: number): Promise<{ currentAttendance: number; quorumMet: boolean }> {
  return fetchApi(`/assembly/${assemblyId}/quorum`);
}

export async function createVote(data: CreateVoteDto): Promise<Vote> {
  return fetchApi("/assembly/vote", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function submitVote(data: SubmitVoteDto): Promise<any> {
  return fetchApi("/assembly/vote/submit", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getVoteResults(voteId: number): Promise<VoteResult> {
  return fetchApi(`/assembly/vote/${voteId}/results`);
}

export async function generateMeetingMinutes(assemblyId: number): Promise<Blob> {
  const response = await fetchApi(`/assembly/${assemblyId}/meeting-minutes`, {
    responseType: 'blob', // Important for handling binary data
  });
  return response;
}