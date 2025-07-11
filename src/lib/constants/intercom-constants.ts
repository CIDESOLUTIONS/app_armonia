/**
 * @fileoverview Constantes para el servicio de Intercom.
 * Define enums y configuraciones utilizadas en todo el sistema relacionadas con Intercom.
 */

/**
 * Estados de visita.
 * @enum {string}
 */
export const VisitStatus = {
  PENDING: "PENDING",
  APPROVED: "APPROVED",
  REJECTED: "REJECTED",
  COMPLETED: "COMPLETED",
  CANCELLED: "CANCELLED",
  IN_PROGRESS: "IN_PROGRESS",
  EXPIRED: "EXPIRED",
} as const;

export type VisitStatus = (typeof VisitStatus)[keyof typeof VisitStatus];

/**
 * Tipos de visitante.
 * @enum {string}
 */
export const VisitorType = {
  GUEST: "GUEST",
  DELIVERY: "DELIVERY",
  SERVICE: "SERVICE",
  STAFF: "STAFF",
  EMERGENCY: "EMERGENCY",
  OTHER: "OTHER",
} as const;

export type VisitorType = (typeof VisitorType)[keyof typeof VisitorType];

/**
 * Tipos de notificación.
 * @enum {string}
 */
export const NotificationType = {
  SMS: "SMS",
  EMAIL: "EMAIL",
  PUSH: "PUSH",
  CALL: "CALL",
  INTERCOM: "INTERCOM",
} as const;

export type NotificationType =
  (typeof NotificationType)[keyof typeof NotificationType];

/**
 * Tipos de acceso.
 * @enum {string}
 */
export const AccessType = {
  TEMPORARY: "TEMPORARY",
  PERMANENT: "PERMANENT",
  SCHEDULED: "SCHEDULED",
  EMERGENCY: "EMERGENCY",
} as const;

export type AccessType = (typeof AccessType)[keyof typeof AccessType];
