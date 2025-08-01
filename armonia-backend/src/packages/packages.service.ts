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

  async registerPackage(
    schemaName: string,
    data: RegisterPackageDto,
  ): Promise<PackageDto> {
    const prisma = this.prisma;
    const pkg = await prisma.package.create({
      data: { ...data, status: PackageStatus.PENDING },
    });

    // Notify resident
    const resident = await prisma.resident.findUnique({
      where: { id: pkg.residentId },
    });
    if (resident && resident.userId) {
      await this.communicationsService.notifyUser(schemaName, resident.userId, {
        type: NotificationType.INFO,
        title: 'Paquete Recibido',
        message: `Has recibido un paquete de ${pkg.sender}. Por favor, recógelo en la recepción.`,
        link: `/resident/packages/${pkg.id}`,
        sourceType: NotificationSourceType.PACKAGE,
        sourceId: pkg.id.toString(),
      });
    }

    return pkg;
  }

  async getPackages(
    schemaName: string,
    filters: PackageFilterParamsDto,
  ): Promise<{ data: PackageDto[]; total: number }> {
    const prisma = this.prisma;
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.residentId) where.residentId = filters.residentId;

    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const skip = (page - 1) * limit;

    const [data, total] = await Promise.all([
      prisma.package.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
      }),
      prisma.package.count({ where }),
    ]);

    return { data, total };
  }

  async getPackageById(schemaName: string, id: number): Promise<PackageDto> {
    const prisma = this.prisma;
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado.`);
    }
    return pkg;
  }

  async updatePackageStatus(
    schemaName: string,
    id: number,
    data: UpdatePackageDto,
  ): Promise<PackageDto> {
    const prisma = this.prisma;
    const pkg = await prisma.package.findUnique({ where: { id } });
    if (!pkg) {
      throw new NotFoundException(`Paquete con ID ${id} no encontrado.`);
    }
    return prisma.package.update({ where: { id }, data });
  }
}
