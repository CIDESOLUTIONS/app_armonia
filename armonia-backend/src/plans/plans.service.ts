import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';

enum PlanType {
  BASIC = "BASIC",
  STANDARD = "STANDARD",
  PREMIUM = "PREMIUM",
  ENTERPRISE = "ENTERPRISE", // Nuevo plan
}

interface Plan {
  code: PlanType;
  name: string;
  description: string;
  priceMonthly: number;
  maxUnits: number;
  features: string[];
}

interface Subscription {
  id: number;
  complexId: number;
  planType: PlanType;
  startDate: Date;
  endDate?: Date;
  isActive: boolean;
  amount: number;
  currency: string;
}

@Injectable()
export class PlansService {
  constructor(
    private prisma: PrismaService,
    private prismaClientManager: PrismaClientManager,
  ) {}

  private getPublicPrismaClient() {
    return this.prismaClientManager.getClient('public'); // Asumiendo un esquema 'public' para datos globales
  }

  async getAvailablePlans(): Promise<Plan[]> {
    // Estos datos podrían venir de una DB o ser estáticos
    return [
      {
        code: PlanType.BASIC,
        name: "Plan Básico",
        description: "Ideal para conjuntos pequeños",
        priceMonthly: 0,
        maxUnits: 30,
        features: ["Gestión de propiedades", "Comunicaciones básicas"],
      },
      {
        code: PlanType.STANDARD,
        name: "Plan Estándar",
        description: "Para conjuntos medianos",
        priceMonthly: 25,
        maxUnits: 50,
        features: ["Todas las funcionalidades básicas", "Gestión de asambleas", "PQR avanzado"],
      },
      {
        code: PlanType.PREMIUM,
        name: "Plan Premium",
        description: "Para conjuntos grandes",
        priceMonthly: 50,
        maxUnits: 90,
        features: ["Todas las funcionalidades estándar", "Módulo financiero avanzado", "Personalización"],
      },
      {
        code: PlanType.ENTERPRISE,
        name: "Plan Empresarial",
        description: "Soluciones personalizadas para grandes administraciones",
        priceMonthly: 0, // Contactar para precio
        maxUnits: 0, // Personalizado
        features: ["Todas las funcionalidades Premium", "Soporte dedicado", "Integraciones personalizadas"],
      },
    ];
  }

  async createSubscription(complexId: number, planType: PlanType, amount: number, currency: string): Promise<Subscription> {
    const prisma = this.getPublicPrismaClient();
    return prisma.subscription.create({
      data: {
        complexId,
        planType,
        amount,
        currency,
        startDate: new Date(),
        isActive: true,
      },
    });
  }

  async updateComplexPlan(complexId: number, newPlanType: PlanType): Promise<any> {
    const prisma = this.getPublicPrismaClient();
    // Lógica para actualizar el plan del complejo y posiblemente crear una nueva suscripción
    return prisma.residentialComplex.update({
      where: { id: complexId },
      data: { planType: newPlanType },
    });
  }

  async getComplexSubscription(complexId: number): Promise<Subscription | null> {
    const prisma = this.getPublicPrismaClient();
    return prisma.subscription.findFirst({
      where: { complexId, isActive: true },
      orderBy: { startDate: 'desc' },
    });
  }

  async checkFeatureAccess(complexId: number, feature: string): Promise<boolean> {
    const currentPlan = await this.getComplexSubscription(complexId);
    if (!currentPlan) {
      return false; // No hay suscripción activa
    }

    const plans = await this.getAvailablePlans();
    const planDetails = plans.find(p => p.code === currentPlan.planType);

    if (!planDetails) {
      return false; // Plan no encontrado
    }

    // Lógica de feature-gating: verificar si la característica está incluida en el plan
    // Esto es un ejemplo simplificado. En un sistema real, las características estarían más detalladas.
    switch (feature) {
      case 'advanced_communications':
        return [PlanType.STANDARD, PlanType.PREMIUM, PlanType.ENTERPRISE].includes(planDetails.code);
      case 'financial_module':
        return [PlanType.PREMIUM, PlanType.ENTERPRISE].includes(planDetails.code);
      case 'assembly_management':
        return [PlanType.STANDARD, PlanType.PREMIUM, PlanType.ENTERPRISE].includes(planDetails.code);
      default:
        return true; // Las características básicas están siempre disponibles
    }
  }
}