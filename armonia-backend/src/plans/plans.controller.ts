import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  PlanDto,
  SubscriptionDto,
  SubscribeToPlanDto,
  PlanType,
} from '../common/dto/plans.dto';

@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Get()
  async getAvailablePlans(): Promise<PlanDto[]> {
    return this.plansService.getAvailablePlans();
  }

  @Post('subscribe')
  async subscribeToPlan(
    @GetUser() user: any,
    @Body() subscribeDto: SubscribeToPlanDto,
  ): Promise<SubscriptionDto> {
    return this.plansService.createSubscription(
      user.complexId,
      subscribeDto.planType,
      subscribeDto.amount,
      subscribeDto.currency,
    );
  }

  @Put('complex/:complexId/update-plan')
  async updateComplexPlan(
    @Param('complexId') complexId: string,
    @Body('newPlanType') newPlanType: PlanType,
  ) {
    return this.plansService.updateComplexPlan(+complexId, newPlanType);
  }

  @Get('complex/:complexId/subscription')
  async getComplexSubscription(
    @Param('complexId') complexId: string,
  ): Promise<SubscriptionDto | null> {
    return this.plansService.getComplexSubscription(+complexId);
  }

  @Get('check-feature/:featureName')
  async checkFeatureAccess(
    @GetUser() user: any,
    @Param('featureName') featureName: string,
  ): Promise<boolean> {
    return this.plansService.checkFeatureAccess(user.complexId, featureName);
  }
}
