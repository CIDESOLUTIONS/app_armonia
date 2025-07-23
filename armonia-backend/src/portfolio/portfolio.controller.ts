import { Controller, Get, UseGuards, Query } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import { GetUser } from '../common/decorators/user.decorator';
import { Roles } from '../auth/roles.decorator';

@UseGuards(JwtAuthGuard, RolesGuard([UserRole.APP_ADMIN]))
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('metrics')
  @Roles(UserRole.APP_ADMIN)
  async getPortfolioMetrics(@GetUser() user: any) {
    return this.portfolioService.getPortfolioMetrics(user.userId);
  }

  @Get('complexes')
  @Roles(UserRole.APP_ADMIN)
  async getComplexMetrics(@GetUser() user: any) {
    return this.portfolioService.getComplexMetrics(user.userId);
  }

  @Get('reports/financial-summary')
  @Roles(UserRole.APP_ADMIN)
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
