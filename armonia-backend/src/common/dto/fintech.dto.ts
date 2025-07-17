import { IsString, IsNumber, IsEnum, IsOptional } from 'class-validator';

export enum MicroCreditStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  PAID = 'paid',
}

export class CreateMicroCreditApplicationDto {
  @IsNumber()
  amount: number;

  @IsString()
  purpose: string;
}

export class UpdateMicroCreditApplicationDto {
  @IsOptional()
  @IsEnum(MicroCreditStatus)
  status?: MicroCreditStatus;

  @IsOptional()
  @IsString()
  approvalDate?: string;
}

export class MicroCreditApplicationDto {
  id: number;
  amount: number;
  purpose: string;
  status: MicroCreditStatus;
  applicationDate: Date;
  approvalDate?: Date;
  userId: number;
  complexId: number;
}