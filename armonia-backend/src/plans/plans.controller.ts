import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '@prisma/client';
import {
  CreatePlanDto,
  UpdatePlanDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from '../common/dto/plans.dto';

@UseGuards(JwtAuthGuard)
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  @Post('plan')
  @Roles(UserRole.APP_ADMIN)
  async createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.createPlan(createPlanDto);
  }

  @Get('plan')
  async getPlans(@Query() filters: any) {
    return this.plansService.getPlans(filters);
  }

  @Get('plan/:id')
  async getPlanById(@Param('id') id: string) {
    return this.plansService.getPlanById(+id);
  }

  @Put('plan/:id')
  @Roles(UserRole.APP_ADMIN)
  async updatePlan(
    @Param('id') id: string,
    @Body() updatePlanDto: UpdatePlanDto,
  ) {
    return this.plansService.updatePlan(+id, updatePlanDto);
  }

  @Delete('plan/:id')
  @Roles(UserRole.APP_ADMIN)
  async deletePlan(@Param('id') id: string) {
    return this.plansService.deletePlan(+id);
  }

  @Post('subscription')
  @Roles(UserRole.APP_ADMIN, UserRole.COMPLEX_ADMIN)
  async createSubscription(
    @Body() createSubscriptionDto: CreateSubscriptionDto,
  ) {
    return this.plansService.createSubscription(createSubscriptionDto);
  }

  @Get('subscription')
  @Roles(UserRole.APP_ADMIN, UserRole.COMPLEX_ADMIN)
  async getSubscriptions(@Query() filters: any) {
    return this.plansService.getSubscriptions(filters);
  }

  @Get('subscription/:id')
  @Roles(UserRole.APP_ADMIN, UserRole.COMPLEX_ADMIN)
  async getSubscriptionById(@Param('id') id: string) {
    return this.plansService.getSubscriptionById(+id);
  }

  @Put('subscription/:id')
  @Roles(UserRole.APP_ADMIN, UserRole.COMPLEX_ADMIN)
  async updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.plansService.updateSubscription(+id, updateSubscriptionDto);
  }

  @Delete('subscription/:id')
  @Roles(UserRole.APP_ADMIN, UserRole.COMPLEX_ADMIN)
  async deleteSubscription(@Param('id') id: string) {
    return this.plansService.deleteSubscription(+id);
  }
}
