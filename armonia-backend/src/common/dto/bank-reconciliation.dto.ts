import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsDecimal,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum BankTransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export enum ReconciliationStatus {
  MATCHED = 'MATCHED',
  UNMATCHED = 'UNMATCHED',
  PARTIALLY_MATCHED = 'PARTIALLY_MATCHED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
}

export class BankTransactionDto {
  @IsString()
  transactionId: string;

  @IsDateString()
  date: string;

  @IsString()
  description: string;

  @IsNumber({ maxDecimalPlaces: 2 })
  amount: number;

  @IsEnum(BankTransactionType)
  type: BankTransactionType;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  account?: string;
}

export class ReconcileTransactionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankTransactionDto)
  transactions: BankTransactionDto[];

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;

  @IsDateString()
  periodStart: string;

  @IsDateString()
  periodEnd: string;
}

export class BankStatementUploadDto {
  @IsString()
  fileName: string;

  @IsEnum(['CSV', 'XLSX', 'PDF'])
  fileType: string;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @IsString()
  accountNumber?: string;
}

export class ReconciliationResultDto {
  @IsString()
  id: string;

  bankTransaction: BankTransactionDto;

  @IsOptional()
  systemPayment?: any;

  @IsEnum(ReconciliationStatus)
  status: ReconciliationStatus;

  @IsOptional()
  @IsNumber()
  confidence?: number;

  @IsOptional()
  @IsString()
  reason?: string;

  @IsOptional()
  @IsArray()
  suggestions?: any[];

  @IsDateString()
  processedAt: string;
}

export class ReconciliationSummaryDto {
  @IsString()
  id: string;

  @IsNumber()
  totalTransactions: number;

  @IsNumber()
  matchedTransactions: number;

  @IsNumber()
  unmatchedTransactions: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  totalAmount: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  matchedAmount: number;

  @IsNumber({ maxDecimalPlaces: 2 })
  unmatchedAmount: number;

  @IsDateString()
  processedAt: string;

  @IsOptional()
  @IsString()
  processedBy?: string;
}

export class ManualReconciliationDto {
  @IsString()
  bankTransactionId: string;

  @IsString()
  paymentId: string;

  @IsOptional()
  @IsString()
  notes?: string;

  @IsBoolean()
  confirmed: boolean;
}

export class ReconciliationConfigDto {
  @IsNumber()
  @IsOptional()
  amountTolerance?: number;

  @IsNumber()
  @IsOptional()
  dateTolerance?: number; // days

  @IsBoolean()
  @IsOptional()
  autoMatch?: boolean;

  @IsArray()
  @IsOptional()
  matchingRules?: string[];
}

export class ReconciliationFilterDto {
  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(ReconciliationStatus)
  status?: ReconciliationStatus;

  @IsOptional()
  @IsString()
  bankName?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  page?: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  limit?: number = 10;
}