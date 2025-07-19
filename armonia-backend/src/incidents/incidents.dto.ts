import { IsString, IsEnum, IsOptional, IsArray, IsNumber } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum IncidentCategory {
  SECURITY = 'security',
  MAINTENANCE = 'maintenance',
  EMERGENCY = 'emergency',
  OTHER = 'other',
}

export enum IncidentPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export enum IncidentStatus {
  REPORTED = 'reported',
  IN_PROGRESS = 'in_progress',
  RESOLVED = 'resolved',
  CLOSED = 'closed',
}

export class CreateIncidentDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty({ enum: IncidentCategory })
  @IsEnum(IncidentCategory)
  category: IncidentCategory;

  @ApiProperty({ enum: IncidentPriority })
  @IsEnum(IncidentPriority)
  priority: IncidentPriority;

  @ApiProperty()
  @IsString()
  location: string;

  @ApiProperty()
  @IsString()
  reportedBy: string;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[]; // URLs de los adjuntos
}

export class UpdateIncidentDto {
  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiProperty({ enum: IncidentCategory, required: false })
  @IsOptional()
  @IsEnum(IncidentCategory)
  category?: IncidentCategory;

  @ApiProperty({ enum: IncidentPriority, required: false })
  @IsOptional()
  @IsEnum(IncidentPriority)
  priority?: IncidentPriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  location?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  reportedBy?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  assignedTo?: string;

  @ApiProperty({ enum: IncidentStatus, required: false })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiProperty({ type: [String], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  attachments?: string[];
}

export class IncidentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: IncidentCategory })
  category: IncidentCategory;

  @ApiProperty({ enum: IncidentPriority })
  priority: IncidentPriority;

  @ApiProperty()
  location: string;

  @ApiProperty()
  reportedAt: Date;

  @ApiProperty()
  reportedBy: string;

  @ApiProperty({ required: false })
  assignedTo?: string;

  @ApiProperty({ required: false })
  resolvedAt?: Date;

  @ApiProperty({ enum: IncidentStatus })
  status: IncidentStatus;

  @ApiProperty({ type: [IncidentUpdateDto] })
  updates: IncidentUpdateDto[];

  @ApiProperty({ type: [IncidentAttachmentDto] })
  attachments: IncidentAttachmentDto[];
}

export class IncidentUpdateDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  content: string;

  @ApiProperty()
  timestamp: Date;

  @ApiProperty()
  author: string;

  @ApiProperty({ type: [IncidentAttachmentDto] })
  attachments: IncidentAttachmentDto[];
}

export class IncidentAttachmentDto {
  @ApiProperty()
  id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  url: string;

  @ApiProperty()
  type: string;

  @ApiProperty()
  size: number;
}

export class IncidentFilterParamsDto {
  @ApiProperty({ enum: IncidentStatus, required: false })
  @IsOptional()
  @IsEnum(IncidentStatus)
  status?: IncidentStatus;

  @ApiProperty({ enum: IncidentPriority, required: false })
  @IsOptional()
  @IsEnum(IncidentPriority)
  priority?: IncidentPriority;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  page?: number;

  @ApiProperty({ required: false })
  @IsOptional()
  @IsNumber()
  limit?: number;
}
