import { fetchApi } from "@/lib/apiClient";

export enum AssemblyStatus {
  SCHEDULED = "SCHEDULED",
  IN_PROGRESS = "IN_PROGRESS",
  COMPLETED = "COMPLETED",
  CANCELLED = "CANCELLED",
}

export enum VoteType {
  SIMPLE_MAJORITY = "SIMPLE_MAJORITY",
  QUALIFIED_MAJORITY = "QUALIFIED_MAJORITY",
  UNANIMOUS = "UNANIMOUS",
  COEFFICIENT_BASED = "COEFFICIENT_BASED",
}

export enum VoteStatus {
  ACTIVE = "ACTIVE",
  CLOSED = "CLOSED",
  PENDING = "PENDING",
}

export interface Assembly {
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
  attendees?: any[]; // Simplified for now
  votes?: AssemblyVoteDto[]; // Use AssemblyVoteDto
  quorumStatus?: QuorumStatus; // Add quorum status
  agenda?: string; // Add agenda
  currentCoefficient?: number; // Add currentCoefficient
  requiredCoefficient?: number; // Add requiredCoefficient
}

export interface CreateAssemblyDto {
  title: string;
  description: string;
  scheduledDate: string;
  location: string;
  status: AssemblyStatus;
  agenda?: string;
}

export interface UpdateAssemblyDto extends Partial<CreateAssemblyDto> {}

export interface AssemblyVoteDto {
  id: number;
  assemblyId: number;
  title: string;
  description: string;
  options: { id: string; text: string; value?: string }[]; // Added value for options
  type: VoteType;
  status: VoteStatus;
  weightedVoting: boolean;
  startTime: string;
  endTime?: string;
  result?: any; // Simplified for now
  isApproved?: boolean; // Add isApproved
}

export interface CreateVoteDto {
  assemblyId: number;
  question: string;
  options: string[];
  isWeighted: boolean;
}

export interface SubmitVoteDto {
  voteId: number;
  option: string;
  userId: number;
  unitId: number;
  weight: number;
}

export interface VoteResult {
  totalVotes: number;
  totalWeight: number;
  results: { value: string; count: number; totalWeight: number }[];
}

export interface QuorumStatus {
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

export const getAssemblies = async (): Promise<Assembly[]> => {
  return fetchApi("/assemblies");
};

export const getAssemblyById = async (id: number): Promise<Assembly> => {
  return fetchApi(`/assemblies/${id}`);
};

export const createAssembly = async (data: CreateAssemblyDto): Promise<Assembly> => {
  return fetchApi("/assemblies", { method: 'POST', data });
};

export const updateAssembly = async (
  id: number,
  data: UpdateAssemblyDto,
): Promise<Assembly> => {
  return fetchApi(`/assemblies/${id}`, { method: 'PUT', data });
};

export const deleteAssembly = async (id: number): Promise<void> => {
  await fetchApi(`/assemblies/${id}`, { method: 'DELETE' });
};

export const registerAttendance = async (
  assemblyId: number,
  unitId: number,
): Promise<any> => {
  return fetchApi(`/assemblies/${assemblyId}/attendance`, { method: 'POST', data: { unitId } });
};

export const getAssemblyQuorumStatus = async (assemblyId: number): Promise<QuorumStatus> => {
  return fetchApi(`/assemblies/${assemblyId}/quorum-status`);
};

export const createVote = async (
  assemblyId: number,
  data: CreateVoteDto,
): Promise<AssemblyVoteDto> => {
  return fetchApi(`/assemblies/${assemblyId}/votes`, { method: 'POST', data });
};

export const submitVote = async (
  voteId: number,
  unitId: number,
  option: string,
): Promise<any> => {
  return fetchApi(`/assemblies/${voteId}/submit-vote`, { method: 'POST', data: { unitId, option } });
};

export const getVoteResults = async (voteId: number): Promise<VoteResult> => {
  return fetchApi(`/assemblies/${voteId}/results`);
};

export const generateMeetingMinutes = async (assemblyId: number): Promise<ArrayBuffer> => {
  return fetchApi(
    `/assemblies/${assemblyId}/generate-minutes`,
    { method: 'POST', responseType: 'arraybuffer' },
  );
};