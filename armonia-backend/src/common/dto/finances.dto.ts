import {
  IsString,
  IsNumber,
  IsOptional,
  IsEnum,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PaymentStatus {
  PENDING = 'PENDING',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  CANCELLED = 'CANCELLED',
  PARTIAL = 'PARTIAL',
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
  @IsNumber()
  id: number;

  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsEnum(FeeType)
  type: FeeType;

  @IsDateString()
  dueDate: string;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsNumber()
  propertyId: number;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsOptional()
  @IsDateString()
  paymentDate?: string;

  @IsOptional()
  @IsString()
  receiptNumber?: string;

  @IsOptional()
  @IsString()
  paymentMethod?: string;

  @IsOptional()
  @IsString()
  paymentReference?: string;
}

export class PaymentDto {
  @IsNumber()
  id: number;

  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  method: string;

  @IsString()
  reference: string;

  @IsString()
  receiptNumber: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  feeId: number;

  @IsNumber()
  propertyId: number;

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;

  @IsNumber()
  createdBy: number;
}

export class BudgetItemDto {
  @IsNumber()
  id: number;

  @IsNumber()
  budgetId: number;

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsString()
  category: string;

  @IsNumber()
  order: number;
}

export class BudgetDto {
  @IsNumber()
  id: number;

  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  totalAmount: number;

  @IsOptional()
  @IsDateString()
  approvedDate?: string;

  @IsEnum(BudgetStatus)
  status: BudgetStatus;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetItemDto)
  items: BudgetItemDto[];

  @IsString()
  createdAt: string;

  @IsString()
  updatedAt: string;
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

  @IsString()
  description: string;

  @IsNumber()
  amount: number;

  @IsEnum(FeeType)
  type: FeeType;

  @IsDateString()
  dueDate: string;

  @IsNumber()
  propertyId: number;
}

export class UpdateFeeDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsEnum(FeeType)
  type?: FeeType;

  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}

export class CreatePaymentDto {
  @IsNumber()
  amount: number;

  @IsDateString()
  date: string;

  @IsString()
  method: string;

  @IsString()
  reference: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  feeId: number;

  @IsNumber()
  propertyId: number;
}

export class UpdatePaymentDto {
  @IsOptional()
  @IsNumber()
  amount?: number;

  @IsOptional()
  @IsDateString()
  date?: string;

  @IsOptional()
  @IsString()
  method?: string;

  @IsOptional()
  @IsString()
  reference?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  feeId?: number;

  @IsOptional()
  @IsNumber()
  propertyId?: number;

  @IsOptional()
  @IsEnum(PaymentStatus)
  status?: PaymentStatus;
}

export class RegisterManualPaymentDto {
  @IsNumber()
  feeId: number;

  @IsNumber()
  userId: number;

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
  @IsNumber()
  year: number;

  @IsNumber()
  month: number;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  totalAmount: number;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => BudgetItemDto)
  items: Omit<BudgetItemDto, 'id' | 'budgetId'>[];
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
  items?: Omit<BudgetItemDto, 'id' | 'budgetId'>[];

  @IsOptional()
  @IsEnum(BudgetStatus)
  status?: BudgetStatus;
}

export class InitiatePaymentDto {
  @IsNumber()
  feeId: number;

  @IsString()
  paymentMethod: string;

  @IsString()
  returnUrl: string;
}

export class PaymentGatewayCallbackDto {
  @IsString()
  transactionId: string;

  @IsString()
  status: string;

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
  @IsNumber()
  propertyId?: number;

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

export class ExpenseFilterParamsDto extends FeeFilterParamsDto {
  @IsOptional()
  @IsString()
  categoryId?: string;
}
