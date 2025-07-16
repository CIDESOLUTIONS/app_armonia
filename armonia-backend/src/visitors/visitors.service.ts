import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateVisitorDto,
  UpdateVisitorDto,
  VisitorDto,
  VisitorFilterParamsDto,
  VisitorStatus,
} from '../common/dto/visitors.dto';

@Injectable()
export class VisitorsService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createVisitor(
    schemaName: string,
    data: CreateVisitorDto,
  ): Promise<VisitorDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
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
    const prisma = this.getTenantPrismaClient(schemaName);
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
      skip: (filters.page - 1) * filters.limit || 0,
      take: filters.limit || 10,
      orderBy: { entryTime: 'desc' },
    });
  }

  async getVisitorById(schemaName: string, id: number): Promise<VisitorDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
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
    const prisma = this.getTenantPrismaClient(schemaName);
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
    const prisma = this.getTenantPrismaClient(schemaName);
    await prisma.visitor.delete({ where: { id } });
  }

  async scanQrCode(schemaName: string, qrCode: string): Promise<VisitorDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // In a real scenario, this would involve decoding the QR code
    // and looking up the pre-registered visitor or visitor entry.
    // For now, a simple mock.
    if (qrCode === 'VALID_QR_CODE') {
      const visitor = await prisma.visitor.findFirst({
        where: { documentNumber: '12345' }, // Example lookup
      });
      if (visitor) return visitor;
    }
    throw new NotFoundException('QR Code inválido o visitante no encontrado.');
  }

  async getPreRegisteredVisitors(schemaName: string): Promise<VisitorDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // This would fetch pre-registered visitors from the database
    // For now, returning mock data
    return [
      {
        id: 1,
        name: 'Visitante Pre-registrado 1',
        documentType: VisitorDocumentType.CC,
        documentNumber: 'PR12345',
        destination: 'Apto 101',
        residentName: 'Residente A',
        entryTime: new Date().toISOString(),
        status: VisitorStatus.ACTIVE,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      },
    ] as VisitorDto[];
  }
}
