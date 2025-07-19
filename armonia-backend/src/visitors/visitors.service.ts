import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateVisitorDto,
  UpdateVisitorDto,
  VisitorDto,
  VisitorFilterParamsDto,
  VisitorStatus,
  VisitorDocumentType,
  PreRegistrationStatus,
} from '../common/dto/visitors.dto';

@Injectable()
export class VisitorsService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    // The global PrismaService instance already has access to all schemas
    // via the @@schema("tenant") directive. We just need to ensure we're
    // using the correct client instance.
    return this.prismaClientManager.getClient(schemaName);
  }

  async createVisitor(
    schemaName: string,
    data: CreateVisitorDto,
  ): Promise<VisitorDto> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
    return prisma.visitor.create({
      data: {
        ...data,
        entryTime: new Date().toISOString(),
        status: VisitorStatus.ACTIVE,
      },
    });
  }

  async getVisitors(
    schemaName: string,
    filters: VisitorFilterParamsDto,
  ): Promise<VisitorDto[]> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: 'insensitive' } },
        { documentNumber: { contains: filters.search, mode: 'insensitive' } },
        { destination: { contains: filters.search, mode: 'insensitive' } },
        { residentName: { contains: filters.search, mode: 'insensitive' } },
        { plate: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.documentType) {
      where.documentType = filters.documentType;
    }
    if (filters.documentNumber) {
      where.documentNumber = filters.documentNumber;
    }
    if (filters.destination) {
      where.destination = filters.destination;
    }
    if (filters.residentName) {
      where.residentName = filters.residentName;
    }
    if (filters.plate) {
      where.plate = filters.plate;
    }

    return prisma.visitor.findMany({
      where,
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
      take: filters.limit ?? 10,
      orderBy: { entryTime: 'desc' },
    });
  }

  async getVisitorById(schemaName: string, id: number): Promise<VisitorDto> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
    const visitor = await prisma.visitor.findUnique({ where: { id } });
    if (!visitor) {
      throw new NotFoundException(`Visitante con ID ${id} no encontrado.`);
    }
    return visitor;
  }

  async updateVisitor(
    schemaName: string,
    id: number,
    data: UpdateVisitorDto,
  ): Promise<VisitorDto> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
    const visitor = await prisma.visitor.findUnique({ where: { id } });

    if (!visitor) {
      throw new NotFoundException(`Visitante con ID ${id} no encontrado.`);
    }

    return prisma.visitor.update({
      where: { id },
      data,
    });
  }

  async deleteVisitor(schemaName: string, id: number): Promise<void> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
    await prisma.visitor.delete({ where: { id } });
  }

  async scanQrCode(schemaName: string, qrCode: string): Promise<VisitorDto> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
    const now = new Date();

    // Try to find a pre-registered visitor
    const preRegisteredVisitor = await prisma.preRegisteredVisitor.findFirst({
      where: {
        qrCodeUrl: qrCode, // Assuming qrCode is the URL or contains the ID
        status: PreRegistrationStatus.ACTIVE,
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
      include: { resident: true, property: true },
    });

    if (preRegisteredVisitor) {
      // Create a new visitor entry based on pre-registration
      const newVisitor = await prisma.visitor.create({
        data: {
          name: preRegisteredVisitor.name,
          documentType: preRegisteredVisitor.documentType || VisitorDocumentType.OTHER,
          documentNumber: preRegisteredVisitor.documentNumber || 'N/A',
          complexId: preRegisteredVisitor.complexId,
          propertyId: preRegisteredVisitor.propertyId,
          residentId: preRegisteredVisitor.residentId,
          entryTime: now.toISOString(),
          status: VisitorStatus.ACTIVE,
          preRegisterId: preRegisteredVisitor.id,
          purpose: preRegisteredVisitor.purpose,
          registeredBy: preRegisteredVisitor.residentId, // Assuming resident who pre-registered is the one registering
        },
      });

      // Update pre-registration status to USED if it's a single-use pass
      // This logic might need to be more complex based on AccessPassType
      await prisma.preRegisteredVisitor.update({
        where: { id: preRegisteredVisitor.id },
        data: { status: PreRegistrationStatus.USED },
      });

      return newVisitor;
    }

    // Try to find an access pass
    const accessPass = await prisma.accessPass.findFirst({
      where: {
        qrUrl: qrCode, // Assuming qrCode is the URL or contains the ID
        status: 'ACTIVE', // Assuming AccessPassStatus.ACTIVE
        validFrom: { lte: now },
        validUntil: { gte: now },
      },
      include: { preRegister: { include: { resident: true, property: true } } },
    });

    if (accessPass) {
      // Create a new visitor entry based on access pass
      const newVisitor = await prisma.visitor.create({
        data: {
          name: accessPass.preRegister?.name || 'Visitante con Pase',
          documentType: accessPass.preRegister?.documentType || VisitorDocumentType.OTHER,
          documentNumber: accessPass.preRegister?.documentNumber || 'N/A',
          complexId: accessPass.preRegister?.complexId || 0, // Adjust as needed
          propertyId: accessPass.preRegister?.propertyId || 0, // Adjust as needed
          residentId: accessPass.preRegister?.residentId,
          entryTime: now.toISOString(),
          status: VisitorStatus.ACTIVE,
          accessPassId: accessPass.id,
          registeredBy: accessPass.preRegister?.residentId || 0, // Assuming resident who pre-registered is the one registering
        },
      });

      // Update access pass usage count and status
      await prisma.accessPass.update({
        where: { id: accessPass.id },
        data: {
          usageCount: { increment: 1 },
          status: accessPass.maxUsages === 1 ? 'USED' : 'ACTIVE', // Assuming AccessPassStatus.USED
        },
      });

      return newVisitor;
    }

    throw new NotFoundException('QR Code inválido o visitante/pase no encontrado.');
  }

  async getPreRegisteredVisitors(schemaName: string): Promise<VisitorDto[]> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
    const now = new Date();
    const preRegistered = await prisma.preRegisteredVisitor.findMany({
      where: {
        status: PreRegistrationStatus.ACTIVE,
        validUntil: { gte: now },
      },
      include: { resident: true, property: true },
    });

    return preRegistered.map(pr => ({
      id: pr.id,
      name: pr.name,
      documentType: pr.documentType || VisitorDocumentType.OTHER,
      documentNumber: pr.documentNumber || 'N/A',
      destination: pr.property.unitNumber, // Assuming property unitNumber is the destination
      residentName: pr.resident.name, // Assuming resident name
      entryTime: pr.expectedDate.toISOString(), // Using expectedDate as entryTime for pre-registered
      status: VisitorStatus.ACTIVE, // Or a specific pre-registered status
      plate: null, // Not available in pre-registration
      photoUrl: null, // Not available in pre-registration
      notes: pr.purpose, // Using purpose as notes
      preRegisterId: pr.id,
      accessPassId: null,
      purpose: pr.purpose,
      company: null,
      temperature: null,
      belongings: null,
      signature: null,
      registeredBy: pr.residentId,
      createdAt: pr.createdAt.toISOString(),
      updatedAt: pr.updatedAt.toISOString(),
    }));
  }
}
