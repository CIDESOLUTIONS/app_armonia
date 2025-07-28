import {
  Controller,
  Post,
  Body,
  UseGuards,
  Req,
  Get,
  Param,
} from '@nestjs/common';
import { FintechService } from './fintech.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@UseGuards(
  JwtAuthGuard,
  RolesGuard([UserRole.RESIDENT, UserRole.COMPLEX_ADMIN, UserRole.ADMIN]),
)
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
