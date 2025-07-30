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

  constructor(
    title: string,
    description: string,
    scheduledDate: string,
    location: string,
    type: AssemblyType,
    agenda: string,
  ) {
    this.title = title;
    this.description = description;
    this.scheduledDate = scheduledDate;
    this.location = location;
    this.type = type;
    this.agenda = agenda;
  }
}

export class UpdateAssemblyDto extends CreateAssemblyDto {
  @IsOptional()
  @IsEnum(AssemblyStatus)
  status?: AssemblyStatus;
}

export class AssemblyDto {
  id?: number;
  title?: string;
  description?: string;
  scheduledDate?: Date;
  location?: string;
  type?: AssemblyType;
  status?: AssemblyStatus;
  agenda?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export class RegisterAttendanceDto {
  @IsNumber()
  assemblyId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  unitId: number;

  @IsOptional()
  @IsBoolean()
  present?: boolean;

  constructor(
    assemblyId: number,
    userId: number,
    unitId: number,
    present?: boolean,
  ) {
    this.assemblyId = assemblyId;
    this.userId = userId;
    this.unitId = unitId;
    this.present = present;
  }
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

  constructor(
    title: string,
    description: string,
    options: string[],
    weightedVoting?: boolean,
  ) {
    this.title = title;
    this.description = description;
    this.options = options;
    this.weightedVoting = weightedVoting;
  }
}

export class SubmitVoteDto {
  @IsNumber()
  voteId: number;

  @IsNumber()
  userId: number;

  @IsNumber()
  unitId: number;

  @IsString()
  option: string;

  constructor(voteId: number, userId: number, unitId: number, option: string) {
    this.voteId = voteId;
    this.userId = userId;
    this.unitId = unitId;
    this.option = option;
  }
}
