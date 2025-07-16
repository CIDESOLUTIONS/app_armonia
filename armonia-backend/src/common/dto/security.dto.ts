import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsDateString,
} from 'class-validator';

export class DigitalLogDto {
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsString()
  logDate: string;

  @IsNumber()
  createdBy: number;

  @IsString()
  createdByName: string;
}

export class CreateDigitalLogDto {
  @IsString()
  title: string;

  @IsString()
  content: string;

  @IsDateString()
  logDate: string;
}

export class UpdateDigitalLogDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  content?: string;

  @IsOptional()
  @IsDateString()
  logDate?: string;
}

export class CameraDto {
  @IsNumber()
  id: number;

  @IsString()
  name: string;

  @IsString()
  ipAddress: string;

  @IsNumber()
  port: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  location: string;

  @IsBoolean()
  isActive: boolean;
}

export class CreateCameraDto {
  @IsString()
  name: string;

  @IsString()
  ipAddress: string;

  @IsOptional()
  @IsNumber()
  port?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsString()
  location: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}

export class UpdateCameraDto {
  @IsNumber()
  id: number;

  @IsOptional()
  @IsString()
  name?: string;

  @IsOptional()
  @IsString()
  ipAddress?: string;

  @IsOptional()
  @IsNumber()
  port?: number;

  @IsOptional()
  @IsString()
  username?: string;

  @IsOptional()
  @IsString()
  password?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsBoolean()
  isActive?: boolean;
}
