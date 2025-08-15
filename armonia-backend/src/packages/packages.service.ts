import { Injectable, NotFoundException } from '@nestjs/common';
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
    private prisma: PrismaService,
    private communicationsService: CommunicationsService,
  ) {}

  private mapToPackageDto(pkg: any): PackageDto {
    return {
      id: pkg.id,
      residentId: pkg.residentId,
      receivedAt: pkg.receivedAt,
      deliveredAt: pkg.deliveredAt,
      notes: pkg.notes,
      residentialComplexId: pkg.residentialComplexId,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,
    };
  }

  async registerPackage(
    schemaName: string,
    data: RegisterPackageDto,
  ): Promise<PackageDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const pkg = await prisma.package.create({
      data: {
        resident: { connect: { id: data.residentId } },
        receivedAt: data.receivedAt ? new Date(data.receivedAt) : new Date(),
        deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : null,
        notes: data.notes,
        residentialComplex: { connect: { id: data.residentialComplexId } },
      },
    });

    // Notify resident
    const resident = await prisma.resident.findUnique({
      where: { id: pkg.residentId },
    });
    if (resident && resident.userId) {
      await this.communicationsService.notifyUser(schemaName, resident.userId, {
        type: NotificationType.INFO,
        title: 'Paquete Recibido',
        message: `Has recibido un paquete. Por favor, recógelo en la recepción.`,
        link: `/resident/packages/${pkg.id}`,
        sourceType: NotificationSourceType.PACKAGE,
        sourceId: pkg.id.toString(),
      });
    }

    return this.mapToPackageDto(pkg);
  }

  async getPackages(
    schemaName: string,
    filters: PackageFilterParamsDto,
  ): Promise<{ data: PackageDto[]; total: number }> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = {};
    if (filters.residentId) where.residentId = filters.residentId;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [packages, total] = await Promise.all([
      prisma.package.findMany({
        where,
        skip,
        take: limit,
        orderBy: { receivedAt: 'desc' },
      }),
      prisma.package.count({ where }),
    ]);

    return { data: packages.map(this.mapToPackageDto), total };
  }

  async getPackageById(schemaName: string, id: string): Promise<PackageDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado.`);
    }
    return this.mapToPackageDto(pkg);
  }

  async updatePackageStatus(
    schemaName: string,
    id: string,
    data: UpdatePackageDto,
  ): Promise<PackageDto> {
    const prisma = this.prisma.getTenantDB(schemaName);
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado.`);
    }
    const updatedPkg = await prisma.package.update({
      where: { id },
      data: {
        deliveredAt: data.deliveredAt ? new Date(data.deliveredAt) : undefined,
        notes: data.notes,
      },
    });
    return this.mapToPackageDto(updatedPkg);
  }
}
