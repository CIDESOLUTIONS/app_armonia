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
import { CommunicationsService } from '../communications/communications.service';
import {
  NotificationType,
  NotificationSourceType,
} from '../common/dto/communications.dto';

@Injectable()
export class PackagesService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
    private communicationsService: CommunicationsService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async registerPackage(
    schemaName: string,
    data: RegisterPackageDto,
  ): Promise<PackageDto> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
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
    const prisma: any = this.getTenantPrismaClient(schemaName);
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
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
      take: filters.limit ?? 10,
      orderBy: { registrationDate: 'desc' },
    });
  }

  async getPackageById(schemaName: string, id: number): Promise<PackageDto> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado.`);
    }
    return pkg;
  }

  async deliverPackage(schemaName: string, id: number): Promise<PackageDto> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
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

    // Notificar al residente
    if (pkg.recipientId) {
      // Obtener el ID del usuario asociado al residente
      const residentUser = await prisma.user.findFirst({
        where: { resident: { some: { id: pkg.recipientId } } },
        select: { id: true },
      });

      if (residentUser) {
        await this.communicationsService.notifyUser(
          schemaName,
          residentUser.id,
          {
            type: NotificationType.INFO,
            title: 'Paquete Entregado',
            message: `Tu paquete con número de seguimiento ${pkg.trackingNumber || 'N/A'} ha sido entregado.`, // Usar el trackingNumber del paquete
            link: `/resident/packages/${pkg.id}`, // Enlace a la página de detalles del paquete
            sourceType: NotificationSourceType.PACKAGE,
            sourceId: pkg.id.toString(), // Convertir a string
          },
        );
      }
    }
  }

  async updatePackage(
    schemaName: string,
    id: number,
    data: UpdatePackageDto,
  ): Promise<PackageDto> {
    const prisma: any = this.getTenantPrismaClient(schemaName);
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
