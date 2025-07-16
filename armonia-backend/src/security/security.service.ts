import { Injectable } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  DigitalLogDto,
  CreateDigitalLogDto,
  UpdateDigitalLogDto,
  CameraDto,
  CreateCameraDto,
  UpdateCameraDto,
} from '../common/dto/security.dto';

@Injectable()
export class SecurityService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  // DIGITAL LOGS
  async getDigitalLogs(schemaName: string): Promise<DigitalLogDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const logs = await prisma.digitalLog.findMany({
        include: {
          createdBy: { select: { name: true } },
        },
      });
      return logs.map((log) => ({
        ...log,
        createdByName: log.createdBy?.name || 'N/A',
      }));
    } catch (error) {
      console.error('Error fetching digital logs:', error);
      throw new Error('Error fetching digital logs');
    }
  }

  async createDigitalLog(
    schemaName: string,
    data: CreateDigitalLogDto,
    createdById: number,
  ): Promise<DigitalLogDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const log = await prisma.digitalLog.create({
        data: {
          ...data,
          createdBy: { connect: { id: createdById } },
        },
      });
      const createdLogWithUser = await prisma.digitalLog.findUnique({
        where: { id: log.id },
        include: { createdBy: { select: { name: true } } },
      });
      return {
        ...createdLogWithUser,
        createdByName: createdLogWithUser.createdBy?.name || 'N/A',
      };
    } catch (error) {
      console.error('Error creating digital log:', error);
      throw new Error('Error creating digital log');
    }
  }

  async updateDigitalLog(
    schemaName: string,
    id: number,
    data: UpdateDigitalLogDto,
  ): Promise<DigitalLogDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const log = await prisma.digitalLog.update({
        where: { id },
        data,
      });
      const updatedLogWithUser = await prisma.digitalLog.findUnique({
        where: { id: log.id },
        include: { createdBy: { select: { name: true } } },
      });
      return {
        ...updatedLogWithUser,
        createdByName: updatedLogWithUser.createdBy?.name || 'N/A',
      };
    } catch (error) {
      console.error('Error updating digital log:', error);
      throw new Error('Error updating digital log');
    }
  }

  async deleteDigitalLog(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      await prisma.digitalLog.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting digital log:', error);
      throw new Error('Error deleting digital log');
    }
  }

  // CAMERAS
  async getCameras(schemaName: string): Promise<CameraDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.camera.findMany();
    } catch (error) {
      console.error('Error fetching cameras:', error);
      throw new Error('Error fetching cameras');
    }
  }

  async createCamera(
    schemaName: string,
    data: CreateCameraDto,
  ): Promise<CameraDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.camera.create({ data });
    } catch (error) {
      console.error('Error creating camera:', error);
      throw new Error('Error creating camera');
    }
  }

  async updateCamera(
    schemaName: string,
    id: number,
    data: UpdateCameraDto,
  ): Promise<CameraDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      return await prisma.camera.update({ where: { id }, data });
    } catch (error) {
      console.error('Error updating camera:', error);
      throw new Error('Error updating camera');
    }
  }

  async deleteCamera(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      await prisma.camera.delete({ where: { id } });
    } catch (error) {
      console.error('Error deleting camera:', error);
      throw new Error('Error deleting camera');
    }
  }
}
