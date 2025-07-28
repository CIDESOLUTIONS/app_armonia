import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import { GetUser } from '../common/decorators/user.decorator.js';
import { Roles } from '../auth/roles.decorator.js';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('metrics')
  @Roles(UserRole.ADMIN)
  async getPortfolioMetrics(@GetUser() user: any) {
    return this.portfolioService.getPortfolioMetrics(user.userId);
  }

  @Get('complexes')
  @Roles(UserRole.ADMIN)
  async getComplexMetrics(@GetUser() user: any) {
    return this.portfolioService.getComplexMetrics(user.userId);
  }

  @Get('reports/financial-summary')
  @Roles(UserRole.ADMIN)
  async getConsolidatedFinancialReport(
    @Query('startDate') startDate: string,
    @Query('endDate') endDate: string,
  ) {
    return this.portfolioService.generateConsolidatedFinancialReport(
      startDate,
      endDate,
    );
  }
}
