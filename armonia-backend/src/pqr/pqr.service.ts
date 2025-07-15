import { Injectable } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service'; // Importar PrismaService

interface PQR {
  id: number;
  subject: string;
  description: string;
  status: "OPEN" | "IN_PROGRESS" | "CLOSED" | "REJECTED";
  priority: "LOW" | "MEDIUM" | "HIGH";
  category: string;
  reportedById: number;
  reportedByName: string;
  assignedToId?: number;
  assignedToName?: string;
  createdAt: string;
  updatedAt: string;
  comments: PQRComment[];
}

interface PQRComment {
  id: number;
  pqrId: number;
  authorId: number;
  authorName: string;
  comment: string;
  createdAt: string;
}

interface GetPQRParams {
  status?: "OPEN" | "IN_PROGRESS" | "CLOSED" | "REJECTED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  search?: string;
}

interface CreatePQRData {
  subject: string;
  description: string;
  category: string;
  priority?: "LOW" | "MEDIUM" | "HIGH";
  reportedById: number;
}

interface UpdatePQRData {
  id: number;
  subject?: string;
  description?: string;
  status?: "OPEN" | "IN_PROGRESS" | "CLOSED" | "REJECTED";
  priority?: "LOW" | "MEDIUM" | "HIGH";
  category?: string;
  assignedToId?: number;
}

@Injectable()
export class PqrService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService, // Inyectar PrismaService
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async getPQRs(schemaName: string, params?: GetPQRParams): Promise<PQR[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const where: any = {};
      if (params?.status) where.status = params.status;
      if (params?.priority) where.priority = params.priority;
      if (params?.search) {
        where.OR = [
          { subject: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ];
      }
      const pqrs = await prisma.pQR.findMany({
        where,
        include: {
          reportedBy: { select: { name: true } }, // Usar el modelo User del esquema del tenant
          assignedTo: { select: { name: true } }, // Usar el modelo User del esquema del tenant
        },
      });
      return pqrs.map(pqr => ({
        ...pqr,
        reportedByName: pqr.reportedBy?.name || 'N/A',
        assignedToName: pqr.assignedTo?.name || 'N/A',
      }));
    } catch (error) {
      console.error("Error fetching PQRs:", error);
      throw new Error("Error fetching PQRs");
    }
  }

  async getPQRById(schemaName: string, id: number): Promise<PQR> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const pqr = await prisma.pQR.findUnique({
        where: { id },
        include: {
          reportedBy: { select: { name: true } }, // Usar el modelo User del esquema del tenant
          assignedTo: { select: { name: true } }, // Usar el modelo User del esquema del tenant
          comments: { include: { author: { select: { name: true } } } }, // Usar el modelo User del esquema del tenant
        },
      });
      if (!pqr) {
        throw new Error("PQR no encontrada");
      }
      return {
        ...pqr,
        reportedByName: pqr.reportedBy?.name || 'N/A',
        assignedToName: pqr.assignedTo?.name || 'N/A',
        comments: pqr.comments.map(comment => ({
          ...comment,
          authorName: comment.author?.name || 'N/A',
        })),
      };
    } catch (error) {
      console.error(`Error fetching PQR with ID ${id}:`, error);
      throw new Error("Error fetching PQR");
    }
  }

  async createPQR(schemaName: string, data: CreatePQRData): Promise<PQR> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const pqr = await prisma.pQR.create({ data });
      return this.getPQRById(schemaName, pqr.id);
    } catch (error) {
      console.error("Error creating PQR:", error);
      throw new Error("Error creating PQR");
    }
  }

  async updatePQR(schemaName: string, id: number, data: Partial<UpdatePQRData>): Promise<PQR> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const pqr = await prisma.pQR.update({ where: { id }, data });
      return this.getPQRById(schemaName, pqr.id);
    } catch (error) {
      console.error("Error updating PQR:", error);
      throw new Error("Error updating PQR");
    }
  }

  async deletePQR(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      await prisma.pQR.delete({ where: { id } });
    } catch (error) {
      console.error("Error deleting PQR:", error);
      throw new Error("Error deleting PQR");
    }
  }

  async addPQRComment(schemaName: string, pqrId: number, comment: string, authorId: number): Promise<PQRComment> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const pqrComment = await prisma.pQRComment.create({
        data: { pqrId, comment, authorId },
        include: { author: { select: { name: true } } }, // Usar el modelo User del esquema del tenant
      });
      return { ...pqrComment, authorName: pqrComment.author?.name || 'N/A' };
    } catch (error) {
      console.error("Error adding PQR comment:", error);
      throw new Error("Error adding PQR comment");
    }
  }

  async assignPQR(schemaName: string, pqrId: number, assignedToId: number): Promise<PQR> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const pqr = await prisma.pQR.update({ where: { id: pqrId }, data: { assignedToId } });
      return this.getPQRById(schemaName, pqr.id);
    } catch (error) {
      console.error("Error assigning PQR:", error);
      throw new Error("Error assigning PQR");
    }
  }
}
