import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateSecurityEventDto,
  CreateAccessAttemptDto,
} from '../common/dto/security.dto.js';

@Injectable()
export class SecurityService {
  constructor(private prisma: PrismaService) {}

  async createSecurityEvent(schemaName: string, data: CreateSecurityEventDto) {
    const prisma = this.prisma;
    return prisma.securityEvent.create({ data });
  }

  async getSecurityEvents(schemaName: string, filters: any) {
    const prisma = this.prisma;
    return prisma.securityEvent.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }

  async createAccessAttempt(schemaName: string, data: CreateAccessAttemptDto) {
    const prisma = this.prisma;
    return prisma.accessAttempt.create({ data });
  }

  async getAccessAttempts(schemaName: string, filters: any) {
    const prisma = this.prisma;
    return prisma.accessAttempt.findMany({
      where: filters,
      orderBy: { createdAt: 'desc' },
    });
  }
}
