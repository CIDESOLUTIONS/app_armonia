import {
  IsString,
  IsOptional,
  IsNumber,
  IsDateString,
  IsArray,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum ProjectStatus {
  PLANNED = 'PLANNED',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export enum ProjectTaskStatus {
  PENDING = 'PENDING',
  IN_PROGRESS = 'IN_PROGRESS',
  COMPLETED = 'COMPLETED',
  BLOCKED = 'BLOCKED',
}

export class CreateProjectDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string; // Changed to string

  @IsDateString()
  endDate: string; // Changed to string

  @IsEnum(ProjectStatus)
  @IsOptional()
  status?: ProjectStatus;

  @IsNumber()
  budget: number;

  @IsString() // Changed to string
  residentialComplexId: string; // Renamed from complexId

  @IsString() // Changed to string
  createdById: string;
}

export class UpdateProjectDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string; // Changed to string

  @IsOptional()
  @IsDateString()
  endDate?: string; // Changed to string

  @IsOptional()
  @IsEnum(ProjectStatus)
  status?: ProjectStatus;

  @IsOptional()
  @IsNumber()
  budget?: number;
}

export class CreateProjectTaskDto {
  @IsString() // Changed to string
  projectId: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectTaskStatus)
  status?: ProjectTaskStatus;

  @IsOptional()
  @IsString() // Changed to string
  assignedToId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string; // Changed to string
}

export class UpdateProjectTaskDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(ProjectTaskStatus)
  status?: ProjectTaskStatus;

  @IsOptional()
  @IsString() // Changed to string
  assignedToId?: string;

  @IsOptional()
  @IsDateString()
  dueDate?: string; // Changed to string
}

export class CreateProjectUpdateDto {
  @IsString() // Changed to string
  projectId: string;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  progress: number;
}