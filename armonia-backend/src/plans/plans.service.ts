import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service.js';
import {
  CreatePlanDto,
  UpdatePlanDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from '../common/dto/plans.dto.js';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  // Plan Management
  async createPlan(createPlanDto: CreatePlanDto) {
    return this.prisma.plan.create({ data: createPlanDto });
  }

  async findAllPlans() {
    return this.prisma.plan.findMany();
  }

  async findPlanById(id: number) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async updatePlan(id: number, updatePlanDto: UpdatePlanDto) {
    return this.prisma.plan.update({
      where: { id },
      data: updatePlanDto,
    });
  }

  async removePlan(id: number) {
    return this.prisma.plan.delete({ where: { id } });
  }

  // Subscription Management
  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    return this.prisma.subscription.create({ data: createSubscriptionDto });
  }

  async findSubscriptionsByComplex(complexId: number) {
    return this.prisma.subscription.findMany({
      where: { complexId },
      include: { plan: true },
    });
  }

  async updateSubscription(
    id: number,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.prisma.subscription.update({
      where: { id },
      data: updateSubscriptionDto,
    });
  }

  // Feature Access Check
  async checkFeatureAccess(
    complexId: number,
    feature: string,
  ): Promise<boolean> {
    const subscription = await this.prisma.subscription.findFirst({
      where: {
        complexId,
        isActive: true,
      },
      include: {
        plan: {
          select: {
            features: true,
          },
        },
      },
    });

    if (!subscription || !subscription.plan) {
      return false; // No active subscription or plan
    }

    return subscription.plan.features.includes(feature);
  }
}
