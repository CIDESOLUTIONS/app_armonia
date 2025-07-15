import { IsString, IsNumber, IsOptional, IsEnum, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

export enum PQRStatus {
  OPEN = "OPEN",
  IN_PROGRESS = "IN_PROGRESS",
  CLOSED = "CLOSED",
  REJECTED = "REJECTED",
}

export enum PQRPriority {
  LOW = "LOW",
  MEDIUM = "MEDIUM",
  HIGH = "HIGH",
}

export class PQRCommentDto {
  @IsNumber()
  id: number;

  @IsNumber()
  pqrId: number;

  @IsNumber()
  authorId: number;

  @IsString()
  authorName: string;

  @IsString()
  comment: string;

  @IsString()
  createdAt: string;
}

export class PQRDto {
  @IsNumber()
  id: number;

  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsEnum(PQRStatus)
  status: PQRStatus;

  @IsEnum(PQRPriority)
  priority: PQRPriority;

  @IsString()
  category: string;

  @IsNumber()
  reportedById: number;

  @IsString()
  reportedByName: string;

  @IsOptional()
  @IsNumber()
  assignedToId?: number;

  @IsOptional()
  @IsString()
  assignedToName?: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PQRCommentDto)
  comments: PQRCommentDto[];
}

export class GetPQRParamsDto {
  @IsOptional()
  @IsEnum(PQRStatus)
  status?: PQRStatus;

  @IsOptional()
  @IsEnum(PQRPriority)
  priority?: PQRPriority;

  @IsOptional()
  @IsString()
  search?: string;
}

export class CreatePQRDto {
  @IsString()
  subject: string;

  @IsString()
  description: string;

  @IsString()
  category: string;

  @IsOptional()
  @IsEnum(PQRPriority)
  priority?: PQRPriority;

  @IsNumber()
  reportedById: number;
}

export class UpdatePQRDto {
  @IsOptional()
  @IsString()
  subject?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(PQRStatus)
  status?: PQRStatus;

  @IsOptional()
  @IsEnum(PQRPriority)
  priority?: PQRPriority;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  assignedToId?: number;
}
