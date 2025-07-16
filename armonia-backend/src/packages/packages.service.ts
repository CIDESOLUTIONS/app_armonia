import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  RegisterPackageDto,
  UpdatePackageDto,
  PackageDto,
  PackageFilterParamsDto,
  PackageStatus,
} from '../common/dto/packages.dto';

@Injectable()
export class PackagesService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async registerPackage(
    schemaName: string,
    data: RegisterPackageDto,
  ): Promise<PackageDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.package.create({
      data: {
        ...data,
        registrationDate: new Date().toISOString(),
        status: PackageStatus.REGISTERED,
      },
    });
  }

  async getPackages(
    schemaName: string,
    filters: PackageFilterParamsDto,
  ): Promise<PackageDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { trackingNumber: { contains: filters.search, mode: 'insensitive' } },
        { recipientUnit: { contains: filters.search, mode: 'insensitive' } },
        { sender: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.recipientUnit) {
      where.recipientUnit = filters.recipientUnit;
    }
    if (filters.sender) {
      where.sender = filters.sender;
    }

    return prisma.package.findMany({
      where,
      skip: (filters.page - 1) * filters.limit || 0,
      take: filters.limit || 10,
      orderBy: { registrationDate: 'desc' },
    });
  }

  async getPackageById(schemaName: string, id: number): Promise<PackageDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado.`);
    }
    return pkg;
  }

  async deliverPackage(schemaName: string, id: number): Promise<PackageDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const pkg = await prisma.package.findUnique({ where: { id } });

    if (!pkg) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado.`);
    }

    return prisma.package.update({
      where: { id },
      data: {
        status: PackageStatus.DELIVERED,
        deliveryDate: new Date().toISOString(),
      },
    });
  }

  async updatePackage(
    schemaName: string,
    id: number,
    data: UpdatePackageDto,
  ): Promise<PackageDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const pkg = await prisma.package.findUnique({ where: { id } });

    if (!pkg) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado.`);
    }

    return prisma.package.update({
      where: { id },
      data,
    });
  }
}
