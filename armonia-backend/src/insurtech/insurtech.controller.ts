import { Controller, Post, Body, UseGuards, Req } from '@nestjs/common';
import { InsurtechService } from './insurtech.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';

@UseGuards(JwtAuthGuard, RolesGuard(UserRole.RESIDENT, UserRole.COMPLEX_ADMIN, UserRole.ADMIN))
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
