import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreatePQRDto, UpdatePQRDto, PQRCommentDto, GetPQRParamsDto } from '../common/dto/pqr.dto.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@Injectable()
export class PqrService {
  constructor(private prisma: PrismaService) {}

  async createPqr(schemaName: string, userId: number, data: CreatePQRDto) {
    const prisma = this.prisma;
    return prisma.pQR.create({
      data: { ...data, createdById: userId },
    });
  }

  async getPqrs(schemaName: string, userId: number, userRole: UserRole, filters: GetPQRParamsDto) {
    const prisma = this.prisma;
    const where: any = {};
    if (userRole === UserRole.RESIDENT) {
      where.createdById = userId;
    }
    if (filters.status) where.status = filters.status;
    if (filters.type) where.type = filters.type;
    if (filters.priority) where.priority = filters.priority;

    return prisma.pQR.findMany({
      where,
      include: { createdBy: { select: { name: true } } },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getPqrById(schemaName: string, userId: number, userRole: UserRole, id: number) {
    const prisma = this.prisma;
    const pqr = await prisma.pQR.findUnique({
      where: { id },
      include: { comments: { include: { author: { select: { name: true } } } } },
    });
    if (!pqr) {
      throw new NotFoundException(`PQR with ID ${id} not found.`);
    }
    if (userRole === UserRole.RESIDENT && pqr.createdById !== userId) {
      throw new UnauthorizedException('You are not authorized to view this PQR.');
    }
    return pqr;
  }

  async updatePqr(schemaName: string, id: number, data: UpdatePQRDto) {
    const prisma = this.prisma;
    return prisma.pQR.update({
      where: { id },
      data,
    });
  }

  async addComment(schemaName: string, userId: number, pqrId: number, data: PQRCommentDto) {
    const prisma = this.prisma;
    return prisma.pQRComment.create({
      data: { ...data, pqrId, authorId: userId },
    });
  }
}
