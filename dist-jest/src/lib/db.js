var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { Pool } from 'pg';
import { ServerLogger } from './logging/server-logger';
let poolInstance = null;
/**
 * Obtiene una instancia de Pool para conexiones a PostgreSQL
 */
export function getPool() {
    if (!poolInstance) {
        ServerLogger.info('Creando nueva instancia de Pool para PostgreSQL');
        const connectionString = process.env.DATABASE_URL;
        if (!connectionString) {
            const error = new Error('DATABASE_URL no está definida en las variables de entorno');
            ServerLogger.error('Error al crear pool de conexiones', error);
            throw error;
        }
        poolInstance = new Pool({
            connectionString,
            max: 20, // Limite máximo de conexiones
            idleTimeoutMillis: 30000, // Tiempo de inactividad antes de cerrar conexiones
            connectionTimeoutMillis: 2000, // Tiempo máximo para conectar
        });
        // Manejo de errores en el pool
        poolInstance.on('error', (err) => {
            ServerLogger.error('Error inesperado en el pool de conexiones de PostgreSQL', err);
        });
    }
    return poolInstance;
}
// Exportar el pool para uso directo
export const pool = getPool();
/**
 * Cierra el pool de conexiones
 */
export function closePool() {
    return __awaiter(this, void 0, void 0, function* () {
        if (poolInstance) {
            yield poolInstance.end();
            poolInstance = null;
            ServerLogger.info('Pool de conexiones de PostgreSQL cerrado');
        }
    });
}
/**
 * Ejecuta una consulta dentro de una transacción
 */
export function executeTransaction(callback) {
    return __awaiter(this, void 0, void 0, function* () {
        const client = yield pool.connect();
        try {
            yield client.query('BEGIN');
            const _result = yield callback(client);
            yield client.query('COMMIT');
            return result;
        }
        catch (error) {
            yield client.query('ROLLBACK');
            ServerLogger.error('Error en transacción SQL', error);
            throw error;
        }
        finally {
            client.release();
        }
    });
}
