import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { AppAdminService } from './app-admin.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
@Controller('app-admin')
export class AppAdminController {
  constructor(private readonly appAdminService: AppAdminService) {}

  @Get('metrics')
  async getOperativeMetrics(@GetUser() user: any) {
    return this.appAdminService.getOperativeMetrics();
  }

  @Get('complex-metrics')
  async getComplexMetrics() {
    return this.appAdminService.getComplexMetrics();
  }

  @Get('financial-summary')
  async getFinancialSummary(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.appAdminService.getFinancialSummary(startDate, endDate);
  }
}
