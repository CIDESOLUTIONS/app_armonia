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

  // Subscription Management (Updated to use ResidentialComplex directly)
  async createSubscription(createSubscriptionDto: CreateSubscriptionDto) {
    const prisma = this.prisma.getTenantDB('public'); // Always use public schema for ResidentialComplex
    // Update the residential complex to associate it with a plan
    const updatedComplex = await prisma.residentialComplex.update({
      where: { id: createSubscriptionDto.residentialComplexId },
      data: {
        plan: { connect: { id: createSubscriptionDto.planId } },
      },
    });
    // Return a simplified DTO or the updated complex itself
    return updatedComplex; // You might want to map this to a more specific DTO
  }

  async findSubscriptionsByComplex(residentialComplexId: string) {
    const prisma = this.prisma.getTenantDB('public'); // Always use public schema for ResidentialComplex
    const complex = await prisma.residentialComplex.findUnique({
      where: { id: residentialComplexId },
      include: { plan: true },
    });

    if (!complex) {
      throw new NotFoundException(
        `Residential Complex with ID ${residentialComplexId} not found.`,
      );
    }

    // Return the complex with its plan details, or map to a simplified DTO
    return complex; // You might want to map this to a more appropriate DTO
  }

  async updateSubscription(
    id: string, // This ID would refer to the ResidentialComplex ID now
    updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    const prisma = this.prisma.getTenantDB('public'); // Always use public schema for ResidentialComplex
    const updatedComplex = await prisma.residentialComplex.update({
      where: { id: updateSubscriptionDto.residentialComplexId }, // Use residentialComplexId from DTO
      data: {
        ...(updateSubscriptionDto.planId && {
          plan: { connect: { id: updateSubscriptionDto.planId } },
        }),
      },
    });
    return updatedComplex; // You might want to map this to a more appropriate DTO
  }

  // Feature Access Check
  async checkFeatureAccess(
    residentialComplexId: string,
    feature: string,
  ): Promise<boolean> {
    const prisma = this.prisma.getTenantDB('public'); // Always use public schema for ResidentialComplex
    const complex = await prisma.residentialComplex.findUnique({
      where: { id: residentialComplexId },
      include: {
        plan: {
          select: {
            features: true,
          },
        },
      },
    });

    if (!complex || !complex.plan) {
      return false; // No associated plan
    }

    return complex.plan.features.includes(feature);
  }
}
