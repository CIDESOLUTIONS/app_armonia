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
  Request,
  BadRequestException,
  Logger
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
  ReconciliationConfigDto
} from '../../common/dto/bank-reconciliation.dto';
import {
  ProcessReconciliationDto,
  ReconciliationStatsDto,
  BulkReconciliationDto
} from './dto/reconciliation-process.dto';
import { TenantInterceptor } from '../../common/interceptors/tenant.interceptor';
import { GetUser } from '../../common/decorators/user.decorator';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { RolesGuard } from '../../auth/roles.guard';
import { Roles } from '../../auth/roles.decorator';
import { UserRole } from '../../common/enums/user-role.enum';
@ApiTags('Conciliación Bancaria')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard([UserRole.COMPLEX_ADMIN, UserRole.ADMIN]))
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
  async uploadBankStatement(
    @UploadedFile() file: Express.Multer.File,
    @Body() uploadDto: BankStatementUploadDto,
    @GetUser
  ) {
    try {
      if (!file) {
        throw new BadRequestException('Archivo requerido');
      }
      if (!user.schemaName) {
        throw new BadRequestException('Esquema de base de datos no encontrado');
      }
      const residentialComplexId = req.user?.residentialComplexId;
      if (!residentialComplexId) {
        throw new BadRequestException('ID de conjunto residencial requerido');
      }

      const transactions = await this.bankReconciliationService.uploadBankStatement(
        file,
        uploadDto,
        residentialComplexId
      );

      this.logger.log(`Extracto procesado: ${transactions.length} transacciones`);
      
      return {
        success: true,
        message: 'Extracto bancario procesado exitosamente',
        data: {
          transactionsCount: transactions.length,
          transactions
        }
      };
    } catch (error) {
      this.logger.error(`Error subiendo extracto: ${error.message}`);
      throw error;
    }
  }

  @Post('reconcile')
  @ApiOperation({ summary: 'Ejecutar conciliación automática' })
  @ApiResponse({ status: 201, description: 'Conciliación completada', type: [ReconciliationResultDto] })
  async reconcileTransactions(
    @Body() dto: ProcessReconciliationDto,
    @Request() req: any
  ): Promise<{ success: boolean; message: string; data: ReconciliationResultDto[] }> {
    try {
      const residentialComplexId = req.user?.residentialComplexId || dto.residentialComplexId;
      if (!residentialComplexId) {
        throw new BadRequestException('ID de conjunto residencial requerido');
      }

      dto.residentialComplexId = residentialComplexId;
      
      const results = await this.bankReconciliationService.reconcileTransactions(dto, User.schemaName);
      
      const summary = {
        total: results.length,
        matched: results.filter(r => r.status === 'MATCHED').length,
        unmatched: results.filter(r => r.status === 'UNMATCHED').length,
        needsReview: results.filter(r => r.status === 'MANUAL_REVIEW').length
      };

      this.logger.log(`Conciliación completada: ${summary.matched}/${summary.total} coincidencias`);
      
      return {
        success: true,
        message: 'Conciliación completada exitosamente',
        data: results
      };
    } catch (error) {
      this.logger.error(`Error en conciliación: ${error.message}`);
      throw error;
    }
  }

  @Post('manual-reconciliation')
  @ApiOperation({ summary: 'Conciliación manual de transacciones' })
  @ApiResponse({ status: 201, description: 'Conciliación manual completada' })
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async manualReconciliation(
    @Body() dto: ManualReconciliationDto,
    @GetUser() user: any
  ): Promise<{ success: boolean; message: string; data: ReconciliationResultDto }> {
    try {
      if (!user.schemaName) {
        throw new BadRequestException('Esquema de base de datos no encontrado');
      }

      const userId = req.user?.id;
      if (!userId) {
        throw new BadRequestException('Usuario no autenticado');
      }

      const result = await this.bankReconciliationService.manualReconciliation(dto, userId,  user.schemaName);
      
      this.logger.log(`Conciliación manual completada por usuario ${userId}`);
      
      return {
        success: true,
        message: 'Conciliación manual completada exitosamente',
        data: result
      };
    } catch (error) {
      this.logger.error(`Error en conciliación manual: ${error.message}`);
      throw error;
    }
  }

  @Post('bulk-reconciliation')
  @ApiOperation({ summary: 'Procesamiento en lote de conciliaciones' })
  @ApiResponse({ status: 201, description: 'Procesamiento en lote completado' })
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async bulkReconciliation(
    @Body() dto: BulkReconciliationDto,
    @GetUser() user: any
  ): Promise<{ success: boolean; message: string; data: { success: number; failed: number } }> {
    try {
      const userId = user.id;
      if (!userId) {
        throw new BadRequestException('Usuario no autenticado');
      }

      const result = await this.bankReconciliationService.bulkReconciliation(dto, userId, user.schemaName);
      
      this.logger.log(`Procesamiento en lote: ${result.success} éxitos, ${result.failed} fallos`);
      
      return {
        success: true,
        message: `Procesamiento completado: ${result.success} éxitos, ${result.failed} fallos`,
        data: result
      };
    } catch (error) {
      this.logger.error(`Error en procesamiento en lote: ${error.message}`);
      throw error;
    }
  }

  @Get('results')
  @ApiOperation({ summary: 'Obtener resultados de conciliación con filtros' })
  @ApiResponse({ status: 200, description: 'Resultados obtenidos exitosamente' })
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getReconciliationResults(
    @Query() filter: ReconciliationFilterDto
  ): Promise<{ success: boolean; data: ReconciliationResultDto[]; pagination: any }> {
    try {
      const results = await this.bankReconciliationService.getReconciliationResults(filter);
      
      return {
        success: true,
        data: results,
        pagination: {
          page: filter.page || 1,
          limit: filter.limit || 10,
          total: results.length
        }
      };
    } catch (error) {
      this.logger.error(`Error obteniendo resultados: ${error.message}`);
      throw error;
    }
  }

  @Get('stats')
  @ApiOperation({ summary: 'Obtener estadísticas de conciliación' })
  @ApiResponse({ status: 200, description: 'Estadísticas obtenidas exitosamente', type: ReconciliationStatsDto })
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getReconciliationStats(
    @Query('periodStart') periodStart?: string,
    @Query('periodEnd') periodEnd?: string,
    @GetUser() user?: any
  ): Promise<{ success: boolean; data: ReconciliationStatsDto }> {
    try {
      const residentialComplexId = user.residentialComplexId;
      if (!residentialComplexId) {
        throw new BadRequestException('ID de conjunto residencial requerido');
      }

      const stats = await this.bankReconciliationService.getReconciliationStats(
        residentialComplexId,
        periodStart,
        periodEnd
      );
      
      return {
        success: true,
        data: stats
      };
    } catch (error) {
      this.logger.error(`Error obteniendo estadísticas: ${error.message}`);
      throw error;
    }
  }

  @Get('config')
  @ApiOperation({ summary: 'Obtener configuración de conciliación' })
  @ApiResponse({ status: 200, description: 'Configuración obtenida exitosamente' })
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getReconciliationConfig(): Promise<{ success: boolean; data: ReconciliationConfigDto }> {
    try {
      // Retornar configuración por defecto
      const config: ReconciliationConfigDto = {
        amountTolerance: 0.01,
        dateTolerance: 3,
        autoMatch: true,
        matchingRules: [
          'exact_amount_date',
          'amount_tolerance',
          'reference_match',
          'partial_match'
        ]
      };
      
      return {
        success: true,
        data: config
      };
    } catch (error) {
      this.logger.error(`Error obteniendo configuración: ${error.message}`);
      throw error;
    }
  }

  @Put('config')
  @ApiOperation({ summary: 'Actualizar configuración de conciliación' })
  @ApiResponse({ status: 200, description: 'Configuración actualizada exitosamente' })
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async updateReconciliationConfig(
    @Body() config: ReconciliationConfigDto,
    @GetUser() user: any
  ): Promise<{ success: boolean; message: string; data: ReconciliationConfigDto }> {
    try {
      const userId = user.id;
      if (!userId) {
        throw new BadRequestException('Usuario no autenticado');
      }

      // En una implementación real, guardarías la configuración en base de datos
      this.logger.log(`Configuración actualizada por usuario ${userId}`);
      
      return {
        success: true,
        message: 'Configuración actualizada exitosamente',
        data: config
      };
    } catch (error) {
      this.logger.error(`Error actualizando configuración: ${error.message}`);
      throw error;
    }
  }

  @Get('summary/:reconciliationId')
  @ApiOperation({ summary: 'Obtener resumen de una conciliación específica' })
  @ApiResponse({ status: 200, description: 'Resumen obtenido exitosamente', type: ReconciliationSummaryDto })
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getReconciliationSummary(
    @Param('reconciliationId') reconciliationId: string
  ): Promise<{ success: boolean; data: ReconciliationSummaryDto }> {
    try {
      // En una implementación real, buscarías el resumen en base de datos
      const summary: ReconciliationSummaryDto = {
        id: reconciliationId,
        totalTransactions: 0,
        matchedTransactions: 0,
        unmatchedTransactions: 0,
        totalAmount: 0,
        matchedAmount: 0,
        unmatchedAmount: 0,
        processedAt: new Date().toISOString()
      };
      
      return {
        success: true,
        data: summary
      };
    } catch (error) {
      this.logger.error(`Error obteniendo resumen: ${error.message}`);
      throw error;
    }
  }

  @Get('health')
  @ApiOperation({ summary: 'Verificar estado del servicio de conciliación' })
  @ApiResponse({ status: 200, description: 'Estado del servicio' })
  @Roles(UserRole.COMPLEX_ADMIN, UserRole.ADMIN)
  async getHealth(): Promise<{ success: boolean; message: string; timestamp: string }> {
    return {
      success: true,
      message: 'Servicio de conciliación bancaria operativo',
      timestamp: new Date().toISOString()
    };
  }
}