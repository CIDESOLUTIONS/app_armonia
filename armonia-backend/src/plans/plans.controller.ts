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
import { UserRole } from '../common/enums/user-role.enum';
import {
  CreatePlanDto,
  UpdatePlanDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from '../common/dto/plans.dto';

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
    return this.plansService.findPlanById(id);
  }

  @Put(':id')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  updatePlan(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.updatePlan(id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  removePlan(@Param('id') id: string) {
    return this.plansService.removePlan(id);
  }

  // Subscription Management
  @Post('subscriptions')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.plansService.createSubscription(createSubscriptionDto);
  }

  @Get('subscriptions/:complexId')
  findSubscriptionsByComplex(@Param('complexId') residentialComplexId: string) {
    return this.plansService.findSubscriptionsByComplex(residentialComplexId);
  }

  @Put('subscriptions/:id')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.plansService.updateSubscription(id, updateSubscriptionDto);
  }
}
