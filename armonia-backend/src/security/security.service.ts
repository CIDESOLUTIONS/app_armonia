import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSecurityEventDto,
  CreateAccessAttemptDto,
} from '../common/dto/security.dto';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  async createSecurityEvent(schemaName: string, data: CreateSecurityEventDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.securityEvent.create({
      data: {
        type: data.type,
        description: data.description,
        location: data.location,
        reportedBy: data.reportedByUserId
          ? { connect: { id: data.reportedByUserId } }
          : undefined,
        residentialComplex: { connect: { id: data.residentialComplexId } },
      },
    });
  }

  async getSecurityEvents(schemaName: string, filters: any) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.securityEvent.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAccessAttempt(schemaName: string, data: CreateAccessAttemptDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.accessAttempt.create({
      data: {
        ipAddress: data.ipAddress,
        username: data.username,
        isSuccess: data.isSuccess,
        reason: data.reason,
        user: data.userId ? { connect: { id: data.userId } } : undefined,
        residentialComplex: { connect: { id: data.residentialComplexId } }, // Added
      },
    });
  }

  async getAccessAttempts(schemaName: string, filters: any) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.accessAttempt.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }
}
