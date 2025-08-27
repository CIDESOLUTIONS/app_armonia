import {
  Controller,
  Post,
  Get,
  Put,
  Body,
  Param,
  Query,
  UploadedFile,
  UseInterceptors,
  UseGuards,
  BadRequestException,
  Logger,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiTags, ApiOperation, ApiResponse, ApiConsumes, ApiBearerAuth } from '@nestjs/swagger';
import { BankReconciliationService } from './bank-reconciliation.service';
import {
  BankStatementUploadDto,
  ReconciliationResultDto,
  ReconciliationSummaryDto,
  ManualReconciliationDto,
  ReconciliationFilterDto,
  ReconciliationConfigDto,
  ReconciliationStatus,
} from '@armonia-backend/common/dto/bank-reconciliation.dto';
import {
  ProcessReconciliationDto,
  ReconciliationStatsDto,
  BulkReconciliationDto,
} from './dto/reconciliation-process.dto';
import { TenantInterceptor } from '@armonia-backend/common/interceptors/tenant.interceptor';
import { GetUser } from '@armonia-backend/common/decorators/user.decorator';
import { JwtAuthGuard } from '@armonia-backend/auth/jwt-auth.guard';
import { RolesGuard } from '@armonia-backend/auth/roles.guard';
import { Roles } from '@armonia-backend/auth/roles.decorator';
import { Prisma, UserRole } from '@prisma/client';

@ApiTags('Conciliación Bancaria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('bank-reconciliation')
@UseInterceptors(TenantInterceptor)
export class BankReconciliationController {
  private readonly logger = new Logger(BankReconciliationController.name);

  constructor(private readonly bankReconciliationService: BankReconciliationService) {}

  @Post('upload')
  @ApiOperation({ summary: 'Subir extracto bancario' })
  @ApiConsumes('multipart/form-data')
  @ApiResponse({ status: 201, description: 'Extracto procesado exitosamente' })
  @UseInterceptors(FileInterceptor('file'))
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async uploadBankStatement(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: BankStatementUploadDto,
    @GetUser() user: any,
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Archivo requerido');
      }
      const residentialComplexId = user?.residentialComplexId;
      if (!residentialComplexId) {
        throw new BadRequestException('ID de conjunto residencial requerido');
      }

      const transactions = await this.bankReconciliationService.uploadBankStatement(
        file,
        uploadDto,
        residentialComplexId,
      );

      this.logger.log(`Extracto procesado: ${transactions.length} transacciones`);

      return {
        success: true,
        message: 'Extracto bancario procesado exitosamente',
        data: {
          transactionsCount: transactions.length,
          transactions,
        },
      };
    } catch (error) {
      this.logger.error(`Error subiendo extracto: ${error.message}`);
      throw error;
    }
  }

  @Post('reconcile')
  @ApiOperation({ summary: 'Ejecutar conciliación automática' })
  @ApiResponse({ status: 201, description: 'Conciliación completada', type: [ReconciliationResultDto] })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async reconcileTransactions(
    @Body() dto: ProcessReconciliationDto,
    @GetUser() user: any,
  ): Promise<{ success: boolean; message: string; data: ReconciliationResultDto[] }> {
    try {
      const residentialComplexId = user?.residentialComplexId;
      if (!residentialComplexId || !user.schemaName) {
        throw new BadRequestException('ID de conjunto o esquema de BD no encontrado en el token');
      }

      dto.residentialComplexId = residentialComplexId;

      const results = await this.bankReconciliationService.reconcileTransactions(dto, user.schemaName);

      const summary = {
        total: results.length,
        matched: results.filter((r) => r.status === ReconciliationStatus.MATCHED).length,
        unmatched: results.filter((r) => r.status === ReconciliationStatus.UNMATCHED).length,
        needsReview: results.filter((r) => r.status === ReconciliationStatus.MANUAL_REVIEW).length,
      };

      this.logger.log(`Conciliación completada: ${summary.matched}/${summary.total} coincidencias`);

      return {
        success: true,
        message: 'Conciliación completada exitosamente',
        data: results,
      };
    } catch (error) {
      this.logger.error(`Error en conciliación: ${error.message}`);
      throw error;
    }
  }

  @Post('manual-reconciliation')
  @ApiOperation({ summary: 'Conciliación manual de transacciones' })
  @ApiResponse({ status: 201, description: 'Conciliación manual completada' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async manualReconciliation(
    @Body() dto: ManualReconciliationDto,
    @GetUser() user: any,
  ): Promise<{ success: boolean; message: string; data: ReconciliationResultDto }> {
    try {
      if (!user.schemaName || !user.id) {
        throw new BadRequestException('Falta información del usuario en el token');
      }

      const result = await this.bankReconciliationService.manualReconciliation(dto, user.id, user.schemaName);

      this.logger.log(`Conciliación manual completada por usuario ${user.id}`);

      return {
        success: true,
        message: 'Conciliación manual completada exitosamente',
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error en conciliación manual: ${error.message}`);
      throw error;
    }
  }

  @Post('bulk-reconciliation')
  @ApiOperation({ summary: 'Procesamiento en lote de conciliaciones' })
  @ApiResponse({ status: 201, description: 'Procesamiento en lote completado' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async bulkReconciliation(
    @Body() dto: BulkReconciliationDto,
    @GetUser() user: any,
  ): Promise<{ success: boolean; message: string; data: { success: number; failed: number } }> {
    try {
      if (!user.id || !user.schemaName) {
        throw new BadRequestException('Falta información del usuario en el token');
      }

      const result = await this.bankReconciliationService.bulkReconciliation(dto, user.id, user.schemaName);

      this.logger.log(`Procesamiento en lote: ${result.success} éxitos, ${result.failed} fallos`);

      return {
        success: true,
        message: `Procesamiento completado: ${result.success} éxitos, ${result.failed} fallos`,
        data: result,
      };
    } catch (error) {
      this.logger.error(`Error en procesamiento en lote: ${error.message}`);
      throw error;
    }
  }

  @Get('results')
  @ApiOperation({ summary: 'Obtener resultados de conciliación con filtros' })
  @ApiResponse({ status: 200, description: 'Resultados obtenidos exitosamente' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getReconciliationResults(
    @Query() filter: ReconciliationFilterDto,
    @GetUser() user: any,
  ): Promise<{ success: boolean; data: ReconciliationResultDto[]; pagination: any }> {
    try {
      if (!user.schemaName) {
        throw new BadRequestException('Esquema de base de datos no encontrado');
      }
      const results = await this.bankReconciliationService.getReconciliationResults(filter, user.schemaName);

      return {
        success: true,
        data: results,
        pagination: {
          page: filter.page || 1,
          limit: filter.limit || 10,
          total: results.length, // Note: This is just the count of the current page, not total items.
        },
      };
    } catch (error) {
      this.logger.error(`Error obteniendo resultados: ${error.message}`);
      throw error;
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de conciliación' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente', type: ReconciliationStatsDto })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getReconciliationStats(
    @GetUser() user: any,
    @Query('periodStart') periodStart?: string,
    @Query('periodEnd') periodEnd?: string,
  ): Promise<{ success: boolean; data: ReconciliationStatsDto }> {
    try {
      const { residentialComplexId, schemaName } = user;
      if (!residentialComplexId || !schemaName) {
        throw new BadRequestException('Información del conjunto no encontrada en el token');
      }

      const stats = await this.bankReconciliationService.getReconciliationStats(
        residentialComplexId,
        schemaName,
        periodStart,
        periodEnd,
      );

      return {
        success: true,
        data: stats,
      };
    } catch (error) {
      this.logger.error(`Error obteniendo estadísticas: ${error.message}`);
      throw error;
    }
  }

  @Get('config')
  @ApiOperation({ summary: 'Obtener configuración de conciliación' })
  @ApiResponse({ status: 200, description: 'Configuración obtenida exitosamente' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getReconciliationConfig(): Promise<{ success: boolean; data: ReconciliationConfigDto }> {
    // In a real implementation, you would fetch this from a database
    const config: ReconciliationConfigDto = {
      amountTolerance: new Prisma.Decimal(0.01),
      dateTolerance: 3,
      autoMatch: true,
      matchingRules: ['exact_amount_date', 'amount_tolerance', 'reference_match', 'partial_match'],
    };

    return {
      success: true,
      data: config,
    };
  }

  @Put('config')
  @ApiOperation({ summary: 'Actualizar configuración de conciliación' })
  @ApiResponse({ status: 200, description: 'Configuración actualizada exitosamente' })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async updateReconciliationConfig(
    @Body() config: ReconciliationConfigDto,
    @GetUser() user: any,
  ): Promise<{ success: boolean; message: string; data: ReconciliationConfigDto }> {
    // In a real implementation, you would save this to a database
    this.logger.log(`Configuración actualizada por usuario ${user.id}`);
    return {
      success: true,
      message: 'Configuración actualizada exitosamente',
      data: config,
    };
  }

  @Get('summary/:reconciliationId')
  @ApiOperation({ summary: 'Obtener resumen de una conciliación específica' })
  @ApiResponse({ status: 200, description: 'Resumen obtenido exitosamente', type: ReconciliationSummaryDto })
  @Roles(UserRole.ADMIN, UserRole.SUPER_ADMIN)
  async getReconciliationSummary(
    @Param('reconciliationId') reconciliationId: string,
  ): Promise<{ success: boolean; data: ReconciliationSummaryDto }> {
    // This is a mock. In a real implementation, you would fetch this from the database.
    const summary: ReconciliationSummaryDto = {
      id: reconciliationId,
      totalTransactions: 0,
      matchedTransactions: 0,
      unmatchedTransactions: 0,
      totalAmount: new Prisma.Decimal(0),
      matchedAmount: new Prisma.Decimal(0),
      unmatchedAmount: new Prisma.Decimal(0),
      processedAt: new Date().toISOString(),
    };

    return {
      success: true,
      data: summary,
    };
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificar estado del servicio de conciliación' })
  @ApiResponse({ status: 200, description: 'Estado del servicio' })
  async getHealth(): Promise<{ success: boolean; message: string; timestamp: string }> {
    return {
      success: true,
      message: 'Servicio de conciliación bancaria operativo',
      timestamp: new Date().toISOString(),
    };
  }
}