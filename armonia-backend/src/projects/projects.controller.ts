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

@UseGuards(JwtAuthGuard)
@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async createProject(
    @GetUser() user: any,
    @Body() createProjectDto: CreateProjectDto,
  ) {
    return this.projectsService.createProject(user.schemaName, {
      ...createProjectDto,
      createdById: user.userId,
    });
  }

  @Get()
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getProjects(@GetUser() user: any, @Query() filters: any) {
    return this.projectsService.getProjects(user.schemaName, filters);
  }

  @Get(':id')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async getProjectById(@GetUser() user: any, @Param('id') id: string) {
    return this.projectsService.getProjectById(user.schemaName, id);
  }

  @Put(':id')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  async updateProject(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateProjectDto: UpdateProjectDto,
  ) {
    return this.projectsService.updateProject(
      user.schemaName,
      id,
      updateProjectDto,
    );
  }

  // @Post(':projectId/tasks')
  // @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  // async createTask(
  //   @GetUser() user: any,
  //   @Param('projectId') projectId: string,
  //   @Body() createTaskDto: CreateProjectTaskDto,
  // ) {
  //   return this.projectsService.createTask(
  //     user.schemaName,
  //     projectId,
  //     createTaskDto,
  //   );
  // }

  // @Put(':projectId/tasks/:taskId')
  // @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  // async updateTask(
  //   @GetUser() user: any,
  //   @Param('taskId') taskId: string,
  //   @Body() updateTaskDto: UpdateProjectTaskDto,
  // ) {
  //   return this.projectsService.updateTask(
  //     user.schemaName,
  //     taskId,
  //     updateTaskDto,
  //   );
  // }

  // @Post(':projectId/updates')
  // @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  // async createUpdate(
  //   @GetUser() user: any,
  //   @Param('projectId') projectId: string,
  //   @Body() createUpdateDto: CreateProjectUpdateDto,
  // ) {
  //   return this.projectsService.createUpdate(
  //     user.schemaName,
  //     projectId,
  //     user.userId,
  //     createUpdateDto,
  //   );
  // }
}
