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
import { UserRole } from '../common/enums/user-role.enum';
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
  @UseGuards(RolesGuard([UserRole.RESIDENT]))
  async createAlert(
    @GetUser() user: any,
    @Body() createPanicAlertDto: CreatePanicAlertDto,
  ) {
    return this.panicService.createAlert(user.schemaName, {
      ...createPanicAlertDto,
      userId: user.userId,
    });
  }

  @Get('alerts')
  @UseGuards(
    RolesGuard([UserRole.SECURITY, UserRole.ADMIN, UserRole.COMPLEX_ADMIN]),
  )
  async getAlerts(@GetUser() user: any, @Query() filters: any) {
    return this.panicService.getAlerts(user.schemaName, filters);
  }

  @Get('alerts/:id')
  @UseGuards(
    RolesGuard([UserRole.SECURITY, UserRole.ADMIN, UserRole.COMPLEX_ADMIN]),
  )
  async getAlertById(@GetUser() user: any, @Param('id') id: string) {
    return this.panicService.getAlertById(user.schemaName, +id);
  }

  @Put('alerts/:id')
  @UseGuards(
    RolesGuard([UserRole.SECURITY, UserRole.ADMIN, UserRole.COMPLEX_ADMIN]),
  )
  async updateAlert(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updatePanicAlertDto: UpdatePanicAlertDto,
  ) {
    return this.panicService.updateAlert(
      user.schemaName,
      +id,
      updatePanicAlertDto,
    );
  }

  @Post('responses')
  @UseGuards(RolesGuard([UserRole.SECURITY]))
  async createResponse(
    @GetUser() user: any,
    @Body() createPanicResponseDto: CreatePanicResponseDto,
  ) {
    return this.panicService.createResponse(user.schemaName, {
      ...createPanicResponseDto,
      respondedBy: user.userId,
    });
  }
}
