import { PartialType } from '@nestjs/swagger';
import { CreateDocumentDto } from './create-document.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsNumber, IsString, IsEnum } from 'class-validator';
import { Transform } from 'class-transformer';

export enum ApprovalStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
}

export class UpdateDocumentDto extends PartialType(CreateDocumentDto) {
  @ApiProperty({
    description: 'Nueva versión del documento',
    example: 2,
    required: false,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => value ? parseInt(value) : undefined)
  version?: number;

  @ApiProperty({
    description: 'Estado de aprobación',
    enum: ApprovalStatus,
    required: false,
  })
  @IsOptional()
  @IsEnum(ApprovalStatus)
  approvalStatus?: ApprovalStatus;

  @ApiProperty({
    description: 'Notas sobre los cambios realizados',
    example: 'Actualización de políticas y corrección de errores',
    required: false,
  })
  @IsOptional()
  @IsString()
  changeNotes?: string;

  @ApiProperty({
    description: 'Si es la versión actual',
    example: true,
    required: false,
  })
  @IsOptional()
  isCurrentVersion?: boolean;
}