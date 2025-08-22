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
  Request,
} from '@nestjs/common';
import { PlansService } from './plans.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { UserRole } from '../common/enums/user-role.enum';
import {
  CreatePlanDto,
  UpdatePlanDto,
  CreateSubscriptionDto,
  UpdateSubscriptionDto,
  CreateLicenseDto,
  UpdateLicenseDto,
  UsageTrackingDto,
  FeatureAccessCheckDto,
  PlanUpgradeDto,
  PlanDowngradeDto,
  BillingCycleChangeDto,
  PlanType,
} from '../common/dto/plans.dto';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('plans')
@Controller('plans')
export class PlansController {
  constructor(private readonly plansService: PlansService) {}

  // ========== PLAN MANAGEMENT ==========
  
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Crear plan' })
  @ApiResponse({ status: 201, description: 'Plan creado exitosamente' })
  createPlan(@Body() createPlanDto: CreatePlanDto) {
    return this.plansService.createPlan(createPlanDto);
  }

  @Get()
  @ApiOperation({ summary: 'Obtener todos los planes' })
  @ApiResponse({ status: 200, description: 'Planes obtenidos exitosamente' })
  findAllPlans(
    @Query('includeInactive') includeInactive?: string,
    @Query('type') type?: PlanType,
  ) {
    return this.plansService.findAllPlans(
      includeInactive === 'true',
      type,
    );
  }

  @Get(':id')
  @ApiOperation({ summary: 'Obtener plan por ID' })
  @ApiResponse({ status: 200, description: 'Plan obtenido exitosamente' })
  findPlanById(@Param('id') id: string) {
    return this.plansService.findPlanById(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Actualizar plan' })
  @ApiResponse({ status: 200, description: 'Plan actualizado exitosamente' })
  updatePlan(@Param('id') id: string, @Body() updatePlanDto: UpdatePlanDto) {
    return this.plansService.updatePlan(id, updatePlanDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Eliminar plan' })
  @ApiResponse({ status: 200, description: 'Plan eliminado exitosamente' })
  removePlan(@Param('id') id: string) {
    return this.plansService.removePlan(id);
  }

  // ========== SUBSCRIPTION MANAGEMENT ==========
  
  @Post('subscriptions')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  @ApiOperation({ summary: 'Crear suscripción' })
  @ApiResponse({ status: 201, description: 'Suscripción creada exitosamente' })
  createSubscription(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.plansService.createSubscription(createSubscriptionDto);
  }

  @Get('subscriptions/complex/:complexId')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener suscripciones por complejo' })
  @ApiResponse({ status: 200, description: 'Suscripciones obtenidas exitosamente' })
  findSubscriptionsByComplex(@Param('complexId') residentialComplexId: string) {
    return this.plansService.findSubscriptionsByComplex(residentialComplexId);
  }

  @Get('subscriptions/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener suscripción por ID' })
  @ApiResponse({ status: 200, description: 'Suscripción obtenida exitosamente' })
  getSubscriptionById(@Param('id') id: string) {
    return this.plansService.getSubscriptionById(id);
  }

  @Put('subscriptions/:id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  @ApiOperation({ summary: 'Actualizar suscripción' })
  @ApiResponse({ status: 200, description: 'Suscripción actualizada exitosamente' })
  updateSubscription(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.plansService.updateSubscription(id, updateSubscriptionDto);
  }

  // ========== LICENSE MANAGEMENT ==========
  
  @Post('licenses')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  @ApiOperation({ summary: 'Crear licencia' })
  @ApiResponse({ status: 201, description: 'Licencia creada exitosamente' })
  createLicense(@Body() createLicenseDto: CreateLicenseDto) {
    return this.plansService.createLicense(createLicenseDto);
  }

  @Get('licenses/:id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener licencia por ID' })
  @ApiResponse({ status: 200, description: 'Licencia obtenida exitosamente' })
  getLicenseById(@Param('id') id: string) {
    return this.plansService.getLicenseById(id);
  }

  @Put('licenses/:id')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  @ApiOperation({ summary: 'Actualizar licencia' })
  @ApiResponse({ status: 200, description: 'Licencia actualizada exitosamente' })
  updateLicense(
    @Param('id') id: string,
    @Body() updateLicenseDto: UpdateLicenseDto,
  ) {
    return this.plansService.updateLicense(id, updateLicenseDto);
  }

  // ========== USAGE TRACKING ==========
  
  @Post('usage/track')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Rastrear uso de funcionalidades' })
  @ApiResponse({ status: 200, description: 'Uso registrado exitosamente' })
  trackUsage(@Body() usageTrackingDto: UsageTrackingDto) {
    return this.plansService.trackUsage(usageTrackingDto);
  }

  @Post('features/check-access')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Verificar acceso a funcionalidad' })
  @ApiResponse({ status: 200, description: 'Acceso verificado' })
  checkFeatureAccess(@Body() checkDto: FeatureAccessCheckDto) {
    return this.plansService.checkFeatureAccess(checkDto);
  }

  // ========== PLAN CHANGES ==========
  
  @Post('subscriptions/:id/upgrade')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  @ApiOperation({ summary: 'Mejorar plan de suscripción' })
  @ApiResponse({ status: 200, description: 'Plan mejorado exitosamente' })
  upgradePlan(@Body() upgradeDto: PlanUpgradeDto) {
    return this.plansService.upgradePlan(upgradeDto);
  }

  @Post('subscriptions/:id/downgrade')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  @ApiOperation({ summary: 'Rebajar plan de suscripción' })
  @ApiResponse({ status: 200, description: 'Plan rebajado exitosamente' })
  downgradePlan(@Body() downgradeDto: PlanDowngradeDto) {
    return this.plansService.downgradePlan(downgradeDto);
  }

  @Post('subscriptions/:id/change-billing-cycle')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  @ApiOperation({ summary: 'Cambiar ciclo de facturación' })
  @ApiResponse({ status: 200, description: 'Ciclo cambiado exitosamente' })
  changeBillingCycle(@Body() changeDto: BillingCycleChangeDto) {
    return this.plansService.changeBillingCycle(changeDto);
  }

  // ========== ANALYTICS ==========
  
  @Get('analytics/subscriptions')
  @UseGuards(JwtAuthGuard, RolesGuard([UserRole.ADMIN]))
  @ApiOperation({ summary: 'Obtener analíticas de suscripciones' })
  @ApiResponse({ status: 200, description: 'Analíticas obtenidas exitosamente' })
  getSubscriptionAnalytics() {
    return this.plansService.getSubscriptionAnalytics();
  }

  // ========== CONFIGURATION ==========
  
  @Get('features/available')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener funcionalidades disponibles' })
  @ApiResponse({ status: 200, description: 'Funcionalidades obtenidas' })
  getAvailableFeatures() {
    // This would return a list of all available features in the system
    return {
      features: [
        {
          name: 'user_management',
          displayName: 'Gestión de Usuarios',
          description: 'Crear y gestionar usuarios del sistema',
          category: 'administration',
        },
        {
          name: 'financial_management',
          displayName: 'Gestión Financiera',
          description: 'Módulo completo de finanzas y pagos',
          category: 'finance',
        },
        {
          name: 'document_management',
          displayName: 'Gestión de Documentos',
          description: 'Almacenamiento y control de documentos',
          category: 'documents',
        },
        {
          name: 'iot_integration',
          displayName: 'Integración IoT',
          description: 'Dispositivos IoT y telemetría',
          category: 'technology',
        },
        {
          name: 'advanced_analytics',
          displayName: 'Analíticas Avanzadas',
          description: 'Reportes y dashboards avanzados',
          category: 'analytics',
        },
        {
          name: 'api_access',
          displayName: 'Acceso API',
          description: 'Integración vía API REST',
          category: 'integration',
        },
        {
          name: 'white_labeling',
          displayName: 'Marca Blanca',
          description: 'Personalización de marca e identidad',
          category: 'branding',
        },
        {
          name: 'multitenancy',
          displayName: 'Multi-Tenancy',
          description: 'Soporte para múltiples complejos',
          category: 'architecture',
        },
      ],
    };
  }

  @Get('usage-limits/types')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Obtener tipos de límites de uso' })
  @ApiResponse({ status: 200, description: 'Tipos de límites obtenidos' })
  getUsageLimitTypes() {
    return {
      types: [
        {
          type: 'USERS',
          displayName: 'Usuarios',
          description: 'Número máximo de usuarios en el sistema',
          unit: 'usuarios',
        },
        {
          type: 'PROPERTIES',
          displayName: 'Propiedades',
          description: 'Número máximo de propiedades registradas',
          unit: 'propiedades',
        },
        {
          type: 'DOCUMENTS',
          displayName: 'Documentos',
          description: 'Número máximo de documentos almacenados',
          unit: 'documentos',
        },
        {
          type: 'STORAGE',
          displayName: 'Almacenamiento',
          description: 'Espacio máximo de almacenamiento',
          unit: 'GB',
        },
        {
          type: 'API_CALLS',
          displayName: 'Llamadas API',
          description: 'Número máximo de llamadas API por mes',
          unit: 'llamadas/mes',
        },
        {
          type: 'PAYMENTS',
          displayName: 'Pagos',
          description: 'Número máximo de transacciones de pago',
          unit: 'pagos/mes',
        },
        {
          type: 'REPORTS',
          displayName: 'Reportes',
          description: 'Número máximo de reportes generados',
          unit: 'reportes/mes',
        },
      ],
    };
  }
}