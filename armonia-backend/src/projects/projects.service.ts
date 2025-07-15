import { Injectable } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service'; // Importar PrismaService

interface Project {
  id: number;
  name: string;
  description?: string;
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startDate: string;
  endDate?: string;
  assignedToId?: number;
  assignedToName?: string;
  createdBy: number;
  createdByName: string;
  createdAt: string;
  updatedAt: string;
}

interface GetProjectsParams {
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  search?: string;
}

interface CreateProjectData {
  name: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startDate: string;
  endDate?: string;
  assignedToId?: number;
  createdBy: number;
}

interface UpdateProjectData {
  id: number;
  name?: string;
  description?: string;
  status?: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  startDate?: string;
  endDate?: string;
  assignedToId?: number;
}

@Injectable()
export class ProjectsService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService, // Inyectar PrismaService
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async getProjects(schemaName: string, params?: GetProjectsParams): Promise<Project[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const where: any = {};
      if (params?.status) where.status = params.status;
      if (params?.search) {
        where.OR = [
          { name: { contains: params.search, mode: 'insensitive' } },
          { description: { contains: params.search, mode: 'insensitive' } },
        ];
      }
      const projects = await prisma.project.findMany({
        where,
        include: {
          assignedTo: { select: { name: true } }, // Usar el modelo User del esquema del tenant
          createdBy: { select: { name: true } }, // Usar el modelo User del esquema del tenant
        },
      });
      return projects.map(project => ({
        ...project,
        assignedToName: project.assignedTo?.name || 'N/A',
        createdByName: project.createdBy?.name || 'N/A',
      }));
    } catch (error) {
      console.error("Error fetching projects:", error);
      throw new Error("Error fetching projects");
    }
  }

  async getProjectById(schemaName: string, id: number): Promise<Project> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const project = await prisma.project.findUnique({
        where: { id },
        include: {
          assignedTo: { select: { name: true } }, // Usar el modelo User del esquema del tenant
          createdBy: { select: { name: true } }, // Usar el modelo User del esquema del tenant
        },
      });
      if (!project) {
        throw new Error("Proyecto no encontrado");
      }
      return {
        ...project,
        assignedToName: project.assignedTo?.name || 'N/A',
        createdByName: project.createdBy?.name || 'N/A',
      };
    } catch (error) {
      console.error(`Error fetching project with ID ${id}:`, error);
      throw new Error("Error fetching project");
    }
  }

  async createProject(schemaName: string, data: CreateProjectData): Promise<Project> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const project = await prisma.project.create({ data });
      return this.getProjectById(schemaName, project.id);
    } catch (error) {
      console.error("Error creating project:", error);
      throw new Error("Error creating project");
    }
  }

  async updateProject(schemaName: string, id: number, data: Partial<UpdateProjectData>): Promise<Project> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      const project = await prisma.project.update({ where: { id }, data });
      return this.getProjectById(schemaName, project.id);
    } catch (error) {
      console.error("Error updating project:", error);
      throw new Error("Error updating project");
    }
  }

  async deleteProject(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    try {
      await prisma.project.delete({ where: { id } });
    } catch (error) {
      console.error("Error deleting project:", error);
      throw new Error("Error deleting project");
    }
  }
}
