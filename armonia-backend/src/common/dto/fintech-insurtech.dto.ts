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
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';

// ========== FINTECH DTOs ==========

export enum CreditApplicationStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
}

export enum CreditType {
  MICRO_CREDIT = 'MICRO_CREDIT',
  PERSONAL_LOAN = 'PERSONAL_LOAN',
  BUSINESS_LOAN = 'BUSINESS_LOAN',
  EMERGENCY_LOAN = 'EMERGENCY_LOAN',
}

export enum CreditScoreProvider {
  EXPERIAN = 'EXPERIAN',
  TRANSUNION = 'TRANSUNION',
  EQUIFAX = 'EQUIFAX',
  LOCAL_BUREAU = 'LOCAL_BUREAU',
  INTERNAL = 'INTERNAL',
}

export enum PaymentStatus {
  SCHEDULED = 'SCHEDULED',
  PAID = 'PAID',
  OVERDUE = 'OVERDUE',
  FAILED = 'FAILED',
}

export class MicroCreditRequestDto {
  @IsString()
  userId: string;

  @IsNumber()
  @Min(100)
  @Max(50000)
  amount: number;

  @IsString()
  purpose: string;

  @IsNumber()
  @Min(1)
  @Max(60)
  termMonths: number;

  @IsString()
  @IsOptional()
  employmentStatus?: string;

  @IsNumber()
  @IsOptional()
  monthlyIncome?: number;

  @IsArray()
  @IsOptional()
  attachments?: string[]; // Document URLs

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class CreditApplicationDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  applicantName?: string;

  @IsEnum(CreditType)
  type: CreditType;

  @IsNumber()
  requestedAmount: number;

  @IsNumber()
  @IsOptional()
  approvedAmount?: number;

  @IsNumber()
  termMonths: number;

  @IsNumber()
  @IsOptional()
  interestRate?: number;

  @IsString()
  purpose: string;

  @IsEnum(CreditApplicationStatus)
  status: CreditApplicationStatus;

  @IsString()
  @IsOptional()
  provider?: string;

  @IsString()
  @IsOptional()
  externalApplicationId?: string;

  @IsArray()
  @IsOptional()
  attachments?: string[];

  @IsObject()
  @IsOptional()
  riskAssessment?: {
    score: number;
    factors: string[];
    recommendation: string;
  };

  @IsObject()
  @IsOptional()
  terms?: {
    monthlyPayment: number;
    totalInterest: number;
    totalRepayment: number;
    firstPaymentDate: string;
  };

  @IsDateString()
  @IsOptional()
  applicationDate?: string;

  @IsDateString()
  @IsOptional()
  approvalDate?: string;

  @IsDateString()
  @IsOptional()
  disbursementDate?: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  residentialComplexId: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class CreditScoreDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsNumber()
  @Min(300)
  @Max(850)
  score: number;

  @IsString()
  @IsOptional()
  scoreRange?: string; // e.g., "Good", "Fair", "Excellent"

  @IsEnum(CreditScoreProvider)
  provider: CreditScoreProvider;

  @IsArray()
  @IsOptional()
  factors?: {
    factor: string;
    impact: 'positive' | 'negative' | 'neutral';
    description: string;
  }[];

  @IsObject()
  @IsOptional()
  history?: {
    previousScore?: number;
    changeFromPrevious?: number;
    trend: 'improving' | 'declining' | 'stable';
  };

  @IsDateString()
  lastUpdated: string;

  @IsDateString()
  @IsOptional()
  expiresAt?: string;

  @IsString()
  residentialComplexId: string;
}

export class LoanPaymentDto {
  @IsString()
  id: string;

  @IsString()
  loanId: string;

  @IsNumber()
  paymentNumber: number;

  @IsNumber()
  amount: number;

  @IsNumber()
  principalAmount: number;

  @IsNumber()
  interestAmount: number;

  @IsDateString()
  dueDate: string;

  @IsDateString()
  @IsOptional()
  paidDate?: string;

  @IsEnum(PaymentStatus)
  status: PaymentStatus;

  @IsString()
  @IsOptional()
  paymentMethod?: string;

  @IsString()
  @IsOptional()
  transactionId?: string;

  @IsNumber()
  @IsOptional()
  lateFee?: number;

  @IsNumber()
  @IsOptional()
  remainingBalance?: number;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class FinancialProductDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(CreditType)
  type: CreditType;

  @IsString()
  provider: string;

  @IsNumber()
  minAmount: number;

  @IsNumber()
  maxAmount: number;

  @IsNumber()
  minTermMonths: number;

  @IsNumber()
  maxTermMonths: number;

  @IsNumber()
  interestRateMin: number;

  @IsNumber()
  interestRateMax: number;

  @IsArray()
  @IsOptional()
  eligibilityCriteria?: string[];

  @IsArray()
  @IsOptional()
  requiredDocuments?: string[];

  @IsBoolean()
  isActive: boolean;

  @IsBoolean()
  @IsOptional()
  quickApproval?: boolean;

  @IsNumber()
  @IsOptional()
  processingFee?: number;

  @IsObject()
  @IsOptional()
  metadata?: any;
}

// ========== INSURTECH DTOs ==========

export enum InsuranceType {
  HOME = 'HOME',
  AUTO = 'AUTO',
  LIFE = 'LIFE',
  HEALTH = 'HEALTH',
  TRAVEL = 'TRAVEL',
  PROPERTY = 'PROPERTY',
  LIABILITY = 'LIABILITY',
}

export enum PolicyStatus {
  ACTIVE = 'ACTIVE',
  PENDING = 'PENDING',
  EXPIRED = 'EXPIRED',
  CANCELED = 'CANCELED',
  SUSPENDED = 'SUSPENDED',
  LAPSED = 'LAPSED',
}

export enum ClaimStatus {
  SUBMITTED = 'SUBMITTED',
  UNDER_REVIEW = 'UNDER_REVIEW',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  SETTLED = 'SETTLED',
  CLOSED = 'CLOSED',
}

export class InsuranceQuoteRequestDto {
  @IsString()
  userId: string;

  @IsEnum(InsuranceType)
  insuranceType: InsuranceType;

  @IsObject()
  coverageDetails: {
    coverageAmount?: number;
    deductible?: number;
    coverageType?: string;
    additionalCoverage?: string[];
  };

  @IsObject()
  @IsOptional()
  subjectDetails?: any; // Property details, vehicle details, etc.

  @IsObject()
  @IsOptional()
  personalDetails?: {
    age?: number;
    occupation?: string;
    healthStatus?: string;
    drivingRecord?: any;
  };

  @IsDateString()
  @IsOptional()
  preferredStartDate?: string;

  @IsNumber()
  @IsOptional()
  termYears?: number;

  @IsArray()
  @IsOptional()
  preferredProviders?: string[];

  @IsObject()
  @IsOptional()
  metadata?: any;
}

export class InsuranceQuoteDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsEnum(InsuranceType)
  insuranceType: InsuranceType;

  @IsString()
  provider: string;

  @IsString()
  @IsOptional()
  providerQuoteId?: string;

  @IsNumber()
  premium: number;

  @IsString()
  @IsOptional()
  billingFrequency?: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';

  @IsNumber()
  coverageAmount: number;

  @IsNumber()
  deductible: number;

  @IsArray()
  @IsOptional()
  coverageDetails?: {
    type: string;
    amount: number;
    description: string;
  }[];

  @IsArray()
  @IsOptional()
  exclusions?: string[];

  @IsDateString()
  validUntil: string;

  @IsObject()
  @IsOptional()
  terms?: any;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  residentialComplexId: string;

  @IsDateString()
  createdAt: string;
}

export class InsurancePolicyDto {
  @IsString()
  id: string;

  @IsString()
  userId: string;

  @IsString()
  @IsOptional()
  holderName?: string;

  @IsString()
  quoteId: string;

  @IsString()
  policyNumber: string;

  @IsEnum(InsuranceType)
  insuranceType: InsuranceType;

  @IsString()
  provider: string;

  @IsEnum(PolicyStatus)
  status: PolicyStatus;

  @IsNumber()
  premium: number;

  @IsString()
  billingFrequency: 'MONTHLY' | 'QUARTERLY' | 'ANNUALLY';

  @IsNumber()
  coverageAmount: number;

  @IsNumber()
  deductible: number;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsDateString()
  @IsOptional()
  renewalDate?: string;

  @IsArray()
  @IsOptional()
  coverageDetails?: {
    type: string;
    amount: number;
    description: string;
  }[];

  @IsArray()
  @IsOptional()
  beneficiaries?: {
    name: string;
    relationship: string;
    percentage: number;
  }[];

  @IsObject()
  @IsOptional()
  terms?: any;

  @IsArray()
  @IsOptional()
  claims?: string[]; // Claim IDs

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  residentialComplexId: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class InsuranceClaimDto {
  @IsString()
  id: string;

  @IsString()
  policyId: string;

  @IsString()
  claimNumber: string;

  @IsString()
  userId: string;

  @IsEnum(ClaimStatus)
  status: ClaimStatus;

  @IsString()
  incidentType: string;

  @IsString()
  description: string;

  @IsDateString()
  incidentDate: string;

  @IsDateString()
  reportedDate: string;

  @IsNumber()
  claimedAmount: number;

  @IsNumber()
  @IsOptional()
  approvedAmount?: number;

  @IsNumber()
  @IsOptional()
  settledAmount?: number;

  @IsString()
  @IsOptional()
  adjusterName?: string;

  @IsString()
  @IsOptional()
  adjusterId?: string;

  @IsArray()
  @IsOptional()
  attachments?: string[]; // Document URLs

  @IsArray()
  @IsOptional()
  notes?: {
    date: string;
    author: string;
    note: string;
  }[];

  @IsDateString()
  @IsOptional()
  approvalDate?: string;

  @IsDateString()
  @IsOptional()
  settlementDate?: string;

  @IsString()
  @IsOptional()
  rejectionReason?: string;

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsString()
  residentialComplexId: string;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class CreateInsuranceClaimDto {
  @IsString()
  policyId: string;

  @IsString()
  incidentType: string;

  @IsString()
  description: string;

  @IsDateString()
  incidentDate: string;

  @IsNumber()
  claimedAmount: number;

  @IsArray()
  @IsOptional()
  attachments?: string[];

  @IsObject()
  @IsOptional()
  metadata?: any;
}

// ========== SHARED DTOs ==========

export class FinancialServiceProviderDto {
  @IsString()
  id: string;

  @IsString()
  name: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsString()
  type: 'FINTECH' | 'INSURTECH' | 'BOTH';

  @IsString()
  @IsOptional()
  apiEndpoint?: string;

  @IsObject()
  @IsOptional()
  apiConfiguration?: any;

  @IsBoolean()
  isActive: boolean;

  @IsArray()
  @IsOptional()
  supportedProducts?: string[];

  @IsArray()
  @IsOptional()
  supportedRegions?: string[];

  @IsObject()
  @IsOptional()
  fees?: {
    processingFee?: number;
    serviceFee?: number;
    commissionRate?: number;
  };

  @IsObject()
  @IsOptional()
  metadata?: any;

  @IsDateString()
  createdAt: string;

  @IsDateString()
  updatedAt: string;
}

export class FinancialDashboardStatsDto {
  @IsObject()
  fintech: {
    totalApplications: number;
    approvedApplications: number;
    rejectedApplications: number;
    pendingApplications: number;
    totalAmountRequested: number;
    totalAmountApproved: number;
    averageLoanAmount: number;
    averageInterestRate: number;
  };

  @IsObject()
  insurtech: {
    totalQuotes: number;
    totalPolicies: number;
    activePolicies: number;
    totalClaims: number;
    approvedClaims: number;
    settledClaims: number;
    totalPremiums: number;
    totalClaimAmount: number;
  };

  @IsArray()
  recentActivities: any[];

  @IsArray()
  topProviders: any[];
}