import {
  IsString,
  IsNumber,
  IsDateString,
  IsOptional,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PersonalTransactionType {
  INCOME = 'income',
  EXPENSE = 'expense',
}

export class CreatePersonalTransactionDto {
  @IsEnum(PersonalTransactionType)
  type: PersonalTransactionType;

  @IsString()
  description: string;

  @IsNumber()
  @Type(() => Number)
  amount: number;

  @IsDateString()
  date: string;
}

export class UpdatePersonalTransactionDto {
  @IsOptional()
  @IsEnum(PersonalTransactionType)
  type?: PersonalTransactionType;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;

  @IsOptional()
  @IsDateString()
  date?: string;
}

export class PersonalTransactionDto {
  id: string; // Changed to string
  userId: string; // Changed to string
  type: PersonalTransactionType;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export class PersonalTransactionFilterParamsDto {
  @IsOptional()
  @IsEnum(PersonalTransactionType)
  type?: PersonalTransactionType;

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