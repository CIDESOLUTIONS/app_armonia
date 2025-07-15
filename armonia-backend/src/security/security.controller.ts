import { Controller, Get, Post, Put, Delete, Body, Param, UseGuards } from '@nestjs/common';
import { SecurityService } from './security.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  DigitalLogDto,
  CreateDigitalLogDto,
  UpdateDigitalLogDto,
  CameraDto,
  CreateCameraDto,
  UpdateCameraDto,
} from '../common/dto/security.dto';

@UseGuards(JwtAuthGuard)
@Controller('security')
export class SecurityController {
  constructor(private readonly securityService: SecurityService) {}

  // DIGITAL LOGS
  @Get('digital-logs')
  async getDigitalLogs(@GetUser() user: any): Promise<DigitalLogDto[]> {
    return this.securityService.getDigitalLogs(user.schemaName);
  }

  @Post('digital-logs')
  async createDigitalLog(@GetUser() user: any, @Body() createDigitalLogDto: CreateDigitalLogDto): Promise<DigitalLogDto> {
    return this.securityService.createDigitalLog(user.schemaName, createDigitalLogDto, user.userId);
  }

  @Put('digital-logs/:id')
  async updateDigitalLog(@GetUser() user: any, @Param('id') id: string, @Body() updateDigitalLogDto: UpdateDigitalLogDto): Promise<DigitalLogDto> {
    return this.securityService.updateDigitalLog(user.schemaName, +id, updateDigitalLogDto);
  }

  @Delete('digital-logs/:id')
  async deleteDigitalLog(@GetUser() user: any, @Param('id') id: string): Promise<void> {
    return this.securityService.deleteDigitalLog(user.schemaName, +id);
  }

  // CAMERAS
  @Get('cameras')
  async getCameras(@GetUser() user: any): Promise<CameraDto[]> {
    return this.securityService.getCameras(user.schemaName);
  }

  @Post('cameras')
  async createCamera(@GetUser() user: any, @Body() createCameraDto: CreateCameraDto): Promise<CameraDto> {
    return this.securityService.createCamera(user.schemaName, createCameraDto);
  }

  @Put('cameras/:id')
  async updateCamera(@GetUser() user: any, @Param('id') id: string, @Body() updateCameraDto: UpdateCameraDto): Promise<CameraDto> {
    return this.securityService.updateCamera(user.schemaName, +id, updateCameraDto);
  }

  @Delete('cameras/:id')
  async deleteCamera(@GetUser() user: any, @Param('id') id: string): Promise<void> {
    return this.securityService.deleteCamera(user.schemaName, +id);
  }
}