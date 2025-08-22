import { IsString, IsOptional, IsArray, ValidateNested, IsNumber, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { BankTransactionDto, ReconciliationConfigDto } from '../../../common/dto/bank-reconciliation.dto';

export class ProcessReconciliationDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankTransactionDto)
  transactions: BankTransactionDto[];

  @IsString()
  residentialComplexId: string;

  @IsOptional()
  @IsString()
  periodStart?: string;

  @IsOptional()
  @IsString()
  periodEnd?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => ReconciliationConfigDto)
  config?: ReconciliationConfigDto;
}

export class ReconciliationStatsDto {
  @IsNumber()
  totalTransactions: number;

  @IsNumber()
  processedTransactions: number;

  @IsNumber()
  matchedTransactions: number;

  @IsNumber()
  unmatchedTransactions: number;

  @IsNumber()
  partiallyMatchedTransactions: number;

  @IsNumber()
  manualReviewTransactions: number;

  @IsNumber()
  totalAmount: number;

  @IsNumber()
  matchedAmount: number;

  @IsNumber()
  unmatchedAmount: number;

  @IsNumber()
  matchingAccuracy: number;
}

export class BulkReconciliationDto {
  @IsArray()
  @IsString({ each: true })
  reconciliationIds: string[];

  @IsString()
  action: 'approve' | 'reject' | 'review';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsBoolean()
  @IsOptional()
  autoApply?: boolean;
}