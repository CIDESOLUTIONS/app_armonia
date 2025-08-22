import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  InsuranceQuoteRequestDto,
  InsuranceQuoteDto,
  InsurancePolicyDto,
  InsuranceClaimDto,
  CreateInsuranceClaimDto,
  InsuranceType,
  PolicyStatus,
  ClaimStatus,
} from '../common/dto/fintech-insurtech.dto';
import * as crypto from 'crypto';

@Injectable()
export class InsurtechService {
  private readonly logger = new Logger(InsurtechService.name);

  constructor(private prisma: PrismaService) {}

  // ========== INSURANCE QUOTES ==========
  
  async getInsuranceQuote(
    schemaName: string,
    userId: string,
    quoteRequest: InsuranceQuoteRequestDto,
  ): Promise<InsuranceQuoteDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    // Get quotes from multiple providers
    const providers = await this.getAvailableProviders(
      quoteRequest.insuranceType,
      quoteRequest.preferredProviders,
    );
    
    const quotes: InsuranceQuoteDto[] = [];
    
    for (const provider of providers) {
      try {
        const quote = await this.requestQuoteFromProvider(
          provider,
          quoteRequest,
          user,
        );
        
        // Store quote in database
        const savedQuote = await prisma.insuranceQuote.create({
          data: {
            userId,
            insuranceType: quoteRequest.insuranceType,
            provider: provider.name,
            providerQuoteId: quote.externalQuoteId,
            premium: quote.premium,
            billingFrequency: quote.billingFrequency || 'MONTHLY',
            coverageAmount: quoteRequest.coverageDetails.coverageAmount || 0,
            deductible: quoteRequest.coverageDetails.deductible || 0,
            coverageDetails: quote.coverageDetails,
            exclusions: quote.exclusions,
            validUntil: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            terms: quote.terms,
            metadata: quote.metadata,
            residentialComplexId: user.residentialComplexId,
            createdAt: new Date(),
          },
        });
        
        quotes.push(this.mapInsuranceQuoteToDto(savedQuote));
      } catch (error) {
        this.logger.warn(
          `Error obteniendo cotización de ${provider.name}: ${error.message}`,
        );
      }
    }
    
    if (quotes.length === 0) {
      throw new BadRequestException(
        'No se pudieron obtener cotizaciones en este momento',
      );
    }
    
    this.logger.log(
      `${quotes.length} cotizaciones generadas para usuario ${userId}`,
    );
    
    return quotes;
  }

  async getInsuranceQuotes(
    schemaName: string,
    userId?: string,
    insuranceType?: InsuranceType,
    validOnly: boolean = true,
  ): Promise<InsuranceQuoteDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const where: any = {};
    if (userId) where.userId = userId;
    if (insuranceType) where.insuranceType = insuranceType;
    if (validOnly) where.validUntil = { gte: new Date() };
    
    const quotes = await prisma.insuranceQuote.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    return quotes.map(quote => this.mapInsuranceQuoteToDto(quote));
  }

  async getInsuranceQuoteById(
    schemaName: string,
    quoteId: string,
  ): Promise<InsuranceQuoteDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const quote = await prisma.insuranceQuote.findUnique({
      where: { id: quoteId },
    });
    
    if (!quote) {
      throw new NotFoundException('Cotización no encontrada');
    }
    
    return this.mapInsuranceQuoteToDto(quote);
  }

  // ========== INSURANCE POLICIES ==========
  
  async registerPolicy(
    schemaName: string,
    userId: string,
    quoteId: string,
    paymentMethodId?: string,
  ): Promise<InsurancePolicyDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    // Get quote
    const quote = await prisma.insuranceQuote.findUnique({
      where: { id: quoteId },
    });
    
    if (!quote) {
      throw new NotFoundException('Cotización no encontrada');
    }
    
    if (quote.validUntil < new Date()) {
      throw new BadRequestException('La cotización ha expirado');
    }
    
    if (quote.userId !== userId) {
      throw new BadRequestException(
        'No puede crear póliza con cotización de otro usuario',
      );
    }
    
    // Create policy with external provider
    const externalPolicy = await this.createPolicyWithProvider(
      quote.provider,
      quote.providerQuoteId!,
      paymentMethodId,
    );
    
    const startDate = new Date();
    const endDate = new Date(startDate);
    endDate.setFullYear(endDate.getFullYear() + 1); // 1 year policy
    
    const renewalDate = new Date(endDate);
    renewalDate.setMonth(renewalDate.getMonth() - 1); // Renewal reminder 1 month before
    
    // Create policy record
    const policy = await prisma.insurancePolicy.create({
      data: {
        userId,
        quoteId,
        policyNumber: externalPolicy.policyNumber,
        insuranceType: quote.insuranceType,
        provider: quote.provider,
        status: PolicyStatus.ACTIVE,
        premium: quote.premium,
        billingFrequency: quote.billingFrequency,
        coverageAmount: quote.coverageAmount,
        deductible: quote.deductible,
        startDate,
        endDate,
        renewalDate,
        coverageDetails: quote.coverageDetails,
        beneficiaries: externalPolicy.beneficiaries || [],
        terms: quote.terms,
        claims: [],
        metadata: {
          ...quote.metadata,
          externalPolicyId: externalPolicy.policyId,
          paymentMethodId,
        },
        residentialComplexId: quote.residentialComplexId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    this.logger.log(
      `Póliza de seguro creada: ${policy.policyNumber} para usuario ${userId}`,
    );
    
    return this.getInsurancePolicyById(schemaName, policy.id);
  }

  async getInsurancePolicies(
    schemaName: string,
    userId?: string,
    insuranceType?: InsuranceType,
    status?: PolicyStatus,
  ): Promise<InsurancePolicyDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const where: any = {};
    if (userId) where.userId = userId;
    if (insuranceType) where.insuranceType = insuranceType;
    if (status) where.status = status;
    
    const policies = await prisma.insurancePolicy.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        claims: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return policies.map(policy => this.mapInsurancePolicyToDto(policy, policy.user));
  }

  async getInsurancePolicyById(
    schemaName: string,
    policyId: string,
  ): Promise<InsurancePolicyDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const policy = await prisma.insurancePolicy.findUnique({
      where: { id: policyId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        claims: true,
      },
    });
    
    if (!policy) {
      throw new NotFoundException('Póliza no encontrada');
    }
    
    return this.mapInsurancePolicyToDto(policy, policy.user);
  }

  async updatePolicyStatus(
    schemaName: string,
    policyId: string,
    status: PolicyStatus,
    reason?: string,
  ): Promise<InsurancePolicyDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const policy = await prisma.insurancePolicy.findUnique({
      where: { id: policyId },
    });
    
    if (!policy) {
      throw new NotFoundException('Póliza no encontrada');
    }
    
    const updatedPolicy = await prisma.insurancePolicy.update({
      where: { id: policyId },
      data: {
        status,
        updatedAt: new Date(),
        metadata: {
          ...policy.metadata,
          statusHistory: [
            ...(policy.metadata?.statusHistory || []),
            {
              status,
              timestamp: new Date().toISOString(),
              reason,
            },
          ],
        },
      },
    });
    
    this.logger.log(`Estado de póliza actualizado: ${policyId} -> ${status}`);
    
    return this.getInsurancePolicyById(schemaName, policyId);
  }

  // ========== INSURANCE CLAIMS ==========
  
  async createInsuranceClaim(
    schemaName: string,
    userId: string,
    claimDto: CreateInsuranceClaimDto,
  ): Promise<InsuranceClaimDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    // Verify policy exists and is active
    const policy = await prisma.insurancePolicy.findUnique({
      where: { id: claimDto.policyId },
    });
    
    if (!policy) {
      throw new NotFoundException('Póliza no encontrada');
    }
    
    if (policy.userId !== userId) {
      throw new BadRequestException(
        'No puede crear reclamo para póliza de otro usuario',
      );
    }
    
    if (policy.status !== PolicyStatus.ACTIVE) {
      throw new BadRequestException('La póliza debe estar activa');
    }
    
    // Generate claim number
    const claimNumber = `CLM-${Date.now()}-${crypto.randomBytes(4).toString('hex').toUpperCase()}`;
    
    // Submit claim to external provider
    const externalClaim = await this.submitClaimToProvider(
      policy.provider,
      policy.metadata?.externalPolicyId,
      claimDto,
    );
    
    // Create claim record
    const claim = await prisma.insuranceClaim.create({
      data: {
        policyId: claimDto.policyId,
        claimNumber,
        userId,
        status: ClaimStatus.SUBMITTED,
        incidentType: claimDto.incidentType,
        description: claimDto.description,
        incidentDate: new Date(claimDto.incidentDate),
        reportedDate: new Date(),
        claimedAmount: claimDto.claimedAmount,
        attachments: claimDto.attachments || [],
        notes: [],
        metadata: {
          ...claimDto.metadata,
          externalClaimId: externalClaim.claimId,
          submittedVia: 'web_portal',
        },
        residentialComplexId: policy.residentialComplexId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    // Update policy claims list
    await prisma.insurancePolicy.update({
      where: { id: claimDto.policyId },
      data: {
        claims: {
          push: claim.id,
        },
        updatedAt: new Date(),
      },
    });
    
    this.logger.log(
      `Reclamo de seguro creado: ${claimNumber} para póliza ${claimDto.policyId}`,
    );
    
    return this.mapInsuranceClaimToDto(claim);
  }

  async getInsuranceClaims(
    schemaName: string,
    userId?: string,
    policyId?: string,
    status?: ClaimStatus,
  ): Promise<InsuranceClaimDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const where: any = {};
    if (userId) where.userId = userId;
    if (policyId) where.policyId = policyId;
    if (status) where.status = status;
    
    const claims = await prisma.insuranceClaim.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
    
    return claims.map(claim => this.mapInsuranceClaimToDto(claim));
  }

  async getInsuranceClaimById(
    schemaName: string,
    claimId: string,
  ): Promise<InsuranceClaimDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id: claimId },
    });
    
    if (!claim) {
      throw new NotFoundException('Reclamo no encontrado');
    }
    
    return this.mapInsuranceClaimToDto(claim);
  }

  async updateClaimStatus(
    schemaName: string,
    claimId: string,
    status: ClaimStatus,
    adjusterNotes?: string,
    approvedAmount?: number,
    settledAmount?: number,
  ): Promise<InsuranceClaimDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const claim = await prisma.insuranceClaim.findUnique({
      where: { id: claimId },
    });
    
    if (!claim) {
      throw new NotFoundException('Reclamo no encontrado');
    }
    
    const updateData: any = {
      status,
      updatedAt: new Date(),
      notes: [
        ...claim.notes,
        {
          date: new Date().toISOString(),
          author: 'System',
          note: adjusterNotes || `Estado cambiado a ${status}`,
        },
      ],
    };
    
    if (status === ClaimStatus.APPROVED && approvedAmount) {
      updateData.approvedAmount = approvedAmount;
      updateData.approvalDate = new Date();
    }
    
    if (status === ClaimStatus.SETTLED && settledAmount) {
      updateData.settledAmount = settledAmount;
      updateData.settlementDate = new Date();
    }
    
    if (status === ClaimStatus.REJECTED && adjusterNotes) {
      updateData.rejectionReason = adjusterNotes;
    }
    
    const updatedClaim = await prisma.insuranceClaim.update({
      where: { id: claimId },
      data: updateData,
    });
    
    this.logger.log(`Estado de reclamo actualizado: ${claimId} -> ${status}`);
    
    return this.mapInsuranceClaimToDto(updatedClaim);
  }

  // ========== EXTERNAL PROVIDER INTEGRATION ==========
  
  private async getAvailableProviders(
    insuranceType: InsuranceType,
    preferredProviders?: string[],
  ): Promise<any[]> {
    // Simulate getting available providers for the insurance type
    const allProviders = [
      {
        name: 'SecureLife Insurance',
        types: [InsuranceType.LIFE, InsuranceType.HEALTH],
        apiEndpoint: 'https://api.securelife.com',
      },
      {
        name: 'PropertyGuard',
        types: [InsuranceType.HOME, InsuranceType.PROPERTY],
        apiEndpoint: 'https://api.propertyguard.com',
      },
      {
        name: 'AutoProtect',
        types: [InsuranceType.AUTO],
        apiEndpoint: 'https://api.autoprotect.com',
      },
      {
        name: 'Universal Coverage',
        types: Object.values(InsuranceType),
        apiEndpoint: 'https://api.universalcoverage.com',
      },
    ];
    
    let availableProviders = allProviders.filter(provider =>
      provider.types.includes(insuranceType),
    );
    
    if (preferredProviders && preferredProviders.length > 0) {
      availableProviders = availableProviders.filter(provider =>
        preferredProviders.includes(provider.name),
      );
    }
    
    return availableProviders.slice(0, 3); // Return max 3 providers
  }

  private async requestQuoteFromProvider(
    provider: any,
    quoteRequest: InsuranceQuoteRequestDto,
    user: any,
  ): Promise<any> {
    // Simulate external API call to insurance provider
    return new Promise((resolve) => {
      setTimeout(() => {
        const basePremium = this.calculateBasePremium(
          quoteRequest.insuranceType,
          quoteRequest.coverageDetails.coverageAmount || 100000,
        );
        
        const premium = this.adjustPremiumForRisk(basePremium, quoteRequest, user);
        
        resolve({
          externalQuoteId: `${provider.name.toLowerCase().replace(/\s+/g, '_')}_${Date.now()}`,
          premium,
          billingFrequency: 'MONTHLY',
          coverageDetails: this.generateCoverageDetails(quoteRequest.insuranceType),
          exclusions: this.getStandardExclusions(quoteRequest.insuranceType),
          terms: {
            policyTerm: 12, // months
            renewalPolicy: 'AUTOMATIC',
            cancellationPolicy: '30_DAY_NOTICE',
          },
          metadata: {
            provider: provider.name,
            quotedAt: new Date().toISOString(),
            validityPeriod: '7_DAYS',
          },
        });
      }, 800 + Math.random() * 1200); // Random delay 0.8-2s
    });
  }

  private calculateBasePremium(
    insuranceType: InsuranceType,
    coverageAmount: number,
  ): number {
    const rates = {
      [InsuranceType.HOME]: 0.004, // 0.4% of coverage amount
      [InsuranceType.AUTO]: 0.008, // 0.8% of coverage amount
      [InsuranceType.LIFE]: 0.002, // 0.2% of coverage amount
      [InsuranceType.HEALTH]: 0.012, // 1.2% of coverage amount
      [InsuranceType.TRAVEL]: 0.05, // 5% of coverage amount
      [InsuranceType.PROPERTY]: 0.006, // 0.6% of coverage amount
      [InsuranceType.LIABILITY]: 0.003, // 0.3% of coverage amount
    };
    
    return Math.round((coverageAmount * (rates[insuranceType] || 0.005)) * 100) / 100;
  }

  private adjustPremiumForRisk(
    basePremium: number,
    quoteRequest: InsuranceQuoteRequestDto,
    user: any,
  ): number {
    let adjustmentFactor = 1.0;
    
    // Age factor for life/health insurance
    if (
      [InsuranceType.LIFE, InsuranceType.HEALTH].includes(
        quoteRequest.insuranceType,
      ) &&
      quoteRequest.personalDetails?.age
    ) {
      if (quoteRequest.personalDetails.age > 50) {
        adjustmentFactor *= 1.3;
      } else if (quoteRequest.personalDetails.age < 30) {
        adjustmentFactor *= 0.9;
      }
    }
    
    // Deductible factor
    if (quoteRequest.coverageDetails.deductible) {
      const deductibleRatio = quoteRequest.coverageDetails.deductible / 
        (quoteRequest.coverageDetails.coverageAmount || 100000);
      
      if (deductibleRatio > 0.1) {
        adjustmentFactor *= 0.85; // Higher deductible = lower premium
      } else if (deductibleRatio < 0.05) {
        adjustmentFactor *= 1.15; // Lower deductible = higher premium
      }
    }
    
    return Math.round(basePremium * adjustmentFactor * 100) / 100;
  }

  private generateCoverageDetails(insuranceType: InsuranceType): any[] {
    const coverageTypes = {
      [InsuranceType.HOME]: [
        { type: 'Dwelling', amount: 200000, description: 'Structure coverage' },
        { type: 'Personal Property', amount: 100000, description: 'Contents coverage' },
        { type: 'Liability', amount: 300000, description: 'Personal liability' },
      ],
      [InsuranceType.AUTO]: [
        { type: 'Liability', amount: 100000, description: 'Third-party liability' },
        { type: 'Collision', amount: 50000, description: 'Vehicle damage' },
        { type: 'Comprehensive', amount: 50000, description: 'Theft and vandalism' },
      ],
      [InsuranceType.LIFE]: [
        { type: 'Death Benefit', amount: 500000, description: 'Death benefit payout' },
        { type: 'Accidental Death', amount: 100000, description: 'Additional accidental coverage' },
      ],
    };
    
    return coverageTypes[insuranceType] || [];
  }

  private getStandardExclusions(insuranceType: InsuranceType): string[] {
    const exclusions = {
      [InsuranceType.HOME]: [
        'Floods and earthquakes',
        'Normal wear and tear',
        'Acts of war',
        'Nuclear hazards',
      ],
      [InsuranceType.AUTO]: [
        'Racing and competition use',
        'Intentional damage',
        'Normal maintenance',
        'Wear and tear',
      ],
      [InsuranceType.LIFE]: [
        'Suicide within 2 years',
        'Death due to illegal activities',
        'Pre-existing conditions not disclosed',
      ],
    };
    
    return exclusions[insuranceType] || ['Standard policy exclusions apply'];
  }

  private async createPolicyWithProvider(
    providerName: string,
    quoteId: string,
    paymentMethodId?: string,
  ): Promise<any> {
    // Simulate external API call to create policy
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          policyId: `ext_pol_${Date.now()}`,
          policyNumber: `${providerName.toUpperCase().substring(0, 3)}-${Date.now().toString().substring(-8)}`,
          beneficiaries: [],
        });
      }, 1500);
    });
  }

  private async submitClaimToProvider(
    providerName: string,
    externalPolicyId: string,
    claimDto: CreateInsuranceClaimDto,
  ): Promise<any> {
    // Simulate external API call to submit claim
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          claimId: `ext_clm_${Date.now()}`,
          estimatedProcessingDays: 15,
        });
      }, 1200);
    });
  }

  // ========== DTO MAPPERS ==========
  
  private mapInsuranceQuoteToDto(quote: any): InsuranceQuoteDto {
    return {
      id: quote.id,
      userId: quote.userId,
      insuranceType: quote.insuranceType,
      provider: quote.provider,
      providerQuoteId: quote.providerQuoteId,
      premium: quote.premium,
      billingFrequency: quote.billingFrequency,
      coverageAmount: quote.coverageAmount,
      deductible: quote.deductible,
      coverageDetails: quote.coverageDetails,
      exclusions: quote.exclusions,
      validUntil: quote.validUntil?.toISOString(),
      terms: quote.terms,
      metadata: quote.metadata,
      residentialComplexId: quote.residentialComplexId,
      createdAt: quote.createdAt?.toISOString(),
    };
  }

  private mapInsurancePolicyToDto(
    policy: any,
    user?: any,
  ): InsurancePolicyDto {
    return {
      id: policy.id,
      userId: policy.userId,
      holderName: user
        ? `${user.firstName} ${user.lastName}`.trim()
        : undefined,
      quoteId: policy.quoteId,
      policyNumber: policy.policyNumber,
      insuranceType: policy.insuranceType,
      provider: policy.provider,
      status: policy.status,
      premium: policy.premium,
      billingFrequency: policy.billingFrequency,
      coverageAmount: policy.coverageAmount,
      deductible: policy.deductible,
      startDate: policy.startDate?.toISOString(),
      endDate: policy.endDate?.toISOString(),
      renewalDate: policy.renewalDate?.toISOString(),
      coverageDetails: policy.coverageDetails,
      beneficiaries: policy.beneficiaries,
      terms: policy.terms,
      claims: policy.claims,
      metadata: policy.metadata,
      residentialComplexId: policy.residentialComplexId,
      createdAt: policy.createdAt?.toISOString(),
      updatedAt: policy.updatedAt?.toISOString(),
    };
  }

  private mapInsuranceClaimToDto(claim: any): InsuranceClaimDto {
    return {
      id: claim.id,
      policyId: claim.policyId,
      claimNumber: claim.claimNumber,
      userId: claim.userId,
      status: claim.status,
      incidentType: claim.incidentType,
      description: claim.description,
      incidentDate: claim.incidentDate?.toISOString(),
      reportedDate: claim.reportedDate?.toISOString(),
      claimedAmount: claim.claimedAmount,
      approvedAmount: claim.approvedAmount,
      settledAmount: claim.settledAmount,
      adjusterName: claim.adjusterName,
      adjusterId: claim.adjusterId,
      attachments: claim.attachments,
      notes: claim.notes,
      approvalDate: claim.approvalDate?.toISOString(),
      settlementDate: claim.settlementDate?.toISOString(),
      rejectionReason: claim.rejectionReason,
      metadata: claim.metadata,
      residentialComplexId: claim.residentialComplexId,
      createdAt: claim.createdAt?.toISOString(),
      updatedAt: claim.updatedAt?.toISOString(),
    };
  }
}