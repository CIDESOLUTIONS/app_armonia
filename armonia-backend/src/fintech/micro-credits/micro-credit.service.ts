import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import {
  CreateMicroCreditApplicationDto,
  UpdateMicroCreditApplicationDto,
  MicroCreditApplicationDto,
  MicroCreditStatus,
} from '@armonia-backend/common/dto/fintech.dto';

@Injectable()
export class MicroCreditService {
  constructor(private prisma: PrismaService) {}

  private mapToDto(app: any): MicroCreditApplicationDto {
    return {
      id: app.id,
      userId: app.userId,
      amount: app.amount,
      status: app.status as MicroCreditStatus,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    };
  }

  async createApplication(
    schemaName: string,
    userId: string,
    data: CreateMicroCreditApplicationDto,
  ): Promise<MicroCreditApplicationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const application = await prisma.microCreditApplication.create({
      data: {
        amount: data.amount,
        userId: userId,
        status: MicroCreditStatus.PENDING,
      },
    });
    return this.mapToDto(application);
  }

  async getApplicationsForUser(
    schemaName: string,
    userId: string,
  ): Promise<MicroCreditApplicationDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const applications = await prisma.microCreditApplication.findMany({
      where: { userId: userId },
      orderBy: { createdAt: 'desc' },
    });
    return applications.map(this.mapToDto);
  }

  async getAllApplications(
    schemaName: string,
    status?: string,
  ): Promise<MicroCreditApplicationDto[]> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const whereClause: any = {};
    if (status) {
      whereClause.status = status;
    }

    const applications = await prisma.microCreditApplication.findMany({
      where: whereClause,
      orderBy: { createdAt: 'desc' },
      include: { user: { select: { name: true, email: true } } },
    });
    return applications.map(app => ({ ...this.mapToDto(app), user: app.user }));
  }

  async updateApplicationStatus(
    schemaName: string,
    id: string,
    status: MicroCreditStatus,
    adminId: string,
  ): Promise<MicroCreditApplicationDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const application = await prisma.microCreditApplication.findUnique({
      where: { id },
    });

    if (!application) {
      throw new NotFoundException(`Solicitud con ID ${id} no encontrada.`);
    }

    if (application.status !== MicroCreditStatus.PENDING) {
        throw new BadRequestException(`La solicitud ya ha sido procesada (estado: ${application.status}).`);
    }

    // Si se aprueba, crear el pago y la futura cuota de cobro
    if (status === MicroCreditStatus.APPROVED) {
      // 1. Crear un pago para el usuario para saldar su deuda actual
      await prisma.payment.create({
        data: {
          userId: application.userId,
          amount: application.amount,
          date: new Date(),
          method: 'MICRO_CREDIT',
          status: 'COMPLETED',
          transactionId: `credit_approval_${application.id}`,
        },
      });

      // 2. Crear una nueva cuota para que el usuario pague el crédito
      const dueDate = new Date();
      dueDate.setDate(dueDate.getDate() + 30); // Vence en 30 días

      // Asumimos que el crédito se asocia a la primera propiedad del usuario
      const property = await prisma.property.findFirst({
          where: { ownerId: application.userId }
      });

      if (!property) {
          throw new NotFoundException('No se encontró una propiedad para asociar la cuota del crédito.');
      }

      await prisma.fee.create({
        data: {
            title: 'Pago de Microcrédito',
            description: `Cuota correspondiente al microcrédito aprobado #${application.id}`,
            type: 'LOAN',
            propertyId: property.id,
            amount: application.amount, // Se puede añadir interés aquí
            dueDate: dueDate,
        }
      });
    }

    const updatedApplication = await prisma.microCreditApplication.update({
      where: { id },
      data: { status },
    });

    return this.mapToDto(updatedApplication);
  }
}
