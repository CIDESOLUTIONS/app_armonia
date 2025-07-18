import {
  IsString,
  IsNumber,
  IsDateString,
  IsArray,
  IsOptional,
  IsBoolean,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

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
  scheduledDate: string;

  @IsString()
  location: string;

  @IsEnum(AssemblyType)
  type: AssemblyType;

  @IsString()
  agenda: string;
}

export class UpdateAssemblyDto extends CreateAssemblyDto {
  @IsOptional()
  @IsEnum(AssemblyStatus)
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
  @IsNumber()
  assemblyId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsBoolean()
  present?: boolean;
}

export class CreateVoteDto {
  @IsNumber()
  assemblyId: number;

  @IsString()
  question: string;

  @IsArray()
  @IsString({ each: true })
  options: string[]; // Array of option texts

  @IsBoolean()
  isWeighted: boolean;
}

export class SubmitVoteDto {
  @IsNumber()
  voteId: number;

  @IsNumber()
  optionId: number; // Use option ID instead of index

  @IsNumber()
  userId: number;

  @IsNumber()
  weight: number;
}
