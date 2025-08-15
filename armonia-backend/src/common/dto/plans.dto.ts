import {
  IsString,
  IsNumber,
  IsOptional,
  IsBoolean,
  IsArray,
  IsDateString,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PartialType } from '@nestjs/swagger';
import { PlanType } from '../enums/plan-type.enum';

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  price: number;

  @IsEnum(PlanType)
  type: PlanType;

  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @IsString({ each: true })
  features: string[];
}

export class UpdatePlanDto extends PartialType(CreatePlanDto) {}

export class CreateSubscriptionDto {
  @IsString() // Changed to string
  planId: string;

  @IsString() // Changed to string
  residentialComplexId: string;

  @IsDateString()
  startDate: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsBoolean()
  isActive: boolean;
}

export class UpdateSubscriptionDto extends PartialType(CreateSubscriptionDto) {}
