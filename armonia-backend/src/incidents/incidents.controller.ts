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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import { IncidentsService } from './incidents.service.js';
import {
  CreateIncidentDto,
  UpdateIncidentDto,
  IncidentDto,
  IncidentFilterParamsDto,
  IncidentStatus,
} from './incidents.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('incidents')
export class IncidentsController {
  constructor(private readonly incidentsService: IncidentsService) {}

  @Post()
  async createIncident(
    @GetUser() user: any,
    @Body() createIncidentDto: CreateIncidentDto,
  ): Promise<IncidentDto> {
    return this.incidentsService.createIncident(
      user.schemaName,
      createIncidentDto,
    );
  }

  @Get()
  async getIncidents(
    @GetUser() user: any,
    @Query() filters: IncidentFilterParamsDto,
  ): Promise<IncidentDto[]> {
    return this.incidentsService.getIncidents(user.schemaName, filters);
  }

  @Get(':id')
  async getIncidentById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<IncidentDto> {
    return this.incidentsService.getIncidentById(user.schemaName, +id);
  }

  @Put(':id')
  async updateIncident(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateIncidentDto: UpdateIncidentDto,
  ): Promise<IncidentDto> {
    return this.incidentsService.updateIncident(
      user.schemaName,
      +id,
      updateIncidentDto,
    );
  }

  @Delete(':id')
  async deleteIncident(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.incidentsService.deleteIncident(user.schemaName, +id);
  }

  @Post(':id/update')
  async addIncidentUpdate(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body('content') content: string,
    @Body('status') status: IncidentStatus,
    @Body('attachments') attachments?: string[],
  ): Promise<IncidentDto> {
    return this.incidentsService.addIncidentUpdate(
      user.schemaName,
      +id,
      content,
      status,
      attachments,
    );
  }

  @Post('upload-attachment')
  @UseInterceptors(FilesInterceptor('files')) // 'files' is the field name for the array of files
  async uploadAttachment(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<{ urls: string[] }> {
    // In a real application, you would upload these files to a cloud storage (e.g., S3)
    // and return their URLs. For now, we'll just return mock URLs.
    const urls = files.map(
      (file) => `http://localhost:3000/uploads/${file.originalname}`,
    );
    return { urls };
  }
}
