import { IsString, IsNotEmpty, IsOptional } from 'class-validator';

export class CreateDocumentVersionDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @IsString()
  @IsOptional()
  versionNotes?: string;

  @IsString()
  @IsOptional()
  changeDescription?: string;
}

export class ApproveDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @IsString()
  @IsOptional()
  approvalNotes?: string;
}

export class ShareDocumentDto {
  @IsString()
  @IsNotEmpty()
  documentId: string;

  @IsString()
  @IsNotEmpty()
  recipientEmail: string;

  @IsString()
  @IsOptional()
  message?: string;

  @IsString()
  @IsOptional()
  expiresAt?: string;
}