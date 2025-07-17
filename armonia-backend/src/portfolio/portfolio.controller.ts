import { Controller, Get, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard, RolesGuard(UserRole.APP_ADMIN))
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
}
