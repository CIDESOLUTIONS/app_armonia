import { Injectable } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSecurityEventDto,
  CreateAccessAttemptDto,
} from '../common/dto/security.dto';

@Injectable()
export class SecurityService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prismaService: PrismaService, // Cambiado a prismaService
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createSecurityLog(schemaName: string, data: CreateSecurityEventDto) {
    const prisma = this.prismaClientManager.getClient(schemaName);
    return prisma.securityLog.create({ data });
  }

  async getSecurityLogs(schemaName: string, filters: any = {}) {
    const prisma = this.prismaClientManager.getClient(schemaName);
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.eventType) where.eventType = filters.eventType;
    if (filters.complexId) where.complexId = filters.complexId;
    return prisma.securityLog.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });
  }

  async createAccessAttempt(data: CreateAccessAttemptDto) {
    const prisma = this.prismaClientManager.getClient('default');
    return prisma.accessAttempt.create({ data });
  }

  async getAccessAttempts(filters: any = {}) {
    const prisma = this.prismaClientManager.getClient('default');
    const where: any = {};
    if (filters.userId) where.userId = filters.userId;
    if (filters.ipAddress) where.ipAddress = filters.ipAddress;
    if (filters.success !== undefined) where.success = filters.success;
    return prisma.accessAttempt.findMany({
      where,
      orderBy: { timestamp: 'desc' },
    });
  }
}
