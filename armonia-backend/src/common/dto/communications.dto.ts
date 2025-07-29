import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum NotificationType {
  EMAIL = 'EMAIL',
  SMS = 'SMS',
  PUSH = 'PUSH',
  APP = 'APP',
  WHATSAPP = 'WHATSAPP',
  INFO = 'info',
  WARNING = 'warning',
  ERROR = 'error',
}

export enum NotificationPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  URGENT = 'urgent',
}

export enum NotificationSourceType {
  SYSTEM = 'system',
  RESERVATION = 'reservation',
  ASSEMBLY = 'assembly',
  FINANCIAL = 'financial',
  SECURITY = 'security',
  MESSAGE = 'message',
  PACKAGE = 'package',
  PANIC = 'panic',
}

export class NotificationDataDto {
  @IsEnum(NotificationType)
  type: NotificationType;

  @IsString()
  title: string;

  @IsString()
  message: string;

  @IsOptional()
  @IsString()
  link?: string;

  @IsOptional()
  data?: Record<string, any>;

  @IsEnum(NotificationSourceType)
  sourceType: NotificationSourceType;

  @IsOptional()
  @IsString()
  sourceId?: string;

  @IsOptional()
  @IsEnum(NotificationPriority)
  priority?: NotificationPriority;

  @IsOptional()
  @IsBoolean()
  requireConfirmation?: boolean;

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @IsOptional()
  @IsString()
  recipientType?: 'ALL' | 'RESIDENT' | 'PROPERTY' | 'USER';

  @IsOptional()
  @IsString()
  recipientId?: string;

  constructor(type: NotificationType, title: string, message: string, sourceType: NotificationSourceType, partial?: Partial<NotificationDataDto>) {
    this.type = type;
    this.title = title;
    this.message = message;
    this.sourceType = sourceType;
    Object.assign(this, partial);
  }
}

export class AttachmentDto {
  @IsString()
  name: string;

  @IsString()
  url: string;

  @IsString()
  type: string;

  @IsOptional()
  @IsNumber()
  size?: number;

  constructor(name: string, url: string, type: string, size?: number) {
    this.name = name;
    this.url = url;
    this.type = type;
    this.size = size;
  }
}

export class AnnouncementDataDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsOptional()
  @IsString()
  type?: 'general' | 'important' | 'emergency';

  @IsOptional()
  @IsString()
  visibility?: 'public' | 'private' | 'role-based';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetRoles?: string[];

  @IsOptional()
  @IsBoolean()
  requireConfirmation?: boolean; // Corregido de requiresConfirmation

  @IsOptional()
  @IsDateString()
  expiresAt?: Date;

  @IsOptional()
  @IsArray()
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  constructor(title: string, content: string, partial?: Partial<AnnouncementDataDto>) {
    this.title = title;
    this.content = content;
    Object.assign(this, partial);
  }
}

export class MessageDataDto {
  @IsString()
  content: string;

  @IsOptional()
  @IsArray()
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  constructor(content: string, partial?: Partial<MessageDataDto>) {
    this.content = content;
    Object.assign(this, partial);
  }
}

export class EventDataDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsDateString()
  startDateTime: Date;

  @IsDateString()
  endDateTime: Date;

  @IsOptional()
  @IsString()
  type?: 'general' | 'meeting' | 'social' | 'maintenance';

  @IsOptional()
  @IsString()
  visibility?: 'public' | 'private' | 'role-based';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  targetRoles?: string[];

  @IsOptional()
  @IsNumber()
  maxAttendees?: number;

  @IsOptional()
  @IsArray()
  @Type(() => AttachmentDto)
  attachments?: AttachmentDto[];

  constructor(title: string, description: string, location: string, startDateTime: Date, endDateTime: Date, partial?: Partial<EventDataDto>) {
    this.title = title;
    this.description = description;
    this.location = location;
    this.startDateTime = startDateTime;
    this.endDateTime = endDateTime;
    Object.assign(this, partial);
  }
}
