import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { PortfolioService } from './portfolio.service';

@ApiTags('Portfolio')
@Controller('portfolio')
@UseGuards(JwtAuthGuard)
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('metrics')
  @ApiOperation({ summary: 'Get consolidated portfolio metrics' })
  @ApiResponse({ status: 200, description: 'Consolidated metrics for the portfolio manager.' })
  async getPortfolioMetrics(@GetUser() user: any) {
    // This will be implemented in the service
    return this.portfolioService.getConsolidatedMetrics(user.id);
  }

  @Get('complex-metrics')
  @ApiOperation({ summary: 'Get metrics for each complex in the portfolio' })
  @ApiResponse({ status: 200, description: 'A list of metrics for each complex.' })
  async getComplexMetrics(@GetUser() user: any) {
    // This will be implemented in the service
    return this.portfolioService.getMetricsByComplex(user.id);
  }
}