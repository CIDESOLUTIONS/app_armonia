import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreateProjectDto,
  UpdateProjectDto,
  CreateProjectTaskDto,
  UpdateProjectTaskDto,
  CreateProjectUpdateDto,
} from '../common/dto/projects.dto';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async createProject(
    @GetUser() user: any,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.createProject(
      user.schemaName,
      createProjectDto,
    );
  }

  @Get()
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.RESIDENT)
  async getProjects(@GetUser() user: any, @Query() filters: any) {
    return this.projectsService.getProjects(user.schemaName, filters);
  }

  @Get(':id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.RESIDENT)
  async getProjectById(@GetUser() user: any, @Param('id') id: string) {
    return this.projectsService.getProjectById(user.schemaName, +id);
  }

  @Put(':id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async updateProject(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(
      user.schemaName,
      +id,
      updateProjectDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async deleteProject(@GetUser() user: any, @Param('id') id: string) {
    return this.projectsService.deleteProject(user.schemaName, +id);
  }

  @Post('tasks')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async createTask(
    @GetUser() user: any,
    @Body() createTaskDto: CreateProjectTaskDto,
  ) {
    return this.projectsService.createTask(user.schemaName, createTaskDto);
  }

  @Put('tasks/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async updateTask(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateTaskDto: UpdateProjectTaskDto,
  ) {
    return this.projectsService.updateTask(user.schemaName, +id, updateTaskDto);
  }

  @Delete('tasks/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async deleteTask(@GetUser() user: any, @Param('id') id: string) {
    return this.projectsService.deleteTask(user.schemaName, +id);
  }

  @Post('updates')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async addProjectUpdate(
    @GetUser() user: any,
    @Body() createProjectUpdateDto: CreateProjectUpdateDto,
  ) {
    return this.projectsService.addProjectUpdate(
      user.schemaName,
      createProjectUpdateDto,
    );
  }

  @Get(':projectId/updates')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.RESIDENT)
  async getProjectUpdates(
    @GetUser() user: any,
    @Param('projectId') projectId: string,
  ) {
    return this.projectsService.getProjectUpdates(user.schemaName, +projectId);
  }
}
