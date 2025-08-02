import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateProjectDto,
  UpdateProjectDto,
  // CreateProjectTaskDto,
  // UpdateProjectTaskDto,
  // CreateProjectUpdateDto,
} from '../common/dto/projects.dto';

@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  async createProject(schemaName: string, data: CreateProjectDto) {
    const prisma = this.prisma.getTenantDB(schemaName);
    return prisma.project.create({
      data: {
        name: data.title, // Map title from DTO to name in Prisma model
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        status: data.status,
        budget: data.budget,
        residentialComplex: { connect: { id: data.residentialComplexId } },
        createdBy: { connect: { id: data.createdById } },
      },
    });
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
      // include: { tasks: true, updates: true }, // Include tasks and updates
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
      data: {
        name: data.title,
        description: data.description,
        startDate: data.startDate ? new Date(data.startDate) : undefined,
        endDate: data.endDate ? new Date(data.endDate) : undefined,
        status: data.status,
        budget: data.budget,
      },
    });
  }

  // async createTask(
  //   schemaName: string,
  //   projectId: string,
  //   data: CreateProjectTaskDto,
  // ) {
  //   const prisma = this.prisma.getTenantDB(schemaName);
  //   return prisma.projectTask.create({
  //     data: {
  //       projectId: projectId,
  //       title: data.title,
  //       description: data.description,
  //       status: data.status,
  //       assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
  //       dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  //     },
  //   });
  // }

  // async updateTask(schemaName: string, id: string, data: UpdateProjectTaskDto) {
  //   const prisma = this.prisma.getTenantDB(schemaName);
  //   return prisma.projectTask.update({
  //     where: { id },
  //     data: {
  //       title: data.title,
  //       description: data.description,
  //       status: data.status,
  //       assignedTo: data.assignedToId ? { connect: { id: data.assignedToId } } : undefined,
  //       dueDate: data.dueDate ? new Date(data.dueDate) : undefined,
  //     },
  //   });
  // }

  // async createUpdate(
  //   schemaName: string,
  //   projectId: string,
  //   userId: string,
  //   data: CreateProjectUpdateDto,
  // ) {
  //   const prisma = this.prisma.getTenantDB(schemaName);
  //   return prisma.projectUpdate.create({
  //     data: {
  //       projectId: projectId,
  //       title: data.title,
  //       description: data.description,
  //       progress: data.progress,
  //       author: { connect: { id: userId } },
  //     },
  //   });
  // }
}
