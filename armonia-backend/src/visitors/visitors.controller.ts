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
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import { VisitorsService } from './visitors.service.js';
import { CreateVisitorDto, UpdateVisitorDto, VisitorDto, VisitorFilterParamsDto, ScanQrCodeDto, } from '../common/dto/visitors.dto.js';

@UseGuards(JwtAuthGuard)
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  async createVisitor(
    @GetUser() user: any,
    @Body() createVisitorDto: CreateVisitorDto,
  ): Promise<VisitorDto> {
    return this.visitorsService.createVisitor(
      user.schemaName,
      createVisitorDto,
    );
  }

  @Get()
  async getVisitors(
    @GetUser() user: any,
    @Query() filters: VisitorFilterParamsDto,
  ): Promise<VisitorDto[]> {
    return this.visitorsService.getVisitors(user.schemaName, filters);
  }

  @Get(':id')
  async getVisitorById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<VisitorDto> {
    return this.visitorsService.getVisitorById(user.schemaName, +id);
  }

  @Put(':id')
  async updateVisitor(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateVisitorDto: UpdateVisitorDto,
  ): Promise<VisitorDto> {
    return this.visitorsService.updateVisitor(
      user.schemaName,
      +id,
      updateVisitorDto,
    );
  }

  @Delete(':id')
  async deleteVisitor(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.visitorsService.deleteVisitor(user.schemaName, +id);
  }

  @Post('scan-qr')
  async scanQrCode(
    @GetUser() user: any,
    @Body() scanQrCodeDto: ScanQrCodeDto,
  ): Promise<VisitorDto> {
    return this.visitorsService.scanQrCode(
      user.schemaName,
      scanQrCodeDto.qrCode,
    );
  }

  @Get('pre-registered')
  async getPreRegisteredVisitors(@GetUser() user: any): Promise<VisitorDto[]> {
    return this.visitorsService.getPreRegisteredVisitors(user.schemaName);
  }
}
