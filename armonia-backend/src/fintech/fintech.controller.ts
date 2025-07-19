import { Controller, Post, Body, UseGuards, Req, Get, Param } from '@nestjs/common';
import { FintechService } from './fintech.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard(UserRole.RESIDENT, UserRole.COMPLEX_ADMIN, UserRole.ADMIN))
@Controller('fintech')
export class FintechController {
  constructor(private readonly fintechService: FintechService) {}

  @Post('micro-credit/request')
  @Roles(UserRole.RESIDENT)
  async requestMicroCredit(@Req() req, @Body() data: any) {
    return this.fintechService.requestMicroCredit(req.user.schemaName, data);
  }

  @Get('credit-score/:userId')
  @Roles(UserRole.RESIDENT, UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getCreditScore(@Req() req, @Param('userId') userId: string) {
    return this.fintechService.getCreditScore(req.user.schemaName, +userId);
  }
}