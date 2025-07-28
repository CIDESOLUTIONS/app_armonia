import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { InsurtechService } from './insurtech.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';

@UseGuards(
  JwtAuthGuard,
  RolesGuard([UserRole.RESIDENT, UserRole.COMPLEX_ADMIN, UserRole.ADMIN]),
)
@Controller('insurtech')
export class InsurtechController {
  constructor(private readonly insurtechService: InsurtechService) {}

  @Post('quote')
  @Roles(UserRole.RESIDENT, UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getQuote(@Req() req, @Body() data: any) {
    return this.insurtechService.getInsuranceQuote(req.user.schemaName, data);
  }

  @Post('policy')
  @Roles(UserRole.RESIDENT, UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async registerPolicy(@Req() req, @Body() data: any) {
    return this.insurtechService.registerPolicy(req.user.schemaName, data);
  }
}
