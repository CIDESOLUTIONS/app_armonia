// src/lib/logging/server-logger.ts
/**
 * Módulo para logging en el servidor
 * Este archivo sirve como stub para las pruebas unitarias
 */
/**
 * Logger para el servidor
 */
export const ServerLogger = {
    /**
     * Registra un mensaje de información
     * @param message Mensaje a registrar
     * @param meta Metadatos adicionales
     */
    info: (message, meta) => {
        console.log(`[INFO] ${message}`, meta || '');
    },
    /**
     * Registra un mensaje de error
     * @param message Mensaje a registrar
     * @param error Error o metadatos adicionales
     */
    error: (message, error) => {
        console.error(`[ERROR] ${message}`, error || '');
    },
    /**
     * Registra un mensaje de advertencia
     * @param message Mensaje a registrar
     * @param meta Metadatos adicionales
     */
    warn: (message, meta) => {
        console.warn(`[WARN] ${message}`, meta || '');
    },
    /**
     * Registra un mensaje de depuración
     * @param message Mensaje a registrar
     * @param meta Metadatos adicionales
     */
    debug: (message, meta) => {
        console.debug(`[DEBUG] ${message}`, meta || '');
    }
};
