import { fetchApi } from "@/lib/api";

// DTOs y Enums del Backend (armonia-backend/src/common/dto/assembly.dto.ts)
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

export class CreateAssemblyDto {
  title: string;
  description: string;
  scheduledDate: string;
  location: string;
  type: AssemblyType;
  agenda: string;
}

export class UpdateAssemblyDto extends CreateAssemblyDto {
  status?: AssemblyStatus;
}

export class AssemblyDto {
  id: number;
  title: string;
  description: string;
  scheduledDate: Date;
  location: string;
  type: AssemblyType;
  status: AssemblyStatus;
  agenda: string;
  createdAt: Date;
  updatedAt: Date;
}

export class RegisterAttendanceDto {
  assemblyId: number;
  userId: number;
  present?: boolean;
}

export class CreateVoteDto {
  assemblyId: number;
  question: string;
  options: string[]; // Array of option texts
  isWeighted: boolean;
}

export class SubmitVoteDto {
  voteId: number;
  optionId: number; // Use option ID instead of index
  userId: number;
  weight: number;
}

// Interfaces adicionales del Frontend (src/services/assembly-service-client.ts)
export enum VotingStatus {
  PENDING = "PENDING",
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  CANCELLED = "CANCELLED",
}

export enum VotingType {
  SIMPLE_MAJORITY = "SIMPLE_MAJORITY",
  QUALIFIED_MAJORITY = "QUALIFIED_MAJORITY",
  UNANIMOUS = "UNANIMOUS",
}

export interface Assembly extends AssemblyDto {
  currentAttendance?: number;
  quorumMet?: boolean;
  minutes?: string;
  attachments?: string[];
}

export interface Vote {
  id: number;
  votingId: number;
  propertyId: number;
  userId: number;
  value: string;
  coefficient: number;
  comments?: string;
  createdAt: string;
}

export interface Voting {
  id: number;
  assemblyId: number;
  title: string;
  description: string;
  type: VotingType;
  status: VotingStatus;
  startTime?: string;
  endTime?: string;
  options: string[];
  result?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
  votes: Vote[];
}

export interface Attendance {
  id: number;
  assemblyId: number;
  propertyId: number;
  userId: number;
  propertyUnit: string;
  coefficient: number;
  userName: string;
  attendanceType: "PRESENT" | "PROXY" | "VIRTUAL";
  proxyName?: string;
  checkInTime: string;
  checkOutTime?: string;
}

export interface AssemblyListResponse {
  assemblies: Assembly[];
  total: number;
  page: number;
  limit: number;
}

export interface CreateVotingDto {
  assemblyId: number;
  title: string;
  description: string;
  type: VotingType;
  options: string[];
}

export interface CastVoteDto {
  votingId: number;
  propertyId: number;
  value: string;
  comments?: string;
}

export interface AssemblyFilterParams {
  page?: number;
  limit?: number;
  status?: AssemblyStatus;
  type?: AssemblyType;
  startDate?: string;
  endDate?: string;
  search?: string;
}

// Funciones del Servicio
export async function getAssemblies(filters?: AssemblyFilterParams): Promise<AssemblyListResponse> {
  const queryParams = new URLSearchParams();
  if (filters) {
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        queryParams.append(key, String(value));
      }
    });
  }
  const query = queryParams.toString();
  return fetchApi(`/assembly${query ? `?${query}` : ""}`);
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

export async function registerAttendance(data: RegisterAttendanceDto): Promise<Attendance> {
  return fetchApi("/assembly/attendance", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getAssemblyQuorumStatus(assemblyId: number): Promise<{ currentAttendance: number; quorumMet: boolean }> {
  return fetchApi(`/assembly/${assemblyId}/quorum`);
}

export async function createVoting(data: CreateVotingDto): Promise<Voting> {
  return fetchApi("/assembly/voting", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function getVotings(assemblyId: number): Promise<Voting[]> {
  return fetchApi(`/assembly/${assemblyId}/votings`);
}

export async function startVoting(id: number): Promise<Voting> {
  return fetchApi(`/assembly/voting/${id}/start`, {
    method: "PUT",
    body: JSON.stringify({}),
  });
}

export async function closeVoting(id: number): Promise<Voting> {
  return fetchApi(`/assembly/voting/${id}/close`, {
    method: "PUT",
    body: JSON.stringify({}),
  });
}

export async function castVote(data: CastVoteDto): Promise<Vote> {
  return fetchApi("/assembly/vote", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function generateMeetingMinutes(assemblyId: number): Promise<Blob> {
  const response = await fetchApi(`/assembly/${assemblyId}/meeting-minutes`, {
    responseType: 'blob', // Important for handling binary data
  });
  return response;
}