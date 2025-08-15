import {
  IsString,
  IsNumber,
  IsEnum,
  IsOptional,
  IsDateString,
} from 'class-validator';

export enum MicroCreditStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  PAID = 'PAID',
}

export class CreateMicroCreditApplicationDto {
  @IsNumber()
  amount: number;

  @IsString()
  userId: string; // Changed to string

  @IsString()
  @IsOptional()
  purpose?: string; // Made optional as per schema.prisma

  @IsDateString()
  @IsOptional()
  applicationDate?: Date; // Made optional as per schema.prisma

  @IsString()
  @IsOptional()
  complexId?: string; // Made optional as per schema.prisma
}

export class UpdateMicroCreditApplicationDto {
  @IsOptional()
  @IsEnum(MicroCreditStatus)
  status?: MicroCreditStatus;

  @IsOptional()
  @IsDateString()
  approvalDate?: Date; // Changed to Date
}

export class MicroCreditApplicationDto {
  id: string; // Changed to string
  amount: number;
  status: MicroCreditStatus;
  createdAt: Date;
  updatedAt: Date;
  userId: string; // Changed to string
  purpose?: string; // Made optional as per schema.prisma
  applicationDate?: Date; // Made optional as per schema.prisma
  complexId?: string; // Made optional as per schema.prisma
}
