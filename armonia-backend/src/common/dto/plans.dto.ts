import { IsString, IsNumber, IsOptional, IsEnum, IsArray, IsDateString, IsBoolean } from 'class-validator';

export enum PlanType {
  BASIC = "BASIC",
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE",
}

export class PlanDto {
  @IsEnum(PlanType)
  code: PlanType;

  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsNumber()
  priceMonthly: number;

  @IsNumber()
  maxUnits: number;

  @IsArray()
  @IsString({ each: true })
  features: string[];
}

export class SubscriptionDto {
  @IsNumber()
  id: number;

  @IsNumber()
  complexId: number;

  @IsEnum(PlanType)
  planType: PlanType;

  @IsDateString()
  startDate: Date;

  @IsOptional()
  @IsDateString()
  endDate?: Date;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;
}

export class SubscribeToPlanDto {
  @IsEnum(PlanType)
  planType: PlanType;

  @IsNumber()
  amount: number;

  @IsString()
  currency: string;
}