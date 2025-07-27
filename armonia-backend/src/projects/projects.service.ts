import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
  CreateProjectUpdateDto,
} from '../common/dto/projects.dto';

@Injectable()
export class ProjectsService {
  constructor(
    private prisma: PrismaService,
  ) {}

  async createProject(schemaName: string, data: CreateProjectDto) {
    const prisma: any = this.prisma;
    return prisma.project.create({ data });
  }

  async getProjects(schemaName: string, filters: any = {}) {
    const prisma: any = this.prisma;
    const where: any = {};
    if (filters.status) where.status = filters.status;
    if (filters.complexId) where.complexId = filters.complexId;
    return prisma.project.findMany({
      where,
      include: { tasks: true, updates: true },
    });
  }

  async getProjectById(schemaName: string, id: number) {
    const prisma: any = this.prisma;
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true, updates: true },
    });
    if (!project) {
      throw new NotFoundException(`Proyecto con ID ${id} no encontrado.`);
    }
    return project;
  }

  async updateProject(schemaName: string, id: number, data: UpdateProjectDto) {
    const prisma: any = this.prisma;
    return prisma.project.update({ where: { id }, data });
  }

  async deleteProject(schemaName: string, id: number) {
    const prisma: any = this.prisma;
    await prisma.project.delete({ where: { id } });
    return { message: 'Proyecto eliminado correctamente' };
  }

  async createTask(schemaName: string, data: CreateProjectTaskDto) {
    const prisma: any = this.prisma;
    return prisma.projectTask.create({ data });
  }

  async updateTask(schemaName: string, id: number, data: UpdateProjectTaskDto) {
    const prisma: any = this.prisma;
    return prisma.projectTask.update({ where: { id }, data });
  }

  async deleteTask(schemaName: string, id: number) {
    const prisma: any = this.prisma;
    await prisma.projectTask.delete({ where: { id } });
    return { message: 'Tarea eliminada correctamente' };
  }

  async addProjectUpdate(schemaName: string, data: CreateProjectUpdateDto) {
    const prisma: any = this.prisma;
    return prisma.projectUpdate.create({ data });
  }

  async getProjectUpdates(schemaName: string, projectId: number) {
    const prisma: any = this.prisma;
    return prisma.projectUpdate.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }
}