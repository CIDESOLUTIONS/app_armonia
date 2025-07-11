/**
 * Integraciones del sistema de comunicaciones con el módulo financiero
 *
 * Este archivo proporciona funciones para enviar notificaciones automáticas
 * relacionadas con eventos del módulo financiero.
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { notifyUser, notifyByRole } from '@/lib/communications/notification-service';
import { getPrisma } from '@/lib/prisma';
const prisma = getPrisma();
/**
 * Envía notificación de nueva cuota generada
 */
export function notifyNewFee(userId, feeId, title, amount, dueDate, propertyUnit) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al residente específico
            yield notifyUser(userId, {
                type: 'info',
                title: 'Nueva cuota generada',
                message: `Se ha generado una nueva cuota: ${title} por valor de ${formatCurrency(amount)}. Fecha límite de pago: ${dueDate.toLocaleDateString()}.`,
                priority: 'medium',
                link: `/resident/payments/${feeId}`,
                data: {
                    feeId,
                    title,
                    amount,
                    dueDate: dueDate.toISOString(),
                    propertyUnit
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de nueva cuota:', error);
            throw error;
        }
    });
}
/**
 * Envía recordatorio de pago próximo a vencer
 */
export function notifyPaymentReminder(userId, feeId, title, amount, dueDate, daysRemaining) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al residente específico
            yield notifyUser(userId, {
                type: 'warning',
                title: 'Recordatorio de pago',
                message: `Su cuota "${title}" por valor de ${formatCurrency(amount)} vence en ${daysRemaining} días (${dueDate.toLocaleDateString()}). Por favor, realice el pago a tiempo.`,
                priority: 'high',
                link: `/resident/payments/${feeId}`,
                data: {
                    feeId,
                    title,
                    amount,
                    dueDate: dueDate.toISOString(),
                    daysRemaining
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar recordatorio de pago:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de pago vencido
 */
export function notifyOverdueFee(userId, feeId, title, amount, dueDate, daysOverdue) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al residente específico
            yield notifyUser(userId, {
                type: 'error',
                title: 'Pago vencido',
                message: `Su cuota "${title}" por valor de ${formatCurrency(amount)} está vencida por ${daysOverdue} días. Por favor, realice el pago lo antes posible para evitar recargos adicionales.`,
                priority: 'urgent',
                requireConfirmation: true,
                link: `/resident/payments/${feeId}`,
                data: {
                    feeId,
                    title,
                    amount,
                    dueDate: dueDate.toISOString(),
                    daysOverdue
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de pago vencido:', error);
            throw error;
        }
    });
}
/**
 * Envía confirmación de pago recibido
 */
export function notifyPaymentReceived(userId, paymentId, feeId, title, amount, method, reference) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al residente específico
            yield notifyUser(userId, {
                type: 'success',
                title: 'Pago recibido',
                message: `Su pago por ${formatCurrency(amount)} para la cuota "${title}" ha sido recibido y procesado correctamente. Método: ${getMethodName(method)}. Referencia: ${reference}.`,
                priority: 'medium',
                link: `/resident/payments/receipt/${paymentId}`,
                data: {
                    paymentId,
                    feeId,
                    title,
                    amount,
                    method,
                    reference
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar confirmación de pago:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de nuevo presupuesto aprobado
 */
export function notifyBudgetApproved(budgetId, year, month, totalIncome, totalExpense) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar a todos los residentes
            yield notifyByRole('resident', {
                type: 'info',
                title: `Presupuesto aprobado: ${getMonthName(month)} ${year}`,
                message: `El presupuesto para ${getMonthName(month)} ${year} ha sido aprobado. Ingresos: ${formatCurrency(totalIncome)}. Gastos: ${formatCurrency(totalExpense)}.`,
                priority: 'medium',
                link: `/resident/finances/budget/${budgetId}`,
                data: {
                    budgetId,
                    year,
                    month,
                    totalIncome,
                    totalExpense
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de presupuesto aprobado:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de recibo generado
 */
export function notifyReceiptGenerated(userId, receiptId, paymentId, title, amount) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar al residente específico
            yield notifyUser(userId, {
                type: 'info',
                title: 'Recibo disponible',
                message: `Su recibo para el pago de "${title}" por valor de ${formatCurrency(amount)} ya está disponible para descarga.`,
                priority: 'low',
                link: `/resident/payments/receipt/${receiptId}`,
                data: {
                    receiptId,
                    paymentId,
                    title,
                    amount
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de recibo generado:', error);
            throw error;
        }
    });
}
/**
 * Envía notificación de reporte financiero disponible
 */
export function notifyFinancialReportAvailable(reportId, title, period, type) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            // Notificar a todos los residentes
            yield notifyByRole('resident', {
                type: 'info',
                title: 'Reporte financiero disponible',
                message: `El reporte financiero "${title}" para el período ${period} ya está disponible para consulta.`,
                priority: 'low',
                link: `/resident/finances/reports/${reportId}`,
                data: {
                    reportId,
                    title,
                    period,
                    type
                }
            });
            return true;
        }
        catch (error) {
            console.error('Error al enviar notificación de reporte disponible:', error);
            throw error;
        }
    });
}
// Funciones auxiliares
function formatCurrency(amount) {
    return new Intl.NumberFormat('es-CO', {
        style: 'currency',
        currency: 'COP',
        minimumFractionDigits: 0
    }).format(amount);
}
function getMonthName(month) {
    const months = [
        'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
        'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];
    return months[month - 1] || '';
}
function getMethodName(method) {
    const methods = {
        'cash': 'Efectivo',
        'transfer': 'Transferencia',
        'check': 'Cheque',
        'card': 'Tarjeta'
    };
    return methods[method] || method;
}
