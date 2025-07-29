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
import { PlansService } from './plans.service.js';
import { JwtAuthGuard } from '../auth/jwt-auth.guard.js';
import { RolesGuard } from '../auth/roles.guard.js';
import { Roles } from '../auth/roles.decorator.js';
import { UserRole } from '../common/enums/user-role.enum.js';
import {
  CreatePlanDto,
  UpdatePlanDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from '../common/dto/plans.dto.js';

@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // Plan Management
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.createPlan(createPlanDto);
  }

  @Get()
  findAllPlans() {
    return this.plansService.findAllPlans();
  }

  @Get(':id')
  findPlanById(@Param('id') id: string) {
    return this.plansService.findPlanById(+id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  updatePlan(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.updatePlan(+id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  removePlan(@Param('id') id: string) {
    return this.plansService.removePlan(+id);
  }

  // Subscription Management
  @Post('subscriptions')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.plansService.createSubscription(createSubscriptionDto);
  }

  @Get('subscriptions/:complexId')
  findSubscriptionsByComplex(@Param('complexId') complexId: string) {
    return this.plansService.findSubscriptionsByComplex(+complexId);
  }

  @Put('subscriptions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.plansService.updateSubscription(+id, updateSubscriptionDto);
  }
}
