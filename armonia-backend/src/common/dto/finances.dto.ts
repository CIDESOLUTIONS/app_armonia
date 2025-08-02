import {
  IsString,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsArray,
  IsDateString,
  IsEnum,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  PARTIAL = 'PARTIAL',
  COMPLETED = 'COMPLETED',
}

export enum FeeType {
  ORDINARY = 'ORDINARY',
  EXTRAORDINARY = 'EXTRAORDINARY',
  PENALTY = 'PENALTY',
  UTILITY = 'UTILITY',
  OTHER = 'OTHER',
}

export enum BudgetStatus {
  DRAFT = 'DRAFT',
  APPROVED = 'APPROVED',
  EXECUTED = 'EXECUTED',
}

export class FeeDto {
  id: string;
  title: string;
  description?: string;
  type: string;
  propertyId: string;
  amount: number;
  dueDate: Date;
  paid: boolean;
  paidAt?: Date;
  paymentId?: string;
  createdAt: Date;
  isRecurring: boolean;
  frequency?: string;
  status: PaymentStatus; // Added status to FeeDto
}

export class PaymentDto {
  id: string;
  userId: string;
  status: PaymentStatus;
  amount: number;
  date: Date;
  method: string;
  feeId?: string;
  transactionId?: string;
  paymentMethod?: string;
}

export class BudgetItemDto {
  @IsString()
  id: string;

  @IsString()
  budgetId: string;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;
}

export class BudgetDto {
  id: string;
  title: string;
  month: number;
  status: BudgetStatus;
  year: number;
  totalAmount: number;
  items: BudgetItemDto[];
  residentialComplexId: string;
  approvedById?: string;
  approvedAt?: Date;
}

export class FeeListResponseDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeeDto)
  fees: FeeDto[];

  @IsNumber()
  total: number;

  @IsNumber()
  page: number;

  @IsNumber()
  limit: number;
}

export class CreateFeeDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsString()
  type: string;

  @IsString()
  propertyId: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  dueDate: Date;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  frequency?: string;
}

export class UpdateFeeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsString()
  type?: string;

  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  dueDate?: Date;

  @IsOptional()
  @IsBoolean()
  paid?: boolean;

  @IsOptional()
  @IsDateString()
  paidAt?: Date;

  @IsOptional()
  @IsString()
  paymentId?: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean;

  @IsOptional()
  @IsString()
  frequency?: string;
}

export class CreatePaymentDto {
  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: Date;

  @IsString()
  method: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsOptional()
  @IsString()
  feeId?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  date?: Date;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsString()
  feeId?: string;

  @IsOptional()
  @IsString()
  transactionId?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;
}

export class RegisterManualPaymentDto {
  @IsString()
  feeId: string;

  @IsString()
  userId: string;

  @IsNumber()
  amount: number;

  @IsDateString()
  paymentDate: string;

  @IsString()
  paymentMethod: string;

  @IsOptional()
  @IsString()
  transactionId?: string;
}

export class CreateBudgetDto {
  @IsString()
  title: string;

  @IsNumber()
  month: number;

  @IsNumber()
  year: number;

  @IsNumber()
  totalAmount: number;

  @IsString()
  residentialComplexId: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetItemDto)
  items: BudgetItemDto[];

  @IsEnum(BudgetStatus) // Added status to CreateBudgetDto
  status: BudgetStatus;
}

export class UpdateBudgetDto {
  @IsOptional()
  @IsNumber()
  year?: number;

  @IsOptional()
  @IsNumber()
  month?: number;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  totalAmount?: number;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetItemDto)
  items?: BudgetItemDto[];

  @IsOptional()
  @IsEnum(BudgetStatus)
  status?: BudgetStatus;

  @IsOptional()
  @IsString()
  approvedById?: string;

  @IsOptional()
  @IsDateString()
  approvedAt?: Date;
}

export class InitiatePaymentDto {
  @IsString()
  feeId: string;

  @IsString()
  paymentMethod: string;

  @IsString()
  returnUrl: string;
}

export class PaymentGatewayCallbackDto {
  @IsString()
  transactionId: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  schemaName: string;

  @IsOptional()
  @IsString()
  signature?: string;
}

export class FinancialReportResponseDto {
  @IsNumber()
  totalIncome: number;

  @IsNumber()
  totalExpenses: number;

  @IsNumber()
  netBalance: number;

  @IsArray()
  @IsOptional()
  transactions?: any[]; // Simplified for now, could be more specific DTOs

  @IsArray()
  @IsOptional()
  fees?: any[]; // Simplified for now

  @IsArray()
  @IsOptional()
  payments?: any[]; // Simplified for now
}

export class FeeFilterParamsDto {
  @IsOptional()
  @IsNumber()
  page?: number;

  @IsOptional()
  @IsNumber()
  limit?: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;

  @IsOptional()
  @IsEnum(FeeType)
  type?: FeeType;

  @IsOptional()
  @IsString()
  propertyId?: string;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsString()
  search?: string;
}

export class BudgetFilterParamsDto extends FeeFilterParamsDto {
  @IsOptional()
  @IsNumber()
  year?: number;
}

export class ExpenseDto {
  id: string;
  description: string;
  amount: number;
  category: string;
  expenseDate: Date;
  vendor?: string;
  invoiceNumber?: string;
  notes?: string;
  residentialComplexId: string; // Changed from complexId
  budgetId?: string;
  approvedById?: string;
}

export class CreateExpenseDto {
  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsDateString()
  expenseDate: string;

  @IsString()
  @IsOptional()
  vendor?: string;

  @IsString()
  @IsOptional()
  invoiceNumber?: string;

  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  residentialComplexId: string; // Changed from complexId

  @IsOptional()
  @IsString()
  budgetId?: string;

  @IsOptional()
  @IsString()
  approvedById?: string;
}

export class UpdateExpenseDto extends PartialType(CreateExpenseDto) {}

export class ExpenseFilterParamsDto extends FeeFilterParamsDto {
  @IsOptional()
  @IsString()
  categoryId?: string;
}