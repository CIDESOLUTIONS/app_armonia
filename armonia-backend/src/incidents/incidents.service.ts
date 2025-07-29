import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentDto,
  IncidentFilterParamsDto,
  IncidentStatus,
} from './incidents.dto.js';

@Injectable()
export class IncidentsService {
  constructor(private prisma: PrismaService) {}

  async createIncident(
    schemaName: string,
    data: CreateIncidentDto,
  ): Promise<IncidentDto> {
    const prisma: any = this.prisma;
    return prisma.incident.create({
      data: {
        ...data,
        reportedAt: new Date(),
        status: IncidentStatus.REPORTED,
        attachments: {
          create:
            data.attachments?.map((url) => ({
              url,
              name: url.substring(url.lastIndexOf('/') + 1),
              type: 'image/jpeg',
              size: 0,
            })) || [],
        },
      },
      include: { updates: true, attachments: true },
    });
  }

  async getIncidents(
    schemaName: string,
    filters: IncidentFilterParamsDto,
  ): Promise<IncidentDto[]> {
    const prisma: any = this.prisma;
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
        { location: { contains: filters.search, mode: 'insensitive' } },
        { reportedBy: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.priority) {
      where.priority = filters.priority;
    }

    return prisma.incident.findMany({
      where,
      include: { updates: true, attachments: true },
      skip: ((filters.page ?? 1) - 1) * (filters.limit ?? 10),
      take: filters.limit ?? 10,
      orderBy: { reportedAt: 'desc' },
    });
  }

  async getIncidentById(schemaName: string, id: number): Promise<IncidentDto> {
    const prisma: any = this.prisma;
    const incident = await prisma.incident.findUnique({
      where: { id },
      include: { updates: true, attachments: true },
    });
    if (!incident) {
      throw new NotFoundException(`Incidente con ID ${id} no encontrado.`);
    }
    return incident;
  }

  async updateIncident(
    schemaName: string,
    id: number,
    data: UpdateIncidentDto,
  ): Promise<IncidentDto> {
    const prisma: any = this.prisma;
    const incident = await prisma.incident.findUnique({ where: { id } });

    if (!incident) {
      throw new NotFoundException(`Incidente con ID ${id} no encontrado.`);
    }

    return prisma.incident.update({
      where: { id },
      data: {
        ...data,
        attachments: data.attachments
          ? {
              create: data.attachments.map((url) => ({
                url,
                name: url.substring(url.lastIndexOf('/') + 1),
                type: 'image/jpeg',
                size: 0,
              })),
            }
          : undefined,
      },
      include: { updates: true, attachments: true },
    });
  }

  async deleteIncident(schemaName: string, id: number): Promise<void> {
    const prisma: any = this.prisma;
    await prisma.incident.delete({ where: { id } });
  }

  async addIncidentUpdate(
    schemaName: string,
    incidentId: number,
    content: string,
    status: IncidentStatus,
    attachments?: string[],
  ): Promise<IncidentDto> {
    const prisma: any = this.prisma;
    const incident = await prisma.incident.findUnique({
      where: { id: incidentId },
    });

    if (!incident) {
      throw new NotFoundException(
        `Incidente con ID ${incidentId} no encontrado.`,
      );
    }

    return prisma.incident.update({
      where: { id: incidentId },
      data: {
        status: status,
        updates: {
          create: {
            content,
            timestamp: new Date(),
            author: 'System', // TODO: Replace with actual user
            attachments: {
              create:
                attachments?.map((url) => ({
                  url,
                  name: url.substring(url.lastIndexOf('/') + 1),
                  type: 'image/jpeg',
                  size: 0,
                })) || [],
            },
          },
        },
      },
      include: { updates: true, attachments: true },
    });
  }
}
