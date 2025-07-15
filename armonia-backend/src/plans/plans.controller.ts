import { Controller, Get, Post, Put, Body, Param, UseGuards } from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';

@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async getAvailablePlans() {
    return this.plansService.getAvailablePlans();
  }

  @Post('subscribe')
  async subscribeToPlan(@GetUser() user: any, @Body() subscribeDto: any) {
    // En un escenario real, aquí se validaría el pago y se obtendría el monto y la moneda
    return this.plansService.createSubscription(user.complexId, subscribeDto.planType, subscribeDto.amount, subscribeDto.currency);
  }

  @Put('complex/:complexId/update-plan')
  async updateComplexPlan(@Param('complexId') complexId: string, @Body('newPlanType') newPlanType: string) {
    return this.plansService.updateComplexPlan(+complexId, newPlanType as any);
  }

  @Get('complex/:complexId/subscription')
  async getComplexSubscription(@Param('complexId') complexId: string) {
    return this.plansService.getComplexSubscription(+complexId);
  }

  @Get('check-feature/:featureName')
  async checkFeatureAccess(@GetUser() user: any, @Param('featureName') featureName: string) {
    return this.plansService.checkFeatureAccess(user.complexId, featureName);
  }
}