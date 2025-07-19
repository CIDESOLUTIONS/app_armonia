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
import { PanicService } from './panic.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreatePanicAlertDto,
  UpdatePanicAlertDto,
  CreatePanicResponseDto,
} from '../common/dto/panic.dto';

@UseGuards(JwtAuthGuard)
@Controller('panic')
export class PanicController {
  constructor(private readonly panicService: PanicService) {}

  @Post('alert')
  @Roles(UserRole.RESIDENT)
  async createPanicAlert(
    @GetUser() user: any,
    @Body() createPanicAlertDto: CreatePanicAlertDto,
  ) {
    return this.panicService.createPanicAlert(
      user.schemaName,
      createPanicAlertDto,
    );
  }

  @Get('alert')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  async getPanicAlerts(@GetUser() user: any, @Query() filters: any) {
    return this.panicService.getPanicAlerts(user.schemaName, filters);
  }

  @Get('alert/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  async getPanicAlertById(@GetUser() user: any, @Param('id') id: string) {
    return this.panicService.getPanicAlertById(user.schemaName, +id);
  }

  @Put('alert/:id')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  async updatePanicAlert(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePanicAlertDto: UpdatePanicAlertDto,
  ) {
    return this.panicService.updatePanicAlert(
      user.schemaName,
      +id,
      updatePanicAlertDto,
    );
  }

  @Post('response')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  async addPanicResponse(
    @GetUser() user: any,
    @Body() createPanicResponseDto: CreatePanicResponseDto,
  ) {
    return this.panicService.addPanicResponse(
      user.schemaName,
      createPanicResponseDto,
    );
  }

  @Get('response/:alertId')
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN, UserRole.STAFF)
  async getPanicResponses(
    @GetUser() user: any,
    @Param('alertId') alertId: string,
  ) {
    return this.panicService.getPanicResponses(user.schemaName, +alertId);
  }
}
