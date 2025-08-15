import {
  IsString,
  IsDateString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEnum,
  IsNumber,
} from 'class-validator';

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
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsDateString()
  date: string;

  @IsEnum(AssemblyType)
  type: AssemblyType;

  @IsNumber()
  quorum: number;
}

export class UpdateAssemblyDto extends CreateAssemblyDto {
  @IsOptional()
  @IsEnum(AssemblyStatus)
  status?: AssemblyStatus;
}

export class AssemblyDto {
  id?: string;
  title?: string;
  description?: string;
  date?: Date;
  type?: AssemblyType;
  status?: AssemblyStatus;
  createdAt?: Date;
  updatedAt?: Date;
  quorum?: number;
}

export class RegisterAttendanceDto {
  @IsString()
  assemblyId: string;

  @IsString()
  userId: string;

  @IsString()
  unitId: string;

  @IsOptional()
  @IsBoolean()
  present?: boolean;
}

export class CreateVoteDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsArray()
  @IsString({ each: true })
  options: string[]; // Array of option texts

  @IsOptional()
  @IsBoolean()
  weightedVoting?: boolean;
}

export class SubmitVoteDto {
  @IsString()
  voteId: string;

  @IsString()
  userId: string;

  @IsString()
  unitId: string;

  @IsString()
  option: string;
}

export interface AssemblyAttendanceDto {
  id: string;
  assemblyId: string;
  userId: string;
  attended: boolean;
  attendedAt?: Date;
  unitId: string;
  checkInTime: Date;
  notes: string | null;
  proxyName: string | null;
  proxyDocument: string | null;
  isDelegate: boolean;
  isOwner: boolean;
  updatedAt?: Date;
}

export interface AssemblyVoteDto {
  id: string;
  question: string;
  options: string[];
  // Properties from schema but not in DTO
  // title: string;
  // description: string;
  // weightedVoting: boolean;
  // startTime: Date;
  // endTime?: Date;
  // status: string;
  // voteRecords: AssemblyVoteRecordDto[];
}

export interface AssemblyVoteRecordDto {
  id: string;
  assemblyVoteId: string;
  userId: string;
  option: string;
  coefficient?: number;
  createdAt: Date;
}

export interface CalculateQuorumResultDto {
  assemblyId: string;
  totalUnits: number;
  presentUnits: number;
  totalCoefficients: number;
  presentCoefficients: number;
  quorumPercentage: number;
  requiredQuorum: number;
  quorumReached: boolean;
  timestamp: string;
  currentAttendance: number;
  quorumMet: boolean;
}

export interface CalculateVoteResultsResultDto {
  voteId: string;
  title: string;
  totalVotes: number;
  totalWeight: number;
  options: {
    [key: string]: {
      count: number;
      weight: number;
      percentage: number;
    };
  };
  timestamp: string;
}
