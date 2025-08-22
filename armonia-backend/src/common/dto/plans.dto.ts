import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsEnum,
  IsArray,
  IsBoolean,
  IsObject,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum PlanType {
  BASIC = 'BASIC',
  STANDARD = 'STANDARD',
  PREMIUM = 'PREMIUM',
  ENTERPRISE = 'ENTERPRISE',
  CUSTOM = 'CUSTOM',
}

export enum BillingCycle {
  MONTHLY = 'MONTHLY',
  QUARTERLY = 'QUARTERLY',
  YEARLY = 'YEARLY',
}

export enum SubscriptionStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  SUSPENDED = 'SUSPENDED',
  CANCELED = 'CANCELED',
  EXPIRED = 'EXPIRED',
  TRIAL = 'TRIAL',
}

export enum LicenseStatus {
  ACTIVE = 'ACTIVE',
  INACTIVE = 'INACTIVE',
  EXPIRED = 'EXPIRED',
  SUSPENDED = 'SUSPENDED',
}

export enum UsageLimitType {
  USERS = 'USERS',
  PROPERTIES = 'PROPERTIES',
  DOCUMENTS = 'DOCUMENTS',
  STORAGE = 'STORAGE',
  API_CALLS = 'API_CALLS',
  PAYMENTS = 'PAYMENTS',
  REPORTS = 'REPORTS',
  OTHER = 'OTHER',
}

export class FeatureConfigDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  displayName?: string;

  @IsBoolean()
  enabled: boolean;

  @IsObject()
  @IsOptional()
  configuration?: any;

  @IsArray()
  @IsOptional()
  dependencies?: string[]; // Features that must be enabled for this to work

  @IsNumber()
  @IsOptional()
  limit?: number; // Usage limit for this feature

  @IsString()
  @IsOptional()
  limitType?: UsageLimitType;
}

export class UsageLimitDto {
  @IsEnum(UsageLimitType)
  type: UsageLimitType;

  @IsNumber()
  limit: number;

  @IsNumber()
  @IsOptional()
  current?: number;

  @IsNumber()
  @IsOptional()
  remaining?: number;

  @IsBoolean()
  @IsOptional()
  isUnlimited?: boolean;

  @IsDateString()
  @IsOptional()
  resetDate?: string; // When the limit resets

  @IsString()
  @IsOptional()
  resetPeriod?: 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY';
}

export class CreatePlanDto {
  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PlanType)
  type: PlanType;

  @IsNumber()
  price: number;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureConfigDto)
  @IsOptional()
  featureConfiguration?: FeatureConfigDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UsageLimitDto)
  @IsOptional()
  usageLimits?: UsageLimitDto[];

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean = true;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean = true;

  @IsNumber()
  @IsOptional()
  trialDays?: number;

  @IsNumber()
  @IsOptional()
  setupFee?: number;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsArray()
  @IsOptional()
  allowedRoles?: string[];
}

export class UpdatePlanDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PlanType)
  @IsOptional()
  type?: PlanType;

  @IsNumber()
  @IsOptional()
  price?: number;

  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;

  @IsArray()
  @IsOptional()
  features?: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureConfigDto)
  @IsOptional()
  featureConfiguration?: FeatureConfigDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UsageLimitDto)
  @IsOptional()
  usageLimits?: UsageLimitDto[];

  @IsBoolean()
  @IsOptional()
  isPublic?: boolean;

  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @IsNumber()
  @IsOptional()
  trialDays?: number;

  @IsNumber()
  @IsOptional()
  setupFee?: number;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsArray()
  @IsOptional()
  allowedRoles?: string[];
}

export class PlanDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(PlanType)
  type: PlanType;

  @IsNumber()
  price: number;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @IsArray()
  features: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => FeatureConfigDto)
  featureConfiguration: FeatureConfigDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UsageLimitDto)
  usageLimits: UsageLimitDto[];

  @IsBoolean()
  isPublic: boolean;

  @IsBoolean()
  isActive: boolean;

  @IsNumber()
  @IsOptional()
  trialDays?: number;

  @IsNumber()
  @IsOptional()
  setupFee?: number;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsArray()
  allowedRoles: string[];

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;

  @IsNumber()
  @IsOptional()
  subscriberCount?: number;
}

export class LicenseDto {
  @IsString()
  id: string;

  @IsString()
  subscriptionId: string;

  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  userEmail?: string;

  @IsString()
  @IsOptional()
  userName?: string;

  @IsEnum(LicenseStatus)
  status: LicenseStatus;

  @IsArray()
  @IsOptional()
  assignedRoles?: string[];

  @IsArray()
  @IsOptional()
  permissions?: string[];

  @IsDateString()
  @IsOptional()
  activatedAt?: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsDateString()
  @IsOptional()
  lastUsedAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class CreateSubscriptionDto {
  @IsString()
  planId: string;

  @IsString()
  residentialComplexId: string;

  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;

  @IsNumber()
  @IsOptional()
  quantity?: number = 1;

  @IsDateString()
  @IsOptional()
  startDate?: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  autoRenew?: boolean = true;

  @IsString()
  @IsOptional()
  paymentMethodId?: string;

  @IsString()
  @IsOptional()
  couponCode?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class UpdateSubscriptionDto {
  @IsString()
  @IsOptional()
  planId?: string;

  @IsEnum(BillingCycle)
  @IsOptional()
  billingCycle?: BillingCycle;

  @IsNumber()
  @IsOptional()
  quantity?: number;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsBoolean()
  @IsOptional()
  autoRenew?: boolean;

  @IsString()
  @IsOptional()
  paymentMethodId?: string;

  @IsEnum(SubscriptionStatus)
  @IsOptional()
  status?: SubscriptionStatus;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  residentialComplexId: string; // Keep for backward compatibility
}

export class SubscriptionDto {
  @IsString()
  id: string;

  @IsString()
  planId: string;

  @IsObject()
  plan: PlanDto;

  @IsString()
  residentialComplexId: string;

  @IsEnum(SubscriptionStatus)
  status: SubscriptionStatus;

  @IsEnum(BillingCycle)
  billingCycle: BillingCycle;

  @IsNumber()
  quantity: number;

  @IsNumber()
  currentPrice: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  @IsOptional()
  endDate?: string;

  @IsDateString()
  @IsOptional()
  nextBillingDate?: string;

  @IsBoolean()
  autoRenew: boolean;

  @IsString()
  @IsOptional()
  paymentMethodId?: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => LicenseDto)
  licenses: LicenseDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => UsageLimitDto)
  currentUsage: UsageLimitDto[];

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class CreateLicenseDto {
  @IsString()
  subscriptionId: string;

  @IsString()
  userId: string;

  @IsArray()
  @IsOptional()
  assignedRoles?: string[];

  @IsArray()
  @IsOptional()
  permissions?: string[];

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class UpdateLicenseDto {
  @IsEnum(LicenseStatus)
  @IsOptional()
  status?: LicenseStatus;

  @IsArray()
  @IsOptional()
  assignedRoles?: string[];

  @IsArray()
  @IsOptional()
  permissions?: string[];

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class UsageTrackingDto {
  @IsString()
  subscriptionId: string;

  @IsEnum(UsageLimitType)
  limitType: UsageLimitType;

  @IsNumber()
  amount: number;

  @IsString()
  @IsOptional()
  description?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class FeatureAccessCheckDto {
  @IsString()
  subscriptionId: string;

  @IsString()
  feature: string;

  @IsString()
  @IsOptional()
  userId?: string;

  @IsObject()
  @IsOptional()
  context?: any;
}

export class PlanUpgradeDto {
  @IsString()
  subscriptionId: string;

  @IsString()
  newPlanId: string;

  @IsBoolean()
  @IsOptional()
  prorateCharges?: boolean = true;

  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class PlanDowngradeDto {
  @IsString()
  subscriptionId: string;

  @IsString()
  newPlanId: string;

  @IsBoolean()
  @IsOptional()
  immediateDowngrade?: boolean = false;

  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @IsString()
  @IsOptional()
  reason?: string;
}

export class BillingCycleChangeDto {
  @IsString()
  subscriptionId: string;

  @IsEnum(BillingCycle)
  newBillingCycle: BillingCycle;

  @IsBoolean()
  @IsOptional()
  prorateCharges?: boolean = true;

  @IsDateString()
  @IsOptional()
  effectiveDate?: string;
}

export class SubscriptionAnalyticsDto {
  @IsNumber()
  totalSubscriptions: number;

  @IsNumber()
  activeSubscriptions: number;

  @IsNumber()
  trialSubscriptions: number;

  @IsNumber()
  canceledSubscriptions: number;

  @IsNumber()
  monthlyRecurringRevenue: number;

  @IsNumber()
  annualRecurringRevenue: number;

  @IsNumber()
  averageRevenuePerUser: number;

  @IsObject()
  subscriptionsByPlan: { [planId: string]: number };

  @IsObject()
  revenueByPlan: { [planId: string]: number };

  @IsNumber()
  churnRate: number;

  @IsNumber()
  retentionRate: number;

  @IsArray()
  growthTrends: any[];
}