import { Controller, Get, UseGuards } from '@nestjs/common';
import { PortfolioService } from './portfolio.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('portfolio')
export class PortfolioController {
  constructor(private readonly portfolioService: PortfolioService) {}

  @Get('metrics')
  async getPortfolioMetrics(@GetUser() user: any) {
    // Aquí se debería verificar que el usuario tenga el rol de "EMPRESARIAL"
    return this.portfolioService.getPortfolioMetrics(user.userId);
  }

  @Get('complexes')
  async getComplexMetrics(@GetUser() user: any) {
    // Aquí se debería verificar que el usuario tenga el rol de "EMPRESARIAL"
    return this.portfolioService.getComplexMetrics(user.userId);
  }
}
