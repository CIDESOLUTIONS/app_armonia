import winston from 'winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { is } from 'date-fns/locale';

// Configuración de niveles de logging personalizados
const levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

// Configuración de colores para niveles de log
const colors = {
  error: 'red',
  warn: 'yellow',
  info: 'green',
  http: 'magenta',
  debug: 'blue',
};

winston.addColors(colors);

// Formato de log
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.colorize({ all: true }),
  winston.format.printf(
    (info) => `${info.timestamp} ${info.level}: ${info.message}`
  )
);

// Transportes de log
const transports = [
  // Consola
  new winston.transports.Console({
    format: logFormat,
    level: process.env.NODE_ENV === 'production' ? 'info' : 'debug',
  }),
  
  // Archivo de logs de error
  new DailyRotateFile({
    filename: 'logs/error-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'error',
    maxSize: '20m',
    maxFiles: '14d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  }),
  
  // Archivo de logs generales
  new DailyRotateFile({
    filename: 'logs/combined-%DATE%.log',
    datePattern: 'YYYY-MM-DD',
    level: 'info',
    maxSize: '20m',
    maxFiles: '30d',
    format: winston.format.combine(
      winston.format.timestamp(),
      winston.format.json()
    )
  })
];

// Crear logger
const logger = winston.createLogger({
  levels,
  transports,
  exitOnError: false,
});

// Interface para datos de log estructurados
interface LogData {
  message: string;
  level?: 'error' | 'warn' | 'info' | 'http' | 'debug';
  meta?: Record<string, any>;
}

export class ServerLogger {
  /**
   * Registrar log estructurado
   * @param data Datos del log
   */
  static log(data: LogData) {
    const { message, level = 'info', meta } = data;
    
    logger[level](message, { 
      ...meta,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }

  /**
   * Registrar error con stack trace
   * @param error Error a registrar
   * @param meta Metadatos adicionales
   */
  static error(error: Error | string, meta?: Record<string, any>) {
    const errorMessage = error instanceof Error ? error.message : error;
    const stack = error instanceof Error ? error.stack : undefined;

    logger.error(errorMessage, {
      ...meta,
      stack,
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }

  /**
   * Registrar evento de seguridad
   * @param event Evento de seguridad
   * @param meta Metadatos de seguridad
   */
  static security(event: string, meta?: Record<string, any>) {
    logger.warn(`SECURITY: ${event}`, {
      ...meta,
      type: 'security',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV
    });
  }

  /**
   * Registrar inicio de solicitud HTTP
   * @param req Solicitud
   */
  static httpRequest(req: {
    method: string;
    url: string;
    ip: string;
    user?: { id: number; email: string };
  }) {
    logger.http(`HTTP Request`, {
      method: req.method,
      url: req.url,
      ip: req.ip,
      userId: req.user?.id,
      userEmail: req.user?.email,
      timestamp: new Date().toISOString()
    });
  }
}
