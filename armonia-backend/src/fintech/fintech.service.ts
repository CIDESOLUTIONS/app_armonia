import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  MicroCreditRequestDto,
  CreditApplicationDto,
  CreditScoreDto,
  LoanPaymentDto,
  FinancialProductDto,
  CreditApplicationStatus,
  CreditType,
  CreditScoreProvider,
  PaymentStatus,
} from '../common/dto/fintech-insurtech.dto';
import * as crypto from 'crypto';

@Injectable()
export class FintechService {
  private readonly logger = new Logger(FintechService.name);

  constructor(private prisma: PrismaService) {}

  // ========== MICRO CREDIT APPLICATIONS ==========
  
  async requestMicroCredit(
    schemaName: string,
    userId: string,
    requestDto: MicroCreditRequestDto,
  ): Promise<CreditApplicationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    // Verify user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }
    
    // Check for existing pending applications
    const existingApplication = await prisma.creditApplication.findFirst({
      where: {
        userId,
        status: CreditApplicationStatus.PENDING,
      },
    });
    
    if (existingApplication) {
      throw new BadRequestException(
        'Ya tiene una solicitud de crédito pendiente',
      );
    }
    
    // Get credit score for risk assessment
    const creditScore = await this.getCreditScore(schemaName, userId);
    
    // Perform risk assessment
    const riskAssessment = await this.performRiskAssessment(
      requestDto,
      creditScore,
      user,
    );
    
    // Calculate terms based on risk assessment
    const terms = this.calculateLoanTerms(
      requestDto.amount,
      requestDto.termMonths,
      riskAssessment.interestRate,
    );
    
    // Create external application with provider
    const externalApplication = await this.submitToExternalProvider(
      requestDto,
      riskAssessment,
    );
    
    // Create application record
    const application = await prisma.creditApplication.create({
      data: {
        userId,
        type: CreditType.MICRO_CREDIT,
        requestedAmount: requestDto.amount,
        termMonths: requestDto.termMonths,
        purpose: requestDto.purpose,
        status: CreditApplicationStatus.PENDING,
        provider: externalApplication.provider,
        externalApplicationId: externalApplication.applicationId,
        attachments: requestDto.attachments || [],
        riskAssessment: riskAssessment,
        terms: terms,
        applicationDate: new Date(),
        metadata: {
          ...requestDto.metadata,
          employmentStatus: requestDto.employmentStatus,
          monthlyIncome: requestDto.monthlyIncome,
        },
        residentialComplexId: user.residentialComplexId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    });
    
    this.logger.log(
      `Solicitud de microcrédito creada: ${application.id} por usuario ${userId}`,
    );
    
    return this.mapCreditApplicationToDto(application, user);
  }

  async getCreditApplications(
    schemaName: string,
    userId?: string,
    status?: CreditApplicationStatus,
    type?: CreditType,
  ): Promise<CreditApplicationDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    if (type) where.type = type;
    
    const applications = await prisma.microCreditApplication.findMany({
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
        payments: true,
      },
      orderBy: { createdAt: 'desc' },
    });
    
    return applications.map(app => this.mapCreditApplicationToDto(app, app.user));
  }

  async getCreditApplicationById(
    schemaName: string,
    applicationId: string,
  ): Promise<CreditApplicationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const application = await prisma.creditApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        payments: true,
      },
    });
    
    if (!application) {
      throw new NotFoundException('Solicitud de crédito no encontrada');
    }
    
    return this.mapCreditApplicationToDto(application, application.user);
  }

  async updateCreditApplicationStatus(
    schemaName: string,
    applicationId: string,
    status: CreditApplicationStatus,
    adminNotes?: string,
  ): Promise<CreditApplicationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const application = await prisma.creditApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });
    
    if (!application) {
      throw new NotFoundException('Solicitud no encontrada');
    }
    
    const updateData: any = {
      status,
      updatedAt: new Date(),
      metadata: {
        ...application.metadata,
        statusHistory: [
          ...(application.metadata?.statusHistory || []),
          {
            status,
            timestamp: new Date().toISOString(),
            adminNotes,
          },
        ],
      },
    };
    
    if (status === CreditApplicationStatus.APPROVED) {
      updateData.approvalDate = new Date();
      updateData.approvedAmount = application.requestedAmount; // Or different amount
      
      // Generate payment schedule
      await this.generatePaymentSchedule(
        applicationId,
        application.requestedAmount,
        application.termMonths,
        application.riskAssessment?.interestRate || 0.05,
      );
    } else if (status === CreditApplicationStatus.REJECTED) {
      updateData.rejectionReason = adminNotes || 'No especificado';
    }
    
    const updatedApplication = await prisma.creditApplication.update({
      where: { id: applicationId },
      data: updateData,
    });
    
    this.logger.log(
      `Estado de solicitud actualizado: ${applicationId} -> ${status}`,
    );
    
    return this.mapCreditApplicationToDto(updatedApplication, application.user);
  }

  // ========== CREDIT SCORING ==========
  
  async getCreditScore(
    schemaName: string,
    userId: string,
    forceRefresh: boolean = false,
  ): Promise<CreditScoreDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    // Check for existing recent credit score
    if (!forceRefresh) {
      const existingScore = await prisma.creditScore.findFirst({
        where: {
          userId,
          lastUpdated: {
            gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        },
        orderBy: { lastUpdated: 'desc' },
      });
      
      if (existingScore) {
        return this.mapCreditScoreToDto(existingScore);
      }
    }
    
    // Fetch from external credit bureau
    const externalScore = await this.fetchCreditScoreFromProvider(userId);
    
    // Calculate internal score factors
    const internalFactors = await this.calculateInternalCreditFactors(
      schemaName,
      userId,
    );
    
    // Combine external and internal scores
    const combinedScore = this.combineScores(externalScore, internalFactors);
    
    // Store updated credit score
    const creditScore = await prisma.creditScore.create({
      data: {
        userId,
        score: combinedScore.score,
        scoreRange: this.getScoreRange(combinedScore.score),
        provider: CreditScoreProvider.INTERNAL,
        factors: combinedScore.factors,
        history: {
          trend: combinedScore.trend,
          previousScore: externalScore.score,
          changeFromPrevious: combinedScore.score - externalScore.score,
        },
        lastUpdated: new Date(),
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        residentialComplexId: '', // Should be set from user context
      },
    });
    
    this.logger.log(
      `Puntaje crediticio actualizado para usuario ${userId}: ${combinedScore.score}`,
    );
    
    return this.mapCreditScoreToDto(creditScore);
  }

  private async fetchCreditScoreFromProvider(
    userId: string,
  ): Promise<{ score: number; factors: any[] }> {
    // Simulate external API call to credit bureau
    return new Promise((resolve) => {
      setTimeout(() => {
        const score = Math.floor(Math.random() * 300) + 300; // 300-600
        const factors = [
          {
            factor: 'Payment History',
            impact: score > 500 ? 'positive' : 'negative',
            description:
              score > 500
                ? 'Historial de pagos consistente'
                : 'Algunos pagos tardíos reportados',
          },
          {
            factor: 'Credit Utilization',
            impact: 'neutral',
            description: 'Utilización de crédito moderada',
          },
          {
            factor: 'Credit Age',
            impact: 'positive',
            description: 'Historial crediticio establecido',
          },
        ];
        
        resolve({ score, factors });
      }, 1000);
    });
  }

  private async calculateInternalCreditFactors(
    schemaName: string,
    userId: string,
  ): Promise<{ score: number; factors: any[] }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    // Get user payment history in the system
    const payments = await prisma.payment.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: 50,
    });
    
    // Calculate internal score based on:
    // - Payment timeliness
    // - Payment consistency
    // - Account age
    // - Usage patterns
    
    const onTimePayments = payments.filter(
      p => p.status === 'COMPLETED',
    ).length;
    const totalPayments = payments.length;
    const paymentScore = totalPayments > 0 ? (onTimePayments / totalPayments) * 100 : 50;
    
    // Additional factors can be calculated here
    const internalScore = Math.min(850, Math.max(300, 300 + paymentScore * 3));
    
    const factors = [
      {
        factor: 'Payment History in System',
        impact: paymentScore > 80 ? 'positive' : paymentScore > 60 ? 'neutral' : 'negative',
        description: `${onTimePayments}/${totalPayments} pagos a tiempo`,
      },
    ];
    
    return { score: internalScore, factors };
  }

  private combineScores(
    externalScore: any,
    internalFactors: any,
  ): { score: number; factors: any[]; trend: string } {
    // Weight external score at 70% and internal at 30%
    const combinedScore = Math.round(
      externalScore.score * 0.7 + internalFactors.score * 0.3,
    );
    
    const allFactors = [...externalScore.factors, ...internalFactors.factors];
    
    const trend = combinedScore > externalScore.score ? 'improving' : 
                  combinedScore < externalScore.score ? 'declining' : 'stable';
    
    return {
      score: combinedScore,
      factors: allFactors,
      trend,
    };
  }

  private getScoreRange(score: number): string {
    if (score >= 750) return 'Excellent';
    if (score >= 700) return 'Good';
    if (score >= 650) return 'Fair';
    if (score >= 600) return 'Poor';
    return 'Very Poor';
  }

  // ========== LOAN MANAGEMENT ==========
  
  async generatePaymentSchedule(
    applicationId: string,
    loanAmount: number,
    termMonths: number,
    annualInterestRate: number,
  ): Promise<LoanPaymentDto[]> {
    const prisma = this.prisma.getTenantDB('default'); // This should use proper schema
    
    const monthlyInterestRate = annualInterestRate / 12;
    const monthlyPayment = this.calculateMonthlyPayment(
      loanAmount,
      monthlyInterestRate,
      termMonths,
    );
    
    const payments: any[] = [];
    let remainingBalance = loanAmount;
    
    for (let i = 1; i <= termMonths; i++) {
      const interestAmount = remainingBalance * monthlyInterestRate;
      const principalAmount = monthlyPayment - interestAmount;
      remainingBalance -= principalAmount;
      
      const dueDate = new Date();
      dueDate.setMonth(dueDate.getMonth() + i);
      
      payments.push({
        loanId: applicationId,
        paymentNumber: i,
        amount: monthlyPayment,
        principalAmount,
        interestAmount,
        dueDate,
        status: PaymentStatus.SCHEDULED,
        remainingBalance: Math.max(0, remainingBalance),
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    
    // Create payment records
    await prisma.loanPayment.createMany({
      data: payments,
    });
    
    this.logger.log(
      `Cronograma de pagos generado para préstamo ${applicationId}: ${termMonths} cuotas`,
    );
    
    return payments.map(payment => this.mapLoanPaymentToDto(payment));
  }

  private calculateMonthlyPayment(
    principal: number,
    monthlyInterestRate: number,
    termMonths: number,
  ): number {
    if (monthlyInterestRate === 0) {
      return principal / termMonths;
    }
    
    const factor = Math.pow(1 + monthlyInterestRate, termMonths);
    return (principal * monthlyInterestRate * factor) / (factor - 1);
  }

  async getLoanPayments(
    schemaName: string,
    loanId: string,
  ): Promise<LoanPaymentDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const payments = await prisma.loanPayment.findMany({
      where: { loanId },
      orderBy: { paymentNumber: 'asc' },
    });
    
    return payments.map(payment => this.mapLoanPaymentToDto(payment));
  }

  async recordLoanPayment(
    schemaName: string,
    paymentId: string,
    transactionId: string,
    paymentMethod: string,
  ): Promise<LoanPaymentDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const payment = await prisma.loanPayment.update({
      where: { id: paymentId },
      data: {
        status: PaymentStatus.PAID,
        paidDate: new Date(),
        transactionId,
        paymentMethod,
        updatedAt: new Date(),
      },
    });
    
    this.logger.log(
      `Pago de préstamo registrado: ${paymentId} - ${transactionId}`,
    );
    
    return this.mapLoanPaymentToDto(payment);
  }

  // ========== FINANCIAL PRODUCTS ==========
  
  async getAvailableFinancialProducts(
    schemaName: string,
    creditScore?: number,
    requestedAmount?: number,
  ): Promise<FinancialProductDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    
    const where: any = { isActive: true };
    
    if (requestedAmount) {
      where.minAmount = { lte: requestedAmount };
      where.maxAmount = { gte: requestedAmount };
    }
    
    const products = await prisma.financialProduct.findMany({
      where,
      orderBy: { interestRateMin: 'asc' },
    });
    
    // Filter by credit score if provided
    if (creditScore) {
      return products.filter(product =>
        this.isEligibleForProduct(product, creditScore),
      );
    }
    
    return products.map(product => this.mapFinancialProductToDto(product));
  }

  private isEligibleForProduct(
    product: any,
    creditScore: number,
  ): boolean {
    // Define minimum credit scores for different product types
    const minimumScores = {
      [CreditType.MICRO_CREDIT]: 500,
      [CreditType.PERSONAL_LOAN]: 600,
      [CreditType.BUSINESS_LOAN]: 650,
      [CreditType.EMERGENCY_LOAN]: 450,
    };
    
    return creditScore >= (minimumScores[product.type] || 500);
  }

  // ========== RISK ASSESSMENT ==========
  
  private async performRiskAssessment(
    requestDto: MicroCreditRequestDto,
    creditScore: CreditScoreDto,
    user: any,
  ): Promise<{
    score: number;
    factors: string[];
    recommendation: string;
    interestRate: number;
  }> {
    const factors: string[] = [];
    let riskScore = 50; // Base risk score (0-100, lower is better)
    
    // Credit score factor (40% weight)
    if (creditScore.score >= 700) {
      riskScore -= 20;
      factors.push('Excellent credit score');
    } else if (creditScore.score >= 650) {
      riskScore -= 10;
      factors.push('Good credit score');
    } else if (creditScore.score >= 600) {
      riskScore += 0;
      factors.push('Fair credit score');
    } else {
      riskScore += 15;
      factors.push('Poor credit score');
    }
    
    // Income verification (30% weight)
    if (requestDto.monthlyIncome) {
      const debtToIncomeRatio = requestDto.amount / (requestDto.monthlyIncome * requestDto.termMonths);
      
      if (debtToIncomeRatio < 0.3) {
        riskScore -= 15;
        factors.push('Low debt-to-income ratio');
      } else if (debtToIncomeRatio < 0.5) {
        riskScore += 0;
        factors.push('Moderate debt-to-income ratio');
      } else {
        riskScore += 20;
        factors.push('High debt-to-income ratio');
      }
    }
    
    // Employment status (20% weight)
    if (requestDto.employmentStatus) {
      if (['EMPLOYED', 'SELF_EMPLOYED'].includes(requestDto.employmentStatus)) {
        riskScore -= 10;
        factors.push('Stable employment');
      } else {
        riskScore += 10;
        factors.push('Unstable employment');
      }
    }
    
    // Loan purpose (10% weight)
    const lowRiskPurposes = ['HOME_IMPROVEMENT', 'EDUCATION', 'BUSINESS'];
    if (lowRiskPurposes.some(purpose => requestDto.purpose.toUpperCase().includes(purpose))) {
      riskScore -= 5;
      factors.push('Low-risk loan purpose');
    }
    
    // Determine interest rate based on risk score
    let interestRate = 0.05; // Base rate 5%
    if (riskScore <= 20) {
      interestRate = 0.04; // 4% for low risk
    } else if (riskScore <= 40) {
      interestRate = 0.05; // 5% for moderate risk
    } else if (riskScore <= 60) {
      interestRate = 0.07; // 7% for high risk
    } else {
      interestRate = 0.10; // 10% for very high risk
    }
    
    // Recommendation
    let recommendation: string;
    if (riskScore <= 30) {
      recommendation = 'APPROVE';
    } else if (riskScore <= 50) {
      recommendation = 'APPROVE_WITH_CONDITIONS';
    } else if (riskScore <= 70) {
      recommendation = 'MANUAL_REVIEW';
    } else {
      recommendation = 'REJECT';
    }
    
    return {
      score: riskScore,
      factors,
      recommendation,
      interestRate,
    };
  }

  // ========== EXTERNAL PROVIDER INTEGRATION ==========
  
  private async submitToExternalProvider(
    requestDto: MicroCreditRequestDto,
    riskAssessment: any,
  ): Promise<{ provider: string; applicationId: string }> {
    // Simulate external API call to FinTech provider
    return new Promise((resolve) => {
      setTimeout(() => {
        const applicationId = `ext_${crypto.randomBytes(8).toString('hex')}`;
        resolve({
          provider: 'Advanced FinTech Solutions',
          applicationId,
        });
      }, 1500);
    });
  }

  private calculateLoanTerms(
    amount: number,
    termMonths: number,
    interestRate: number,
  ): any {
    const monthlyPayment = this.calculateMonthlyPayment(
      amount,
      interestRate / 12,
      termMonths,
    );
    
    const totalRepayment = monthlyPayment * termMonths;
    const totalInterest = totalRepayment - amount;
    
    const firstPaymentDate = new Date();
    firstPaymentDate.setMonth(firstPaymentDate.getMonth() + 1);
    
    return {
      monthlyPayment: Math.round(monthlyPayment * 100) / 100,
      totalInterest: Math.round(totalInterest * 100) / 100,
      totalRepayment: Math.round(totalRepayment * 100) / 100,
      firstPaymentDate: firstPaymentDate.toISOString(),
    };
  }

  // ========== DTO MAPPERS ==========
  
  private mapCreditApplicationToDto(
    application: any,
    user?: any,
  ): CreditApplicationDto {
    return {
      id: application.id,
      userId: application.userId,
      applicantName: user
        ? `${user.firstName} ${user.lastName}`.trim()
        : undefined,
      type: application.type,
      requestedAmount: application.requestedAmount,
      approvedAmount: application.approvedAmount,
      termMonths: application.termMonths,
      interestRate: application.riskAssessment?.interestRate,
      purpose: application.purpose,
      status: application.status,
      provider: application.provider,
      externalApplicationId: application.externalApplicationId,
      attachments: application.attachments,
      riskAssessment: application.riskAssessment,
      terms: application.terms,
      applicationDate: application.applicationDate?.toISOString(),
      approvalDate: application.approvalDate?.toISOString(),
      disbursementDate: application.disbursementDate?.toISOString(),
      rejectionReason: application.rejectionReason,
      metadata: application.metadata,
      residentialComplexId: application.residentialComplexId,
      createdAt: application.createdAt?.toISOString(),
      updatedAt: application.updatedAt?.toISOString(),
    };
  }

  private mapCreditScoreToDto(creditScore: any): CreditScoreDto {
    return {
      id: creditScore.id,
      userId: creditScore.userId,
      score: creditScore.score,
      scoreRange: creditScore.scoreRange,
      provider: creditScore.provider,
      factors: creditScore.factors,
      history: creditScore.history,
      lastUpdated: creditScore.lastUpdated?.toISOString(),
      expiresAt: creditScore.expiresAt?.toISOString(),
      residentialComplexId: creditScore.residentialComplexId,
    };
  }

  private mapLoanPaymentToDto(payment: any): LoanPaymentDto {
    return {
      id: payment.id,
      loanId: payment.loanId,
      paymentNumber: payment.paymentNumber,
      amount: payment.amount,
      principalAmount: payment.principalAmount,
      interestAmount: payment.interestAmount,
      dueDate: payment.dueDate?.toISOString(),
      paidDate: payment.paidDate?.toISOString(),
      status: payment.status,
      paymentMethod: payment.paymentMethod,
      transactionId: payment.transactionId,
      lateFee: payment.lateFee,
      remainingBalance: payment.remainingBalance,
      metadata: payment.metadata,
    };
  }

  private mapFinancialProductToDto(product: any): FinancialProductDto {
    return {
      id: product.id,
      name: product.name,
      description: product.description,
      type: product.type,
      provider: product.provider,
      minAmount: product.minAmount,
      maxAmount: product.maxAmount,
      minTermMonths: product.minTermMonths,
      maxTermMonths: product.maxTermMonths,
      interestRateMin: product.interestRateMin,
      interestRateMax: product.interestRateMax,
      eligibilityCriteria: product.eligibilityCriteria,
      requiredDocuments: product.requiredDocuments,
      isActive: product.isActive,
      quickApproval: product.quickApproval,
      processingFee: product.processingFee,
      metadata: product.metadata,
    };
  }
}