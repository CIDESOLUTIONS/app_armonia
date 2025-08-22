import {
  Injectable,
  NotFoundException,
  BadRequestException,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreatePlanDto,
  UpdatePlanDto,
  PlanDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  SubscriptionDto,
  CreateLicenseDto,
  UpdateLicenseDto,
  LicenseDto,
  UsageTrackingDto,
  FeatureAccessCheckDto,
  PlanUpgradeDto,
  PlanDowngradeDto,
  BillingCycleChangeDto,
  SubscriptionAnalyticsDto,
  PlanType,
  SubscriptionStatus,
  LicenseStatus,
  BillingCycle,
  UsageLimitType,
  UsageLimitDto,
  FeatureConfigDto,
} from '../common/dto/plans.dto';

@Injectable()
export class PlansService {
  private readonly logger = new Logger(PlansService.name);

  constructor(private prisma: PrismaService) {}

  // ========== PLAN MANAGEMENT ==========
  
  async createPlan(createPlanDto: CreatePlanDto): Promise<PlanDto> {
    try {
      // Validate feature dependencies
      this.validateFeatureDependencies(createPlanDto.featureConfiguration || []);
      
      const planId = `plan_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO plans (
          id, name, description, type, price, billing_cycle, features,
          feature_configuration, usage_limits, is_public, is_active,
          trial_days, setup_fee, metadata, allowed_roles
        ) VALUES (
          ${planId}, ${createPlanDto.name}, ${createPlanDto.description || ''},
          ${createPlanDto.type}, ${createPlanDto.price}, ${createPlanDto.billingCycle},
          ${JSON.stringify(createPlanDto.features || [])},
          ${JSON.stringify(createPlanDto.featureConfiguration || [])},
          ${JSON.stringify(createPlanDto.usageLimits || [])},
          ${createPlanDto.isPublic ?? true}, ${createPlanDto.isActive ?? true},
          ${createPlanDto.trialDays || null}, ${createPlanDto.setupFee || 0},
          ${JSON.stringify(createPlanDto.metadata || {})},
          ${JSON.stringify(createPlanDto.allowedRoles || [])}
        )
      `;

      this.logger.log(`Plan creado: ${createPlanDto.name} (${planId})`);
      
      return {
        id: planId,
        name: createPlanDto.name,
        description: createPlanDto.description,
        type: createPlanDto.type,
        price: createPlanDto.price,
        billingCycle: createPlanDto.billingCycle,
        features: createPlanDto.features || [],
        featureConfiguration: createPlanDto.featureConfiguration || [],
        usageLimits: createPlanDto.usageLimits || [],
        isPublic: createPlanDto.isPublic ?? true,
        isActive: createPlanDto.isActive ?? true,
        trialDays: createPlanDto.trialDays,
        setupFee: createPlanDto.setupFee || 0,
        metadata: createPlanDto.metadata,
        allowedRoles: createPlanDto.allowedRoles || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
    } catch (error) {
      throw new BadRequestException('Error al crear plan: ' + error.message);
    }
  }

  async findAllPlans(
    includeInactive: boolean = false,
    planType?: PlanType,
  ): Promise<PlanDto[]> {
    try {
      let whereClause = 'WHERE 1=1';
      
      if (!includeInactive) {
        whereClause += ' AND is_active = true AND is_public = true';
      }
      if (planType) {
        whereClause += ` AND type = '${planType}'`;
      }

      const plans = await this.prisma.$queryRaw`
        SELECT p.*, 
               COALESCE(s.subscription_count, 0) as subscriber_count
        FROM plans p
        LEFT JOIN (
          SELECT plan_id, COUNT(*) as subscription_count
          FROM subscriptions
          WHERE status IN ('ACTIVE', 'TRIAL')
          GROUP BY plan_id
        ) s ON p.id = s.plan_id
        ${whereClause}
        ORDER BY p.price ASC
      ` as any[];

      return plans.map(plan => ({
        ...this.mapPlanToDto(plan),
        subscriberCount: Number(plan.subscriber_count || 0),
      }));
    } catch (error) {
      throw new BadRequestException('Error al obtener planes: ' + error.message);
    }
  }

  async findPlanById(id: string): Promise<PlanDto> {
    try {
      const plans = await this.prisma.$queryRaw`
        SELECT p.*, 
               COALESCE(s.subscription_count, 0) as subscriber_count
        FROM plans p
        LEFT JOIN (
          SELECT plan_id, COUNT(*) as subscription_count
          FROM subscriptions
          WHERE status IN ('ACTIVE', 'TRIAL')
          GROUP BY plan_id
        ) s ON p.id = s.plan_id
        WHERE p.id = ${id}
      ` as any[];

      if (!plans.length) {
        throw new NotFoundException(`Plan con ID ${id} no encontrado`);
      }

      return {
        ...this.mapPlanToDto(plans[0]),
        subscriberCount: Number(plans[0].subscriber_count || 0),
      };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener plan: ' + error.message);
    }
  }

  async updatePlan(id: string, updatePlanDto: UpdatePlanDto): Promise<PlanDto> {
    try {
      // Validate feature dependencies if provided
      if (updatePlanDto.featureConfiguration) {
        this.validateFeatureDependencies(updatePlanDto.featureConfiguration);
      }

      const updateFields = [];
      const values = [];

      if (updatePlanDto.name !== undefined) {
        updateFields.push('name = ?');
        values.push(updatePlanDto.name);
      }
      if (updatePlanDto.description !== undefined) {
        updateFields.push('description = ?');
        values.push(updatePlanDto.description);
      }
      if (updatePlanDto.type !== undefined) {
        updateFields.push('type = ?');
        values.push(updatePlanDto.type);
      }
      if (updatePlanDto.price !== undefined) {
        updateFields.push('price = ?');
        values.push(updatePlanDto.price);
      }
      if (updatePlanDto.billingCycle !== undefined) {
        updateFields.push('billing_cycle = ?');
        values.push(updatePlanDto.billingCycle);
      }
      if (updatePlanDto.features !== undefined) {
        updateFields.push('features = ?');
        values.push(JSON.stringify(updatePlanDto.features));
      }
      if (updatePlanDto.featureConfiguration !== undefined) {
        updateFields.push('feature_configuration = ?');
        values.push(JSON.stringify(updatePlanDto.featureConfiguration));
      }
      if (updatePlanDto.usageLimits !== undefined) {
        updateFields.push('usage_limits = ?');
        values.push(JSON.stringify(updatePlanDto.usageLimits));
      }
      if (updatePlanDto.isPublic !== undefined) {
        updateFields.push('is_public = ?');
        values.push(updatePlanDto.isPublic);
      }
      if (updatePlanDto.isActive !== undefined) {
        updateFields.push('is_active = ?');
        values.push(updatePlanDto.isActive);
      }
      if (updatePlanDto.trialDays !== undefined) {
        updateFields.push('trial_days = ?');
        values.push(updatePlanDto.trialDays);
      }
      if (updatePlanDto.setupFee !== undefined) {
        updateFields.push('setup_fee = ?');
        values.push(updatePlanDto.setupFee);
      }
      if (updatePlanDto.metadata !== undefined) {
        updateFields.push('metadata = ?');
        values.push(JSON.stringify(updatePlanDto.metadata));
      }
      if (updatePlanDto.allowedRoles !== undefined) {
        updateFields.push('allowed_roles = ?');
        values.push(JSON.stringify(updatePlanDto.allowedRoles));
      }

      updateFields.push('updated_at = NOW()');

      await this.prisma.$executeRaw`
        UPDATE plans SET ${updateFields.join(', ')}
        WHERE id = ${id}
      `;

      this.logger.log(`Plan actualizado: ${id}`);
      return this.findPlanById(id);
    } catch (error) {
      throw new BadRequestException('Error al actualizar plan: ' + error.message);
    }
  }

  async removePlan(id: string): Promise<void> {
    try {
      // Check if plan has active subscriptions
      const activeSubscriptions = await this.prisma.$queryRaw`
        SELECT COUNT(*) as count FROM subscriptions 
        WHERE plan_id = ${id} AND status IN ('ACTIVE', 'TRIAL')
      ` as any[];

      if (Number(activeSubscriptions[0]?.count || 0) > 0) {
        throw new BadRequestException(
          'No se puede eliminar un plan con suscripciones activas',
        );
      }

      await this.prisma.$executeRaw`
        DELETE FROM plans WHERE id = ${id}
      `;
      
      this.logger.log(`Plan eliminado: ${id}`);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al eliminar plan: ' + error.message);
    }
  }

  // ========== SUBSCRIPTION MANAGEMENT ==========
  
  async createSubscription(
    createSubscriptionDto: CreateSubscriptionDto,
  ): Promise<SubscriptionDto> {
    try {
      // Verify plan exists and is active
      const plans = await this.prisma.$queryRaw`
        SELECT * FROM plans WHERE id = ${createSubscriptionDto.planId}
      ` as any[];

      if (!plans.length || !plans[0].is_active) {
        throw new BadRequestException('Plan no encontrado o inactivo');
      }

      const plan = plans[0];

      // Check if complex already has an active subscription
      const existingSubscriptions = await this.prisma.$queryRaw`
        SELECT * FROM subscriptions 
        WHERE residential_complex_id = ${createSubscriptionDto.residentialComplexId}
        AND status IN ('ACTIVE', 'TRIAL')
      ` as any[];

      if (existingSubscriptions.length > 0) {
        throw new BadRequestException(
          'El complejo residencial ya tiene una suscripción activa',
        );
      }

      const startDate = createSubscriptionDto.startDate
        ? new Date(createSubscriptionDto.startDate)
        : new Date();

      const endDate = createSubscriptionDto.endDate
        ? new Date(createSubscriptionDto.endDate)
        : this.calculateEndDate(startDate, createSubscriptionDto.billingCycle || plan.billing_cycle);

      const nextBillingDate = this.calculateNextBillingDate(
        startDate,
        createSubscriptionDto.billingCycle || plan.billing_cycle,
      );

      // Determine if this is a trial subscription
      const isTrialSubscription = plan.trial_days && plan.trial_days > 0;
      const trialEndDate = isTrialSubscription
        ? new Date(startDate.getTime() + plan.trial_days * 24 * 60 * 60 * 1000)
        : null;

      const subscriptionId = `sub_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await this.prisma.$executeRaw`
        INSERT INTO subscriptions (
          id, plan_id, residential_complex_id, status, billing_cycle,
          quantity, current_price, start_date, end_date, next_billing_date,
          auto_renew, payment_method_id, metadata
        ) VALUES (
          ${subscriptionId}, ${createSubscriptionDto.planId},
          ${createSubscriptionDto.residentialComplexId},
          ${isTrialSubscription ? SubscriptionStatus.TRIAL : SubscriptionStatus.ACTIVE},
          ${createSubscriptionDto.billingCycle || plan.billing_cycle},
          ${createSubscriptionDto.quantity || 1}, ${plan.price},
          ${startDate}, ${trialEndDate || endDate}, ${trialEndDate || nextBillingDate},
          ${createSubscriptionDto.autoRenew ?? true},
          ${createSubscriptionDto.paymentMethodId || null},
          ${JSON.stringify(createSubscriptionDto.metadata || {})}
        )
      `;

      // Create initial usage limits based on plan
      await this.initializeUsageLimits(subscriptionId, plan.usage_limits);

      this.logger.log(
        `Suscripción creada: ${subscriptionId} para complejo ${createSubscriptionDto.residentialComplexId}`,
      );

      return this.getSubscriptionById(subscriptionId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear suscripción: ' + error.message);
    }
  }

  async findSubscriptionsByComplex(
    residentialComplexId: string,
  ): Promise<SubscriptionDto[]> {
    try {
      const subscriptions = await this.prisma.$queryRaw`
        SELECT s.*, p.* FROM subscriptions s
        LEFT JOIN plans p ON s.plan_id = p.id
        WHERE s.residential_complex_id = ${residentialComplexId}
        ORDER BY s.created_at DESC
      ` as any[];

      const result = [];
      for (const subscription of subscriptions) {
        const currentUsage = await this.getCurrentUsage(subscription.id);
        const licenses = await this.getLicensesBySubscription(subscription.id);
        result.push(this.mapSubscriptionToDto(subscription, currentUsage, licenses));
      }

      return result;
    } catch (error) {
      throw new BadRequestException('Error al obtener suscripciones: ' + error.message);
    }
  }

  async getSubscriptionById(id: string): Promise<SubscriptionDto> {
    try {
      const subscriptions = await this.prisma.$queryRaw`
        SELECT s.*, p.* FROM subscriptions s
        LEFT JOIN plans p ON s.plan_id = p.id
        WHERE s.id = ${id}
      ` as any[];

      if (!subscriptions.length) {
        throw new NotFoundException(`Suscripción con ID ${id} no encontrada`);
      }

      const subscription = subscriptions[0];
      const currentUsage = await this.getCurrentUsage(id);
      const licenses = await this.getLicensesBySubscription(id);

      return this.mapSubscriptionToDto(subscription, currentUsage, licenses);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener suscripción: ' + error.message);
    }
  }

  async updateSubscription(
    id: string,
    updateSubscriptionDto: UpdateSubscriptionDto,
  ): Promise<SubscriptionDto> {
    try {
      const updateFields = [];
      const values = [];

      // If changing plan, validate the new plan and update current price
      if (updateSubscriptionDto.planId) {
        const plans = await this.prisma.$queryRaw`
          SELECT * FROM plans WHERE id = ${updateSubscriptionDto.planId}
        ` as any[];

        if (!plans.length || !plans[0].is_active) {
          throw new BadRequestException('Plan no encontrado o inactivo');
        }

        updateFields.push('plan_id = ?', 'current_price = ?');
        values.push(updateSubscriptionDto.planId, plans[0].price);
      }

      if (updateSubscriptionDto.billingCycle !== undefined) {
        updateFields.push('billing_cycle = ?');
        values.push(updateSubscriptionDto.billingCycle);
        
        // Recalculate next billing date
        const nextBillingDate = this.calculateNextBillingDate(
          new Date(),
          updateSubscriptionDto.billingCycle,
        );
        updateFields.push('next_billing_date = ?');
        values.push(nextBillingDate);
      }

      if (updateSubscriptionDto.quantity !== undefined) {
        updateFields.push('quantity = ?');
        values.push(updateSubscriptionDto.quantity);
      }
      if (updateSubscriptionDto.endDate !== undefined) {
        updateFields.push('end_date = ?');
        values.push(new Date(updateSubscriptionDto.endDate));
      }
      if (updateSubscriptionDto.autoRenew !== undefined) {
        updateFields.push('auto_renew = ?');
        values.push(updateSubscriptionDto.autoRenew);
      }
      if (updateSubscriptionDto.paymentMethodId !== undefined) {
        updateFields.push('payment_method_id = ?');
        values.push(updateSubscriptionDto.paymentMethodId);
      }
      if (updateSubscriptionDto.status !== undefined) {
        updateFields.push('status = ?');
        values.push(updateSubscriptionDto.status);
      }
      if (updateSubscriptionDto.metadata !== undefined) {
        updateFields.push('metadata = ?');
        values.push(JSON.stringify(updateSubscriptionDto.metadata));
      }

      updateFields.push('updated_at = NOW()');

      await this.prisma.$executeRaw`
        UPDATE subscriptions SET ${updateFields.join(', ')}
        WHERE id = ${id}
      `;

      this.logger.log(`Suscripción actualizada: ${id}`);
      return this.getSubscriptionById(id);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al actualizar suscripción: ' + error.message);
    }
  }

  // ========== LICENSE MANAGEMENT ==========
  
  async createLicense(createLicenseDto: CreateLicenseDto): Promise<LicenseDto> {
    try {
      // Verify subscription exists and is active
      const subscriptions = await this.prisma.$queryRaw`
        SELECT * FROM subscriptions WHERE id = ${createLicenseDto.subscriptionId}
      ` as any[];

      if (!subscriptions.length || subscriptions[0].status !== SubscriptionStatus.ACTIVE) {
        throw new BadRequestException('Suscripción no encontrada o inactiva');
      }

      const licenseId = `lic_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      await this.prisma.$executeRaw`
        INSERT INTO licenses (
          id, subscription_id, user_id, status, assigned_roles,
          permissions, expires_at, metadata
        ) VALUES (
          ${licenseId}, ${createLicenseDto.subscriptionId}, ${createLicenseDto.userId},
          'ACTIVE', ${JSON.stringify(createLicenseDto.assignedRoles || [])},
          ${JSON.stringify(createLicenseDto.permissions || [])},
          ${createLicenseDto.expiresAt ? new Date(createLicenseDto.expiresAt) : null},
          ${JSON.stringify(createLicenseDto.metadata || {})}
        )
      `;

      this.logger.log(`Licencia creada: ${licenseId} para usuario ${createLicenseDto.userId}`);
      return this.getLicenseById(licenseId);
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Error al crear licencia: ' + error.message);
    }
  }

  async getLicenseById(id: string): Promise<LicenseDto> {
    try {
      const licenses = await this.prisma.$queryRaw`
        SELECT l.*, u.email, u.first_name, u.last_name
        FROM licenses l
        LEFT JOIN users u ON l.user_id = u.id
        WHERE l.id = ${id}
      ` as any[];

      if (!licenses.length) {
        throw new NotFoundException(`Licencia con ID ${id} no encontrada`);
      }

      return this.mapLicenseToDto(licenses[0]);
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al obtener licencia: ' + error.message);
    }
  }

  async updateLicense(id: string, updateLicenseDto: UpdateLicenseDto): Promise<LicenseDto> {
    try {
      const updateFields = [];
      const values = [];

      if (updateLicenseDto.status !== undefined) {
        updateFields.push('status = ?');
        values.push(updateLicenseDto.status);
        
        if (updateLicenseDto.status === LicenseStatus.ACTIVE) {
          updateFields.push('activated_at = NOW()');
        }
      }
      if (updateLicenseDto.assignedRoles !== undefined) {
        updateFields.push('assigned_roles = ?');
        values.push(JSON.stringify(updateLicenseDto.assignedRoles));
      }
      if (updateLicenseDto.permissions !== undefined) {
        updateFields.push('permissions = ?');
        values.push(JSON.stringify(updateLicenseDto.permissions));
      }
      if (updateLicenseDto.expiresAt !== undefined) {
        updateFields.push('expires_at = ?');
        values.push(updateLicenseDto.expiresAt ? new Date(updateLicenseDto.expiresAt) : null);
      }
      if (updateLicenseDto.metadata !== undefined) {
        updateFields.push('metadata = ?');
        values.push(JSON.stringify(updateLicenseDto.metadata));
      }

      updateFields.push('updated_at = NOW()');

      await this.prisma.$executeRaw`
        UPDATE licenses SET ${updateFields.join(', ')}
        WHERE id = ${id}
      `;

      this.logger.log(`Licencia actualizada: ${id}`);
      return this.getLicenseById(id);
    } catch (error) {
      throw new BadRequestException('Error al actualizar licencia: ' + error.message);
    }
  }

  // ========== USAGE TRACKING ==========
  
  async trackUsage(usageTrackingDto: UsageTrackingDto): Promise<void> {
    try {
      const usageId = `usage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO usage_tracking (
          id, subscription_id, limit_type, amount, description, metadata
        ) VALUES (
          ${usageId}, ${usageTrackingDto.subscriptionId}, ${usageTrackingDto.limitType},
          ${usageTrackingDto.amount}, ${usageTrackingDto.description || ''},
          ${JSON.stringify(usageTrackingDto.metadata || {})}
        )
      `;

      // Update current usage limits
      await this.updateCurrentUsage(
        usageTrackingDto.subscriptionId,
        usageTrackingDto.limitType,
        usageTrackingDto.amount,
      );
    } catch (error) {
      throw new BadRequestException('Error al rastrear uso: ' + error.message);
    }
  }

  async checkFeatureAccess(checkDto: FeatureAccessCheckDto): Promise<{ hasAccess: boolean; reason?: string }> {
    try {
      // Get subscription with plan details
      const subscriptions = await this.prisma.$queryRaw`
        SELECT s.*, p.feature_configuration
        FROM subscriptions s
        LEFT JOIN plans p ON s.plan_id = p.id
        WHERE s.id = ${checkDto.subscriptionId}
      ` as any[];

      if (!subscriptions.length) {
        return { hasAccess: false, reason: 'Suscripción no encontrada' };
      }

      const subscription = subscriptions[0];
      
      if (subscription.status !== SubscriptionStatus.ACTIVE && subscription.status !== SubscriptionStatus.TRIAL) {
        return { hasAccess: false, reason: 'Suscripción inactiva' };
      }

      const featureConfig = subscription.feature_configuration || [];
      const feature = featureConfig.find((f: any) => f.name === checkDto.feature);

      if (!feature) {
        return { hasAccess: false, reason: 'Funcionalidad no incluida en el plan' };
      }

      if (!feature.enabled) {
        return { hasAccess: false, reason: 'Funcionalidad deshabilitada' };
      }

      // Check usage limits if applicable
      if (feature.limit && feature.limitType) {
        const currentUsage = await this.getCurrentUsageForType(
          checkDto.subscriptionId,
          feature.limitType,
        );
        
        if (currentUsage >= feature.limit) {
          return { hasAccess: false, reason: 'Límite de uso excedido' };
        }
      }

      // Check dependencies
      if (feature.dependencies && feature.dependencies.length > 0) {
        for (const dependency of feature.dependencies) {
          const dependencyCheck = await this.checkFeatureAccess({
            ...checkDto,
            feature: dependency,
          });
          
          if (!dependencyCheck.hasAccess) {
            return {
              hasAccess: false,
              reason: `Dependencia no disponible: ${dependency}`,
            };
          }
        }
      }

      return { hasAccess: true };
    } catch (error) {
      this.logger.error('Error verificando acceso a funcionalidad:', error);
      return { hasAccess: false, reason: 'Error interno del sistema' };
    }
  }

  // ========== PLAN UPGRADES/DOWNGRADES ==========
  
  async upgradePlan(upgradeDto: PlanUpgradeDto): Promise<SubscriptionDto> {
    try {
      // Validate new plan
      const newPlan = await this.findPlanById(upgradeDto.newPlanId);
      const currentSubscription = await this.getSubscriptionById(upgradeDto.subscriptionId);

      if (newPlan.price <= currentSubscription.plan.price) {
        throw new BadRequestException('El nuevo plan debe tener un precio superior para ser considerado una mejora');
      }

      const effectiveDate = upgradeDto.effectiveDate ? new Date(upgradeDto.effectiveDate) : new Date();

      // Calculate prorated charges if applicable
      let proratedAmount = 0;
      if (upgradeDto.prorateCharges) {
        proratedAmount = this.calculateProratedAmount(
          currentSubscription,
          newPlan,
          effectiveDate,
        );
      }

      // Update subscription
      await this.updateSubscription(upgradeDto.subscriptionId, {
        planId: upgradeDto.newPlanId,
        residentialComplexId: currentSubscription.residentialComplexId,
      });

      // Log the upgrade
      this.logger.log(
        `Plan mejorado: Suscripción ${upgradeDto.subscriptionId} de ${currentSubscription.plan.name} a ${newPlan.name}. Monto prorrateado: $${proratedAmount}`,
      );

      return this.getSubscriptionById(upgradeDto.subscriptionId);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al mejorar plan: ' + error.message);
    }
  }

  async downgradePlan(downgradeDto: PlanDowngradeDto): Promise<SubscriptionDto> {
    try {
      const newPlan = await this.findPlanById(downgradeDto.newPlanId);
      const currentSubscription = await this.getSubscriptionById(downgradeDto.subscriptionId);

      if (newPlan.price >= currentSubscription.plan.price) {
        throw new BadRequestException('El nuevo plan debe tener un precio inferior para ser considerado una rebaja');
      }

      const effectiveDate = downgradeDto.immediateDowngrade
        ? new Date()
        : downgradeDto.effectiveDate
        ? new Date(downgradeDto.effectiveDate)
        : new Date(currentSubscription.nextBillingDate || new Date());

      if (downgradeDto.immediateDowngrade) {
        // Apply downgrade immediately
        await this.updateSubscription(downgradeDto.subscriptionId, {
          planId: downgradeDto.newPlanId,
          residentialComplexId: currentSubscription.residentialComplexId,
        });
      } else {
        // Schedule downgrade for next billing cycle
        await this.scheduleDowngrade(downgradeDto.subscriptionId, downgradeDto.newPlanId, effectiveDate);
      }

      this.logger.log(
        `Plan rebajado: Suscripción ${downgradeDto.subscriptionId} de ${currentSubscription.plan.name} a ${newPlan.name}. Efectivo: ${effectiveDate.toISOString()}`,
      );

      return this.getSubscriptionById(downgradeDto.subscriptionId);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al rebajar plan: ' + error.message);
    }
  }

  async changeBillingCycle(changeDto: BillingCycleChangeDto): Promise<SubscriptionDto> {
    try {
      const subscription = await this.getSubscriptionById(changeDto.subscriptionId);
      const effectiveDate = changeDto.effectiveDate ? new Date(changeDto.effectiveDate) : new Date();

      // Calculate prorated adjustment if needed
      let adjustmentAmount = 0;
      if (changeDto.prorateCharges) {
        adjustmentAmount = this.calculateBillingCycleAdjustment(
          subscription,
          changeDto.newBillingCycle,
          effectiveDate,
        );
      }

      await this.updateSubscription(changeDto.subscriptionId, {
        billingCycle: changeDto.newBillingCycle,
        residentialComplexId: subscription.residentialComplexId,
      });

      this.logger.log(
        `Ciclo de facturación cambiado: Suscripción ${changeDto.subscriptionId} a ${changeDto.newBillingCycle}. Ajuste: $${adjustmentAmount}`,
      );

      return this.getSubscriptionById(changeDto.subscriptionId);
    } catch (error) {
      if (error instanceof BadRequestException || error instanceof NotFoundException) {
        throw error;
      }
      throw new BadRequestException('Error al cambiar ciclo de facturación: ' + error.message);
    }
  }

  // ========== ANALYTICS ==========
  
  async getSubscriptionAnalytics(): Promise<SubscriptionAnalyticsDto> {
    try {
      const [subscriptionStats, revenueStats] = await Promise.all([
        this.getSubscriptionStats(),
        this.getRevenueStats(),
      ]);

      return {
        ...subscriptionStats,
        ...revenueStats,
        churnRate: await this.calculateChurnRate(),
        retentionRate: await this.calculateRetentionRate(),
        growthTrends: await this.getGrowthTrends(),
      };
    } catch (error) {
      throw new BadRequestException('Error al obtener analíticas: ' + error.message);
    }
  }

  // ========== PRIVATE HELPER METHODS ==========
  
  private validateFeatureDependencies(features: FeatureConfigDto[]): void {
    const featureMap = new Map(features.map(f => [f.name, f]));
    
    for (const feature of features) {
      if (feature.dependencies) {
        for (const dependency of feature.dependencies) {
          const dependentFeature = featureMap.get(dependency);
          if (!dependentFeature || !dependentFeature.enabled) {
            throw new BadRequestException(
              `La funcionalidad '${feature.name}' requiere que '${dependency}' esté habilitada`,
            );
          }
        }
      }
    }
  }

  private calculateEndDate(startDate: Date, billingCycle: BillingCycle): Date {
    const endDate = new Date(startDate);
    
    switch (billingCycle) {
      case BillingCycle.MONTHLY:
        endDate.setMonth(endDate.getMonth() + 1);
        break;
      case BillingCycle.QUARTERLY:
        endDate.setMonth(endDate.getMonth() + 3);
        break;
      case BillingCycle.YEARLY:
        endDate.setFullYear(endDate.getFullYear() + 1);
        break;
    }
    
    return endDate;
  }

  private calculateNextBillingDate(startDate: Date, billingCycle: BillingCycle): Date {
    return this.calculateEndDate(startDate, billingCycle);
  }

  private async initializeUsageLimits(subscriptionId: string, usageLimits: any[]): Promise<void> {
    if (!usageLimits || usageLimits.length === 0) return;

    for (const limit of usageLimits) {
      const limitId = `limit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      
      await this.prisma.$executeRaw`
        INSERT INTO subscription_usage_limits (
          id, subscription_id, limit_type, limit_value, current_usage,
          reset_period, reset_date
        ) VALUES (
          ${limitId}, ${subscriptionId}, ${limit.type}, ${limit.limit},
          0, ${limit.resetPeriod || 'MONTHLY'}, ${this.calculateResetDate(limit.resetPeriod)}
        )
      `;
    }
  }

  private calculateResetDate(resetPeriod: string = 'MONTHLY'): Date {
    const now = new Date();
    const resetDate = new Date(now);
    
    switch (resetPeriod) {
      case 'DAILY':
        resetDate.setDate(resetDate.getDate() + 1);
        resetDate.setHours(0, 0, 0, 0);
        break;
      case 'WEEKLY':
        resetDate.setDate(resetDate.getDate() + (7 - resetDate.getDay()));
        resetDate.setHours(0, 0, 0, 0);
        break;
      case 'MONTHLY':
        resetDate.setMonth(resetDate.getMonth() + 1, 1);
        resetDate.setHours(0, 0, 0, 0);
        break;
      case 'YEARLY':
        resetDate.setFullYear(resetDate.getFullYear() + 1, 0, 1);
        resetDate.setHours(0, 0, 0, 0);
        break;
    }
    
    return resetDate;
  }

  private async getCurrentUsage(subscriptionId: string): Promise<UsageLimitDto[]> {
    try {
      const limits = await this.prisma.$queryRaw`
        SELECT * FROM subscription_usage_limits 
        WHERE subscription_id = ${subscriptionId}
      ` as any[];

      return limits.map(limit => ({
        type: limit.limit_type,
        limit: limit.limit_value,
        current: limit.current_usage,
        remaining: Math.max(0, limit.limit_value - limit.current_usage),
        isUnlimited: limit.limit_value === -1,
        resetDate: limit.reset_date?.toISOString(),
        resetPeriod: limit.reset_period,
      }));
    } catch (error) {
      this.logger.error('Error obteniendo uso actual:', error);
      return [];
    }
  }

  private async getCurrentUsageForType(subscriptionId: string, limitType: UsageLimitType): Promise<number> {
    try {
      const limits = await this.prisma.$queryRaw`
        SELECT current_usage FROM subscription_usage_limits 
        WHERE subscription_id = ${subscriptionId} AND limit_type = ${limitType}
      ` as any[];

      return limits.length > 0 ? limits[0].current_usage : 0;
    } catch (error) {
      this.logger.error('Error obteniendo uso por tipo:', error);
      return 0;
    }
  }

  private async updateCurrentUsage(
    subscriptionId: string,
    limitType: UsageLimitType,
    amount: number,
  ): Promise<void> {
    try {
      await this.prisma.$executeRaw`
        UPDATE subscription_usage_limits 
        SET current_usage = current_usage + ${amount},
            updated_at = NOW()
        WHERE subscription_id = ${subscriptionId} AND limit_type = ${limitType}
      `;
    } catch (error) {
      this.logger.error('Error actualizando uso:', error);
    }
  }

  private async getLicensesBySubscription(subscriptionId: string): Promise<LicenseDto[]> {
    try {
      const licenses = await this.prisma.$queryRaw`
        SELECT l.*, u.email, u.first_name, u.last_name
        FROM licenses l
        LEFT JOIN users u ON l.user_id = u.id
        WHERE l.subscription_id = ${subscriptionId}
      ` as any[];

      return licenses.map(license => this.mapLicenseToDto(license));
    } catch (error) {
      this.logger.error('Error obteniendo licencias:', error);
      return [];
    }
  }

  private calculateProratedAmount(
    currentSubscription: SubscriptionDto,
    newPlan: PlanDto,
    effectiveDate: Date,
  ): number {
    // Simplified proration calculation
    const priceDifference = newPlan.price - currentSubscription.plan.price;
    const nextBillingDate = new Date(currentSubscription.nextBillingDate || new Date());
    const totalDays = this.getDaysInBillingCycle(currentSubscription.billingCycle);
    const remainingDays = Math.ceil((nextBillingDate.getTime() - effectiveDate.getTime()) / (1000 * 60 * 60 * 24));
    
    return (priceDifference * remainingDays) / totalDays;
  }

  private calculateBillingCycleAdjustment(
    subscription: SubscriptionDto,
    newBillingCycle: BillingCycle,
    effectiveDate: Date,
  ): number {
    // Simplified billing cycle adjustment calculation
    const currentMonthlyPrice = this.getMonthlyEquivalentPrice(subscription.plan.price, subscription.billingCycle);
    const newMonthlyPrice = this.getMonthlyEquivalentPrice(subscription.plan.price, newBillingCycle);
    
    return newMonthlyPrice - currentMonthlyPrice;
  }

  private getMonthlyEquivalentPrice(price: number, billingCycle: BillingCycle): number {
    switch (billingCycle) {
      case BillingCycle.MONTHLY:
        return price;
      case BillingCycle.QUARTERLY:
        return price / 3;
      case BillingCycle.YEARLY:
        return price / 12;
      default:
        return price;
    }
  }

  private getDaysInBillingCycle(billingCycle: BillingCycle): number {
    switch (billingCycle) {
      case BillingCycle.MONTHLY:
        return 30;
      case BillingCycle.QUARTERLY:
        return 90;
      case BillingCycle.YEARLY:
        return 365;
      default:
        return 30;
    }
  }

  private async scheduleDowngrade(subscriptionId: string, newPlanId: string, effectiveDate: Date): Promise<void> {
    // Implementation would create a scheduled task for the downgrade
    // For now, we'll just log it
    this.logger.log(`Rebaja programada para suscripción ${subscriptionId} el ${effectiveDate.toISOString()}`);
  }

  private async getSubscriptionStats(): Promise<Partial<SubscriptionAnalyticsDto>> {
    try {
      const stats = await this.prisma.$queryRaw`
        SELECT 
          COUNT(*) as total_subscriptions,
          COUNT(CASE WHEN status = 'ACTIVE' THEN 1 END) as active_subscriptions,
          COUNT(CASE WHEN status = 'TRIAL' THEN 1 END) as trial_subscriptions,
          COUNT(CASE WHEN status = 'CANCELED' THEN 1 END) as canceled_subscriptions
        FROM subscriptions
      ` as any[];

      const planStats = await this.prisma.$queryRaw`
        SELECT plan_id, COUNT(*) as count
        FROM subscriptions
        WHERE status IN ('ACTIVE', 'TRIAL')
        GROUP BY plan_id
      ` as any[];

      const subscriptionsByPlan = planStats.reduce((acc, stat) => {
        acc[stat.plan_id] = Number(stat.count);
        return acc;
      }, {});

      const stat = stats[0] || {};
      return {
        totalSubscriptions: Number(stat.total_subscriptions || 0),
        activeSubscriptions: Number(stat.active_subscriptions || 0),
        trialSubscriptions: Number(stat.trial_subscriptions || 0),
        canceledSubscriptions: Number(stat.canceled_subscriptions || 0),
        subscriptionsByPlan,
      };
    } catch (error) {
      this.logger.error('Error obteniendo stats de suscripciones:', error);
      return {
        totalSubscriptions: 0,
        activeSubscriptions: 0,
        trialSubscriptions: 0,
        canceledSubscriptions: 0,
        subscriptionsByPlan: {},
      };
    }
  }

  private async getRevenueStats(): Promise<Partial<SubscriptionAnalyticsDto>> {
    try {
      const revenueStats = await this.prisma.$queryRaw`
        SELECT 
          SUM(CASE WHEN billing_cycle = 'MONTHLY' THEN current_price ELSE 0 END) as monthly_revenue,
          SUM(current_price) as total_revenue,
          AVG(current_price) as avg_revenue_per_user
        FROM subscriptions
        WHERE status IN ('ACTIVE', 'TRIAL')
      ` as any[];

      const planRevenue = await this.prisma.$queryRaw`
        SELECT plan_id, SUM(current_price) as revenue
        FROM subscriptions
        WHERE status IN ('ACTIVE', 'TRIAL')
        GROUP BY plan_id
      ` as any[];

      const revenueByPlan = planRevenue.reduce((acc, stat) => {
        acc[stat.plan_id] = Number(stat.revenue);
        return acc;
      }, {});

      const stat = revenueStats[0] || {};
      const monthlyRevenue = Number(stat.monthly_revenue || 0);
      const yearlyRevenue = Number(stat.total_revenue || 0) - monthlyRevenue;

      return {
        monthlyRecurringRevenue: monthlyRevenue,
        annualRecurringRevenue: yearlyRevenue * 12 + monthlyRevenue * 12,
        averageRevenuePerUser: Number(stat.avg_revenue_per_user || 0),
        revenueByPlan,
      };
    } catch (error) {
      this.logger.error('Error obteniendo stats de ingresos:', error);
      return {
        monthlyRecurringRevenue: 0,
        annualRecurringRevenue: 0,
        averageRevenuePerUser: 0,
        revenueByPlan: {},
      };
    }
  }

  private async calculateChurnRate(): Promise<number> {
    try {
      // Simplified churn rate calculation
      const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
      
      const churnStats = await this.prisma.$queryRaw`
        SELECT 
          COUNT(CASE WHEN created_at >= ${thirtyDaysAgo} THEN 1 END) as new_subscriptions,
          COUNT(CASE WHEN status = 'CANCELED' AND updated_at >= ${thirtyDaysAgo} THEN 1 END) as churned_subscriptions
        FROM subscriptions
      ` as any[];

      const stat = churnStats[0] || {};
      const newSubs = Number(stat.new_subscriptions || 0);
      const churned = Number(stat.churned_subscriptions || 0);

      return newSubs > 0 ? (churned / newSubs) * 100 : 0;
    } catch (error) {
      this.logger.error('Error calculando churn rate:', error);
      return 0;
    }
  }

  private async calculateRetentionRate(): Promise<number> {
    const churnRate = await this.calculateChurnRate();
    return Math.max(0, 100 - churnRate);
  }

  private async getGrowthTrends(): Promise<any[]> {
    try {
      const trends = await this.prisma.$queryRaw`
        SELECT 
          DATE_TRUNC('month', created_at) as month,
          COUNT(*) as new_subscriptions,
          SUM(current_price) as revenue
        FROM subscriptions
        WHERE created_at >= DATE_TRUNC('month', NOW()) - INTERVAL '12 months'
        GROUP BY DATE_TRUNC('month', created_at)
        ORDER BY month
      ` as any[];

      return trends.map(trend => ({
        month: trend.month,
        newSubscriptions: Number(trend.new_subscriptions),
        revenue: Number(trend.revenue),
      }));
    } catch (error) {
      this.logger.error('Error obteniendo tendencias de crecimiento:', error);
      return [];
    }
  }

  private mapPlanToDto(plan: any): PlanDto {
    return {
      id: plan.id,
      name: plan.name,
      description: plan.description,
      type: plan.type,
      price: plan.price,
      billingCycle: plan.billing_cycle,
      features: plan.features || [],
      featureConfiguration: plan.feature_configuration || [],
      usageLimits: plan.usage_limits || [],
      isPublic: plan.is_public,
      isActive: plan.is_active,
      trialDays: plan.trial_days,
      setupFee: plan.setup_fee,
      metadata: plan.metadata,
      allowedRoles: plan.allowed_roles || [],
      createdAt: plan.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: plan.updated_at?.toISOString() || new Date().toISOString(),
    };
  }

  private mapSubscriptionToDto(
    subscription: any,
    currentUsage: UsageLimitDto[],
    licenses: LicenseDto[],
  ): SubscriptionDto {
    return {
      id: subscription.id,
      planId: subscription.plan_id,
      plan: this.mapPlanToDto(subscription),
      residentialComplexId: subscription.residential_complex_id,
      status: subscription.status,
      billingCycle: subscription.billing_cycle,
      quantity: subscription.quantity,
      currentPrice: subscription.current_price,
      startDate: subscription.start_date?.toISOString(),
      endDate: subscription.end_date?.toISOString(),
      nextBillingDate: subscription.next_billing_date?.toISOString(),
      autoRenew: subscription.auto_renew,
      paymentMethodId: subscription.payment_method_id,
      licenses,
      currentUsage,
      metadata: subscription.metadata,
      createdAt: subscription.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: subscription.updated_at?.toISOString() || new Date().toISOString(),
    };
  }

  private mapLicenseToDto(license: any): LicenseDto {
    return {
      id: license.id,
      subscriptionId: license.subscription_id,
      userId: license.user_id,
      userEmail: license.email,
      userName: license.first_name && license.last_name 
        ? `${license.first_name} ${license.last_name}`
        : undefined,
      status: license.status,
      assignedRoles: license.assigned_roles || [],
      permissions: license.permissions || [],
      activatedAt: license.activated_at?.toISOString(),
      expiresAt: license.expires_at?.toISOString(),
      lastUsedAt: license.last_used_at?.toISOString(),
      metadata: license.metadata,
      createdAt: license.created_at?.toISOString() || new Date().toISOString(),
      updatedAt: license.updated_at?.toISOString() || new Date().toISOString(),
    };
  }
}