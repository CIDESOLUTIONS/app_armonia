import { IsString, IsNotEmpty, IsNumber, IsBoolean, IsOptional, IsArray } from 'class-validator';

export class ReconciliationMatchDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsOptional()
  paymentId?: string;

  @IsString()
  @IsOptional()
  feeId?: string;

  @IsNumber()
  confidence: number; // 0-100 confidence score

  @IsBoolean()
  isAutoMatch: boolean;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class ReconciliationResultDto {
  @IsArray()
  matches: ReconciliationMatchDto[];

  @IsArray()
  unmatchedTransactions: string[];

  @IsArray()
  unmatchedPayments: string[];

  @IsNumber()
  totalMatches: number;

  @IsNumber()
  totalAmount: number;
}