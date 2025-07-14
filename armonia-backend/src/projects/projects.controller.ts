import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards, Query } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Get()
  async getProjects(@GetUser() user: any, @Query() filters: any) {
    return this.projectsService.getProjects(user.schemaName, filters);
  }

  @Get(':id')
  async getProjectById(@GetUser() user: any, @Param('id') id: string) {
    return this.projectsService.getProjectById(user.schemaName, +id);
  }

  @Post()
  async createProject(@GetUser() user: any, @Body() createProjectDto: any) {
    return this.projectsService.createProject(user.schemaName, { ...createProjectDto, createdBy: user.userId });
  }

  @Put(':id')
  async updateProject(@GetUser() user: any, @Param('id') id: string, @Body() updateProjectDto: any) {
    return this.projectsService.updateProject(user.schemaName, +id, updateProjectDto);
  }

  @Delete(':id')
  async deleteProject(@GetUser() user: any, @Param('id') id: string) {
    return this.projectsService.deleteProject(user.schemaName, +id);
  }
}