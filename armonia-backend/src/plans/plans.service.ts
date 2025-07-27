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
  constructor(
    private prisma: PrismaService,
  ) {}

  async createPlan(data: CreatePlanDto) {
    const prisma = this.prisma;
    return prisma.plan.create({
      data: { ...data, features: { create: data.features } },
    });
  }

  async getPlans(filters: any = {}) {
    const prisma = this.prisma;
    const where: any = {};
    if (filters.planType) where.planType = filters.planType;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    return prisma.plan.findMany({
      where,
      include: { features: true },
    });
  }

  async getPlanById(id: number) {
    const prisma = this.prisma;
    const plan = await prisma.plan.findUnique({
      where: { id },
      include: { features: true },
    });
    if (!plan) {
      throw new NotFoundException(`Plan con ID ${id} no encontrado.`);
    }
    return plan;
  }

  async updatePlan(id: number, data: UpdatePlanDto) {
    const prisma = this.prisma;
    return prisma.plan.update({ where: { id }, data });
  }

  async deletePlan(id: number) {
    const prisma = this.prisma;
    await prisma.plan.delete({ where: { id } });
    return { message: 'Plan eliminado correctamente' };
  }

  async createSubscription(data: CreateSubscriptionDto) {
    const prisma = this.prisma;
    return prisma.subscription.create({ data });
  }

  async getSubscriptions(filters: any = {}) {
    const prisma = this.prisma;
    const where: any = {};
    if (filters.complexId) where.complexId = filters.complexId;
    if (filters.planId) where.planId = filters.planId;
    if (filters.isActive !== undefined) where.isActive = filters.isActive;
    return prisma.subscription.findMany({
      where,
      include: { plan: true, complex: true },
    });
  }

  async getSubscriptionById(id: number) {
    const prisma = this.prisma;
    const subscription = await prisma.subscription.findUnique({
      where: { id },
      include: { plan: true, complex: true },
    });
    if (!subscription) {
      throw new NotFoundException(`Suscripción con ID ${id} no encontrada.`);
    }
    return subscription;
  }

  async updateSubscription(id: number, data: UpdateSubscriptionDto) {
    const prisma = this.prisma;
    return prisma.subscription.update({ where: { id }, data });
  }

  async deleteSubscription(id: number) {
    const prisma = this.prisma;
    await prisma.subscription.delete({ where: { id } });
    return { message: 'Suscripción eliminada correctamente' };
  }

  async checkFeatureAccess(complexId: number, feature: string): Promise<boolean> {
    // Placeholder implementation: always return true for now
    console.log(`Checking feature access for complex ${complexId} and feature ${feature}`);
    return true;
  }
}