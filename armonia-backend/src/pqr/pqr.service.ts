import {
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePQRDto,
  UpdatePQRDto,
  GetPQRParamsDto,
} from '../common/dto/pqr.dto';
import { UserRole } from '../common/enums/user-role.enum';

@Injectable()
export class PqrService {
  constructor(private prisma: PrismaService) {}

  async createPqr(schemaName: string, userId: string, data: CreatePQRDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.pQR.create({
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        reportedBy: { connect: { id: userId } }, // Connect to User model
        residentialComplex: { connect: { id: data.residentialComplexId } }, // Connect to ResidentialComplex
      },
    });
  }

  async getPqrs(
    schemaName: string,
    userId: string,
    userRole: UserRole,
    filters: GetPQRParamsDto,
  ) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const where: any = {};
    if (userRole === UserRole.RESIDENT) {
      where.reportedById = userId;
    }
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;

    return prisma.pQR.findMany({
      where,
      include: { reportedBy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPqrById(
    schemaName: string,
    userId: string,
    userRole: UserRole,
    id: string,
  ) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const pqr = await prisma.pQR.findUnique({
      where: { id },
      include: {
        reportedBy: { select: { name: true } },
      },
    });
    if (!pqr) {
      throw new NotFoundException(`PQR with ID ${id} no encontrada.`);
    }
    if (userRole === UserRole.RESIDENT && pqr.reportedById !== userId) {
      throw new UnauthorizedException(
        'You are not authorized to view this PQR.',
      );
    }
    return pqr;
  }

  async updatePqr(schemaName: string, id: string, data: UpdatePQRDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.pQR.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        type: data.type,
        status: data.status,
        ...(data.reportedById && {
          reportedBy: { connect: { id: data.reportedById } },
        }),
        ...(data.residentialComplexId && {
          residentialComplex: { connect: { id: data.residentialComplexId } },
        }),
      },
    });
  }
}
