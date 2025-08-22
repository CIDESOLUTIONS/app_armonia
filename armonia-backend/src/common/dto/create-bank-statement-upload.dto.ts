import { IsString, IsNotEmpty, IsArray, ValidateNested, IsNumber, IsOptional, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';

export class BankTransactionDto {
  @IsString()
  @IsNotEmpty()
  transactionId: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  @IsOptional()
  reference?: string;

  @IsString()
  @IsOptional()
  type?: string; // CREDIT, DEBIT
}

export class CreateBankStatementUploadDto {
  @IsString()
  @IsNotEmpty()
  schemaName: string;

  @IsString()
  @IsNotEmpty()
  bankName: string;

  @IsString()
  @IsNotEmpty()
  accountNumber: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankTransactionDto)
  transactions: BankTransactionDto[];
}

export class ReconcileTransactionsDto {
  @IsString()
  @IsNotEmpty()
  schemaName: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BankTransactionDto)
  transactions: BankTransactionDto[];
}