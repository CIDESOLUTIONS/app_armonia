import { IsString, IsNumber, IsOptional, IsEnum } from 'class-validator';

export enum PanicStatus {
  ACTIVE = 'ACTIVE',
  RESOLVED = 'RESOLVED',
  DISMISSED = 'DISMISSED',
}

export class CreatePanicAlertDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  propertyId: number;

  @IsString()
  location: string;

  @IsOptional()
  @IsString()
  message?: string;
}

export class UpdatePanicAlertDto {
  @IsEnum(PanicStatus)
  status: PanicStatus;

  @IsOptional()
  @IsString()
  resolvedBy?: string;

  @IsOptional()
  @IsString()
  resolutionNotes?: string;
}

export class PanicAlertDto {
  id: number;
  userId: number;
  propertyId: number;
  location: string;
  message?: string;
  status: PanicStatus;
  createdAt: Date;
  updatedAt: Date;
}
