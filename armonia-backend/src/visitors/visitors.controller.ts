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
    return this.visitorsService.getVisitorById(user.schemaName, id);
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
      id,
      updateVisitorDto,
    );
  }

  @Delete(':id')
  @UseGuards(RolesGuard([UserRole.SECURITY, UserRole.RECEPTION]))
  deleteVisitor(@GetUser() user: any, @Param('id') id: string) {
    return this.visitorsService.deleteVisitor(user.schemaName, id);
  }
}
