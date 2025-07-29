import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
  CreateProjectUpdateDto,
} from '../common/dto/projects.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  createProject(@GetUser() user: any, @Body() createProjectDto: CreateProjectDto) {
    return this.projectsService.createProject(user.schemaName, createProjectDto);
  }

  @Get()
  getProjects(@GetUser() user: any, @Query() filters: any) {
    return this.projectsService.getProjects(user.schemaName, filters);
  }

  @Get(':id')
  getProjectById(@GetUser() user: any, @Param('id') id: string) {
    return this.projectsService.getProjectById(user.schemaName, +id);
  }

  @Put(':id')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  updateProject(@GetUser() user: any, @Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
    return this.projectsService.updateProject(user.schemaName, +id, updateProjectDto);
  }

  @Post(':id/tasks')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  createTask(@GetUser() user: any, @Param('id') id: string, @Body() createTaskDto: CreateProjectTaskDto) {
    return this.projectsService.createTask(user.schemaName, +id, createTaskDto);
  }

  @Put('tasks/:taskId')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  updateTask(@GetUser() user: any, @Param('taskId') taskId: string, @Body() updateTaskDto: UpdateProjectTaskDto) {
    return this.projectsService.updateTask(user.schemaName, +taskId, updateTaskDto);
  }

  @Post(':id/updates')
  createUpdate(@GetUser() user: any, @Param('id') id: string, @Body() createUpdateDto: CreateProjectUpdateDto) {
    return this.projectsService.createUpdate(user.schemaName, +id, user.userId, createUpdateDto);
  }
}