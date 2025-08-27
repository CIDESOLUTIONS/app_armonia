import {
  IsString,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  ValidateNested,
  IsBoolean,
  IsDecimal,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { Prisma } from '@prisma/client';

export enum ReconciliationStatus {
  MATCHED = 'MATCHED',
  UNMATCHED = 'UNMATCHED',
  MANUAL_REVIEW = 'MANUAL_REVIEW',
  PARTIALLY_MATCHED = 'PARTIALLY_MATCHED',
}

export enum BankTransactionType {
  CREDIT = 'CREDIT',
  DEBIT = 'DEBIT',
}

export class BankTransactionDto {
  @IsString()
  transactionId: string;

  @IsDateString()
  date: string;

  @IsString()
  description: string;

  @IsDecimal()
  amount: Prisma.Decimal;

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
  @IsDecimal()
  confidence?: Prisma.Decimal;

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

  @IsDecimal()
  totalAmount: Prisma.Decimal;

  @IsDecimal()
  matchedAmount: Prisma.Decimal;

  @IsDecimal()
  unmatchedAmount: Prisma.Decimal;

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
  @IsDecimal()
  @IsOptional()
  amountTolerance?: Prisma.Decimal;

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
