import { Injectable } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';

interface DigitalLog {
  id: number;
  title: string;
  content: string;
  logDate: string;
  createdBy: number;
  createdByName: string;
}

interface CreateDigitalLogData {
  title: string;
  content: string;
  logDate: string;
}

interface UpdateDigitalLogData {
  id: number;
  title?: string;
  content?: string;
  logDate?: string;
}

interface Camera {
  id: number;
  name: string;
  ipAddress: string;
  port: number;
  username?: string;
  password?: string;
  location: string;
  isActive: boolean;
}

interface CreateCameraData {
  name: string;
  ipAddress: string;
  port?: number;
  username?: string;
  password?: string;
  location: string;
  isActive?: boolean;
}

interface UpdateCameraData {
  id: number;
  name?: string;
  ipAddress?: string;
  port?: number;
  username?: string;
  password?: string;
  location?: string;
  isActive?: boolean;
}

@Injectable()
export class SecurityService {
  constructor(private prismaClientManager: PrismaClientManager) {}

  private getPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  // DIGITAL LOGS
  async getDigitalLogs(schemaName: string): Promise<DigitalLog[]> {
    const prisma = this.getPrismaClient(schemaName);
    try {
      const logs = await prisma.digitalLog.findMany({
        include: {
          createdBy: { select: { name: true } },
        },
      });
      return logs.map(log => ({
        ...log,
        createdByName: log.createdBy?.name || 'N/A',
      }));
    } catch (error) {
      console.error("Error fetching digital logs:", error);
      throw new Error("Error fetching digital logs");
    }
  }

  async createDigitalLog(schemaName: string, data: CreateDigitalLogData, createdById: number): Promise<DigitalLog> {
    const prisma = this.getPrismaClient(schemaName);
    try {
      const log = await prisma.digitalLog.create({
        data: {
          ...data,
          createdBy: { connect: { id: createdById } },
        },
      });
      return this.getDigitalLogs(schemaName).then(logs => logs.find(l => l.id === log.id));
    } catch (error) {
      console.error("Error creating digital log:", error);
      throw new Error("Error creating digital log");
    }
  }

  async updateDigitalLog(schemaName: string, id: number, data: UpdateDigitalLogData): Promise<DigitalLog> {
    const prisma = this.getPrismaClient(schemaName);
    try {
      const log = await prisma.digitalLog.update({
        where: { id },
        data,
      });
      return this.getDigitalLogs(schemaName).then(logs => logs.find(l => l.id === log.id));
    } catch (error) {
      console.error("Error updating digital log:", error);
      throw new Error("Error updating digital log");
    }
  }

  async deleteDigitalLog(schemaName: string, id: number): Promise<void> {
    const prisma = this.getPrismaClient(schemaName);
    try {
      await prisma.digitalLog.delete({ where: { id } });
    } catch (error) {
      console.error("Error deleting digital log:", error);
      throw new Error("Error deleting digital log");
    }
  }

  // CAMERAS
  async getCameras(schemaName: string): Promise<Camera[]> {
    const prisma = this.getPrismaClient(schemaName);
    try {
      return await prisma.camera.findMany();
    } catch (error) {
      console.error("Error fetching cameras:", error);
      throw new Error("Error fetching cameras");
    }
  }

  async createCamera(schemaName: string, data: CreateCameraData): Promise<Camera> {
    const prisma = this.getPrismaClient(schemaName);
    try {
      return await prisma.camera.create({ data });
    } catch (error) {
      console.error("Error creating camera:", error);
      throw new Error("Error creating camera");
    }
  }

  async updateCamera(schemaName: string, id: number, data: UpdateCameraData): Promise<Camera> {
    const prisma = this.getPrismaClient(schemaName);
    try {
      return await prisma.camera.update({ where: { id }, data });
    } catch (error) {
      console.error("Error updating camera:", error);
      throw new Error("Error updating camera");
    }
  }

  async deleteCamera(schemaName: string, id: number): Promise<void> {
    const prisma = this.getPrismaClient(schemaName);
    try {
      await prisma.camera.delete({ where: { id } });
    } catch (error) {
      console.error("Error deleting camera:", error);
      throw new Error("Error deleting camera");
    }
  }
}