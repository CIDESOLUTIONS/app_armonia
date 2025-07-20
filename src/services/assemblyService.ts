import { getPrisma } from "@/lib/prisma";

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

export const getVoteResults = async (
  assemblyId: number,
  tenantId: string,
): Promise<VoteResult> => {
  const prisma = getPrisma(tenantId);
  console.log("Getting vote results for assembly:", assemblyId);
  // Simulated data for demonstration
  return {
    totalVotes: 100,
    totalWeight: 100,
    results: [
      { value: "A favor", count: 70, totalWeight: 70 },
      { value: "En contra", count: 20, totalWeight: 20 },
      { value: "Abstención", count: 10, totalWeight: 10 },
    ],
  };
};

export const getAssemblyById = async (
  assemblyId: number,
  tenantId: string,
): Promise<Assembly | null> => {
  const prisma = getPrisma(tenantId);
  console.log("Getting assembly by ID:", assemblyId);
  // Simulated data for demonstration
  return {
    id: assemblyId,
    title: "Asamblea General Ordinaria",
    description: "Discusión y aprobación de presupuesto 2024.",
    scheduledDate: "2024-08-15T10:00:00Z",
    location: "Salón Comunal",
    status: AssemblyStatus.SCHEDULED,
    realtimeChannel: `assembly-${assemblyId}`,
    createdBy: 1,
    createdAt: "2024-07-01T09:00:00Z",
    updatedAt: "2024-07-01T09:00:00Z",
    quorumStatus: {
      currentAttendance: 50,
      quorumMet: false,
      totalUnits: 100,
      presentUnits: 50,
      totalCoefficients: 100,
      presentCoefficients: 45,
      quorumPercentage: 45,
      requiredQuorum: 51,
      timestamp: new Date().toISOString(),
    },
    votes: [
      {
        id: 1,
        assemblyId: assemblyId,
        title: "Aprobación de Presupuesto",
        description: "Votación sobre el presupuesto anual.",
        options: [
          { id: "opt1", text: "A favor", value: "A favor" },
          { id: "opt2", text: "En contra", value: "En contra" },
        ],
        type: VoteType.SIMPLE_MAJORITY,
        status: VoteStatus.ACTIVE,
        weightedVoting: false,
        startTime: "2024-08-15T10:30:00Z",
      },
    ],
  };
};

export const updateAssembly = async (
  assemblyId: number,
  data: UpdateAssemblyDto,
  tenantId: string,
): Promise<Assembly> => {
  const prisma = getPrisma(tenantId);
  console.log("Updating assembly:", assemblyId, data);
  // Simulated data for demonstration
  return {
    id: assemblyId,
    title: data.title || "Updated Assembly",
    description: data.description || "",
    scheduledDate: data.scheduledDate || "",
    location: data.location || "",
    status: data.status || AssemblyStatus.SCHEDULED,
    realtimeChannel: `assembly-${assemblyId}`,
    createdBy: 1,
    createdAt: "2024-07-01T09:00:00Z",
    updatedAt: new Date().toISOString(),
  };
};

export const getAssemblyQuorumStatus = async (
  assemblyId: number,
  tenantId: string,
): Promise<QuorumStatus> => {
  const prisma = getPrisma(tenantId);
  console.log("Getting assembly quorum status:", assemblyId);
  // Simulated data for demonstration
  return {
    currentAttendance: 60,
    quorumMet: true,
    totalUnits: 100,
    presentUnits: 60,
    totalCoefficients: 100,
    presentCoefficients: 55,
    quorumPercentage: 55,
    requiredQuorum: 51,
    timestamp: new Date().toISOString(),
  };
};

export const registerAttendance = async (
  assemblyId: number,
  userId: number,
  present: boolean,
  tenantId: string,
): Promise<any> => {
  const prisma = getPrisma(tenantId);
  console.log(
    "Registering attendance for assembly:",
    assemblyId,
    userId,
    present,
  );
  // Simulated data for demonstration
  return { message: "Attendance registered successfully" };
};

export const createVote = async (
  assemblyId: number,
  data: CreateVoteDto,
  tenantId: string,
): Promise<AssemblyVoteDto> => {
  const prisma = getPrisma(tenantId);
  console.log("Creating vote for assembly:", assemblyId, data);
  // Simulated data for demonstration
  return {
    id: Math.floor(Math.random() * 1000),
    assemblyId: assemblyId,
    title: data.question,
    description: "",
    options: data.options.map((opt) => ({ id: opt, text: opt, value: opt })),
    type: VoteType.SIMPLE_MAJORITY, // Default for mock
    status: VoteStatus.PENDING, // Default for mock
    weightedVoting: data.isWeighted,
    startTime: new Date().toISOString(),
  };
};

export const submitVote = async (
  voteId: number,
  userId: number,
  option: string,
  unitId: number,
  weight: number,
  tenantId: string,
): Promise<any> => {
  const prisma = getPrisma(tenantId);
  console.log("Submitting vote:", voteId, userId, option, unitId, weight);
  // Simulated data for demonstration
  return { message: "Vote submitted successfully" };
};

export const generateMeetingMinutes = async (
  assemblyId: number,
  tenantId: string,
): Promise<Blob> => {
  const prisma = getPrisma(tenantId);
  console.log("Generating meeting minutes for assembly:", assemblyId);
  // Simulated data for demonstration
  const mockPdfContent = "Simulated PDF content for meeting minutes.";
  const blob = new Blob([mockPdfContent], { type: "application/pdf" });
  return blob;
};

export const getVotingResults = async (
  assemblyId: number,
  tenantId: string,
): Promise<VoteResult> => {
  const prisma = getPrisma(tenantId);
  console.log("Getting voting results for assembly:", assemblyId);
  // Simulated data for demonstration
  return {
    totalVotes: 50,
    totalWeight: 50,
    results: [
      { value: "Option A", count: 30, totalWeight: 30 },
      { value: "Option B", count: 20, totalWeight: 20 },
    ],
  };
};

export const createAssembly = async (
  data: CreateAssemblyDto,
  tenantId: string,
): Promise<Assembly> => {
  const prisma = getPrisma(tenantId);
  console.log("Creating assembly:", data);
  // Simulated data for demonstration
  return {
    id: Math.floor(Math.random() * 1000),
    title: data.title,
    description: data.description,
    scheduledDate: data.scheduledDate,
    location: data.location,
    status: data.status,
    realtimeChannel: `assembly-${Math.floor(Math.random() * 1000)}`,
    createdBy: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
};

export const getAssemblies = async (tenantId: string): Promise<Assembly[]> => {
  const prisma = getPrisma(tenantId);
  console.log("Getting assemblies for tenant:", tenantId);
  // Simulated data for demonstration
  return [
    {
      id: 1,
      title: "Asamblea de Prueba 1",
      description: "Descripción de la asamblea de prueba 1.",
      scheduledDate: "2024-08-01T10:00:00Z",
      location: "Salón Social",
      status: AssemblyStatus.SCHEDULED,
      realtimeChannel: "assembly-1",
      createdBy: 1,
      createdAt: "2024-07-01T09:00:00Z",
      updatedAt: "2024-07-01T09:00:00Z",
    },
    {
      id: 2,
      title: "Asamblea de Prueba 2",
      description: "Descripción de la asamblea de prueba 2.",
      scheduledDate: "2024-07-15T14:00:00Z",
      location: "Zoom",
      status: AssemblyStatus.COMPLETED,
      realtimeChannel: "assembly-2",
      createdBy: 1,
      createdAt: "2024-07-01T09:00:00Z",
      updatedAt: "2024-07-01T09:00:00Z",
    },
  ];
};

export const deleteAssembly = async (
  assemblyId: number,
  tenantId: string,
): Promise<any> => {
  const prisma = getPrisma(tenantId);
  console.log("Deleting assembly:", assemblyId);
  // Simulated data for demonstration
  return { message: "Assembly deleted successfully" };
};
