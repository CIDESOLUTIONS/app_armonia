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
  constructor(private prisma: PrismaService) {}

  async createProject(schemaName: string, data: CreateProjectDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.project.create({ data });
  }

  async getProjects(schemaName: string, filters: any) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.project.findMany({
      where: filters,
      orderBy: { startDate: 'desc' },
    });
  }

  async getProjectById(schemaName: string, id: string) {
    const prisma = this.prisma.getTenantDB(schemaName);
    const project = await prisma.project.findUnique({
      where: { id },
      include: { tasks: true, updates: true },
    });
    if (!project) {
      throw new NotFoundException(`Project with ID ${id} not found.`);
    }
    return project;
  }

  async updateProject(schemaName: string, id: string, data: UpdateProjectDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.project.update({
      where: { id },
      data,
    });
  }

  async createTask(
    schemaName: string,
    projectId: string,
    data: CreateProjectTaskDto,
  ) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.projectTask.create({
      data: { ...data, projectId },
    });
  }

  async updateTask(schemaName: string, id: string, data: UpdateProjectTaskDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.projectTask.update({
      where: { id },
      data,
    });
  }

  async createUpdate(
    schemaName: string,
    projectId: string,
    userId: string,
    data: CreateProjectUpdateDto,
  ) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.projectUpdate.create({
      data: { ...data, projectId, authorId: userId },
    });
  }
}