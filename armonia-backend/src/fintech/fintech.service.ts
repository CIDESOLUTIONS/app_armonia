import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  MicroCreditRequestDto,
  CreditApplicationDto,
  CreditApplicationStatus,
  CreditType,
} from '../common/dto/fintech-insurtech.dto';

@Injectable()
export class FintechService {
  private readonly logger = new Logger(FintechService.name);

  constructor(private prisma: PrismaService) {}

  async requestMicroCredit(
    schemaName: string,
    userId: string,
    requestDto: MicroCreditRequestDto,
  ): Promise<CreditApplicationDto> {
    const prisma = this.prisma.forTenant(schemaName);

    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Usuario no encontrado');
    }

    const existingApplication = await prisma.microCreditApplication.findFirst({
      where: {
        userId,
        status: 'PENDING',
      },
    });

    if (existingApplication) {
      throw new BadRequestException('Ya tiene una solicitud de crédito pendiente');
    }

    const application = await prisma.microCreditApplication.create({
      data: {
        userId,
        amount: requestDto.amount,
        status: 'PENDING',
        // Add other required fields from your schema if necessary
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
    const prisma = this.prisma.forTenant(schemaName);

    const where: any = {};
    if (userId) where.userId = userId;
    if (status) where.status = status;
    // if (type) where.type = type; // Type does not exist on MicroCreditApplication model

    const applications = await prisma.microCreditApplication.findMany({
      where,
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });

    return applications.map((app) => this.mapCreditApplicationToDto(app, app.user));
  }

  async getCreditApplicationById(
    schemaName: string,
    applicationId: string,
  ): Promise<CreditApplicationDto> {
    const prisma = this.prisma.forTenant(schemaName);

    const application = await prisma.microCreditApplication.findUnique({
      where: { id: applicationId },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
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
    const prisma = this.prisma.forTenant(schemaName);

    const application = await prisma.microCreditApplication.findUnique({
      where: { id: applicationId },
      include: { user: true },
    });

    if (!application) {
      throw new NotFoundException('Solicitud no encontrada');
    }

    const updatedApplication = await prisma.microCreditApplication.update({
      where: { id: applicationId },
      data: { status },
    });

    this.logger.log(
      `Estado de solicitud actualizado: ${applicationId} -> ${status}`,
    );

    return this.mapCreditApplicationToDto(updatedApplication, application.user);
  }

  private mapCreditApplicationToDto(
    application: any,
    user?: any,
  ): CreditApplicationDto {
    return {
      id: application.id,
      userId: application.userId,
      applicantName: user ? user.name : undefined,
      type: CreditType.MICRO_CREDIT, // Assuming default type
      requestedAmount: application.amount.toNumber(),
      approvedAmount: application.approvedAmount?.toNumber(),
      termMonths: application.termMonths,
      interestRate: application.interestRate?.toNumber(),
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
}
