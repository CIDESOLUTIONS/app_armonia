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
import { VisitorsService } from './visitors.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '@armonia-backend/common/decorators/user.decorator';
import {
  CreateVisitorDto,
  UpdateVisitorDto,
  VisitorFilterParamsDto,
} from '@armonia-backend/common/dto/visitors.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('visitors')
export class VisitorsController {
  constructor(private readonly visitorsService: VisitorsService) {}

  @Post()
  @Roles(UserRole.GUARD, UserRole.STAFF)
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
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.STAFF)
  getVisitors(@GetUser() user: any, @Query() filters: VisitorFilterParamsDto) {
    return this.visitorsService.getVisitors(user.schemaName, filters);
  }

  @Get('pre-registered')
  @Roles(UserRole.GUARD, UserRole.STAFF)
  getPreRegisteredVisitors(@GetUser() user: any) {
    return this.visitorsService.getPreRegisteredVisitors(user.schemaName);
  }

  @Post('scan-qr')
  @Roles(UserRole.GUARD, UserRole.STAFF)
  scanQrCode(@GetUser() user: any, @Body('qrCode') qrCode: string) {
    return this.visitorsService.scanQrCode(user.schemaName, qrCode);
  }

  @Get(':id')
  @Roles(UserRole.ADMIN, UserRole.GUARD, UserRole.STAFF)
  getVisitorById(@GetUser() user: any, @Param('id') id: string) {
    return this.visitorsService.getVisitorById(user.schemaName, id);
  }

  @Put(':id')
  @Roles(UserRole.GUARD, UserRole.STAFF)
  updateVisitor(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateVisitorDto: UpdateVisitorDto,
  ) {
    return this.visitorsService.updateVisitor(
      user.schemaName,
      id,
      updateVisitorDto,
    );
  }

  @Delete(':id')
  @Roles(UserRole.GUARD, UserRole.STAFF)
  deleteVisitor(@GetUser() user: any, @Param('id') id: string) {
    return this.visitorsService.deleteVisitor(user.schemaName, id);
  }
}
