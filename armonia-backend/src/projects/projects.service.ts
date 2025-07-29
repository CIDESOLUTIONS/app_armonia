import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import { CreateProjectDto, UpdateProjectDto, CreateProjectTaskDto, UpdateProjectTaskDto, CreateProjectUpdateDto } from '../common/dto/projects.dto.js';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(schemaName: string, data: CreateProjectDto) {
    const prisma = this.prisma;
    return prisma.project.create({ data });
  }

  async getProjects(schemaName: string, filters: any) {
    const prisma = this.prisma;
    return prisma.project.findMany({
      where: filters,
      orderBy: { startDate: 'desc' },
    });
  }

  async getProjectById(schemaName: string, id: number) {
    const prisma = this.prisma;
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true, updates: true },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return project;
  }

  async updateProject(schemaName: string, id: number, data: UpdateProjectDto) {
    const prisma = this.prisma;
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async createTask(schemaName: string, projectId: number, data: CreateProjectTaskDto) {
    const prisma = this.prisma;
    return prisma.projectTask.create({
      data: { ...data, projectId },
    });
  }

  async updateTask(schemaName: string, id: number, data: UpdateProjectTaskDto) {
    const prisma = this.prisma;
    return prisma.projectTask.update({
      where: { id },
      data,
    });
  }

  async createUpdate(schemaName: string, projectId: number, userId: number, data: CreateProjectUpdateDto) {
    const prisma = this.prisma;
    return prisma.projectUpdate.create({
      data: { ...data, projectId, authorId: userId },
    });
  }
}
