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
import { VisitorsService } from './visitors.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import {
  CreateVisitorDto,
  UpdateVisitorDto,
  VisitorFilterParamsDto,
} from '../common/dto/visitors.dto.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@UseGuards(JwtAuthGuard)
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  @UseGuards(RolesGuard([UserRole.SECURITY, UserRole.RECEPTION]))
  createVisitor(
    @GetUser() user: any,
    @Body() createVisitorDto: CreateVisitorDto,
  ) {
    return this.visitorsService.createVisitor(
      user.schemaName,
      createVisitorDto,
    );
  }

  @Get()
  getVisitors(@GetUser() user: any, @Query() filters: VisitorFilterParamsDto) {
    return this.visitorsService.getVisitors(user.schemaName, filters);
  }

  @Get('pre-registered')
  @UseGuards(RolesGuard([UserRole.SECURITY, UserRole.RECEPTION]))
  getPreRegisteredVisitors(@GetUser() user: any) {
    return this.visitorsService.getPreRegisteredVisitors(user.schemaName);
  }

  @Post('scan-qr')
  @UseGuards(RolesGuard([UserRole.SECURITY, UserRole.RECEPTION]))
  scanQrCode(@GetUser() user: any, @Body('qrCode') qrCode: string) {
    return this.visitorsService.scanQrCode(user.schemaName, qrCode);
  }

  @Get(':id')
  getVisitorById(@GetUser() user: any, @Param('id') id: string) {
    return this.visitorsService.getVisitorById(user.schemaName, +id);
  }

  @Put(':id')
  @UseGuards(RolesGuard([UserRole.SECURITY, UserRole.RECEPTION]))
  updateVisitor(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateVisitorDto: UpdateVisitorDto,
  ) {
    return this.visitorsService.updateVisitor(
      user.schemaName,
      +id,
      updateVisitorDto,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard([UserRole.SECURITY, UserRole.RECEPTION]))
  deleteVisitor(@GetUser() user: any, @Param('id') id: string) {
    return this.visitorsService.deleteVisitor(user.schemaName, +id);
  }
}
