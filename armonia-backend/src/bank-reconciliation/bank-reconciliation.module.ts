import { Module } from '@nestjs/common';
import { BankReconciliationController } from './bank-reconciliation.controller';
import { BankReconciliationService } from './bank-reconciliation.service';
import { PrismaModule } from '../prisma/prisma.module';

/**
 * Módulo de Conciliación Bancaria
 * 
 * Proporciona funcionalidades para:
 * - Subida y procesamiento de extractos bancarios (CSV, Excel, PDF)
 * - Conciliación automática con algoritmos de matching inteligente
 * - Conciliación manual para casos especiales
 * - Estadísticas y reportes de conciliación
 * - Configuración flexible de reglas de matching
 * - Procesamiento en lote de transacciones
 * 
 * Características técnicas:
 * - Algoritmos de matching por monto, fecha, referencia y descripción
 * - Tolerancias configurables para mejorar la precisión
 * - Manejo de múltiples formatos de archivo
 * - Integración con el sistema de pagos existente
 * - Logs detallados para auditoría
 */
@Module({
  imports: [
    PrismaModule, // Para acceso a la base de datos
  ],
  controllers: [BankReconciliationController],
  providers: [BankReconciliationService],
  exports: [BankReconciliationService], // Exportar para uso en otros módulos
})
export class BankReconciliationModule {
  constructor() {
    console.log('✅ BankReconciliationModule inicializado correctamente');
  }
}