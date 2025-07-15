import { Controller, Post, Get, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PanicService } from './panic.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { CreatePanicAlertDto, UpdatePanicAlertDto } from '../common/dto/panic.dto';

@UseGuards(JwtAuthGuard)
@Controller('panic')
export class PanicController {
  constructor(private readonly panicService: PanicService) {}

  @Post('alert')
  async createPanicAlert(@GetUser() user: any, @Body() createPanicAlertDto: CreatePanicAlertDto) {
    return this.panicService.createPanicAlert(user.schemaName, createPanicAlertDto);
  }

  @Get('active-alerts')
  async getActivePanicAlerts(@GetUser() user: any) {
    // Solo personal de seguridad o administradores deberían acceder a esto
    return this.panicService.getActivePanicAlerts(user.schemaName);
  }

  @Put('alert/:id/status')
  async updatePanicAlertStatus(@GetUser() user: any, @Param('id') id: string, @Body() updatePanicAlertDto: UpdatePanicAlertDto) {
    // Solo personal de seguridad o administradores deberían acceder a esto
    return this.panicService.updatePanicAlertStatus(user.schemaName, +id, updatePanicAlertDto);
  }
}
