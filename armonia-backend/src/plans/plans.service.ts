import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePlanDto,
  UpdatePlanDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
} from '../common/dto/plans.dto';

@Injectable()
export class PlansService {
  constructor(private prisma: PrismaService) {}

  // Plan Management
  async createPlan(createPlanDto: CreatePlanDto) {
    const prisma = this.prisma.getTenantDB('public');
    return prisma.plan.create({ data: createPlanDto });
  }

  async findAllPlans() {
    const prisma = this.prisma.getTenantDB('public');
    return prisma.plan.findMany();
  }

  async findPlanById(id: string) {
    const prisma = this.prisma.getTenantDB('public');
    const plan = await prisma.plan.findUnique({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Plan with ID ${id} not found`);
    }
    return plan;
  }

  async updatePlan(id: string, updatePlanDto: UpdatePlanDto) {
    const prisma = this.prisma.getTenantDB('public');
    return prisma.plan.update({
      where: { id },
      data: updatePlanDto,
    });
  }

  async removePlan(id: string) {
    const prisma = this.prisma.getTenantDB('public');
    return prisma.plan.delete({ where: { id } });
  }

  // Subscription Management
  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const prisma = this.prisma.getTenantDB(createSubscriptionDto.schemaName);
    return prisma.subscription.create({ data: createSubscriptionDto });
  }

  async findSubscriptionsByComplex(complexId: string) {
    const prisma = this.prisma.getTenantDB(complexId);
    return prisma.subscription.findMany({
      where: { residentialComplexId: complexId },
      include: { plan: true },
    });
  }

  async updateSubscription(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const prisma = this.prisma.getTenantDB(updateSubscriptionDto.schemaName);
    return prisma.subscription.update({
      where: { id },
      data: updateSubscriptionDto,
    });
  }

  // Feature Access Check
  async checkFeatureAccess(
    complexId: string,
    feature: string,
  ): Promise<boolean> {
    const prisma = this.prisma.getTenantDB(complexId);
    const subscription = await prisma.subscription.findFirst({
      where: {
        residentialComplexId: complexId,
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