import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

// DTO interface for consistency
interface LogEventData {
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  context?: any;
  stackTrace?: string;
  source: string;
  userId?: string;
  residentialComplexId?: string;
}

@Injectable()
export class MonitoringService {
  private readonly logger = new Logger(MonitoringService.name);

  constructor(private prisma: PrismaService) {}

  /**
   * Creates a new log event in the central LogEvent table.
   * These logs are not tenant-specific.
   * @param logData The data for the log event.
   */
  async createLogEvent(logData: LogEventData): Promise<void> {
    try {
      await this.prisma.logEvent.create({
        data: {
          level: logData.level,
          message: logData.message,
          context: logData.context || {},
          stackTrace: logData.stackTrace,
          source: logData.source,
          userId: logData.userId,
          // The schema requires residentialComplexId, but it might not always be available
          // This assumes the default schema can handle a null or placeholder value if needed
          // For a robust implementation, we ensure it's at least present.
          residentialComplexId: logData.residentialComplexId || 'GLOBAL', // Placeholder for global logs
        },
      });
    } catch (error) {
      // If logging itself fails, we log to console as a last resort.
      this.logger.error('Failed to write log event to database', error.stack);
    }
  }

  /**
   * Fetches log events from the database with optional filtering.
   */
  async getLogEvents(filters: { level?: string; source?: string; limit?: number }): Promise<any[]> {
    const { level, source, limit = 50 } = filters;
    return this.prisma.logEvent.findMany({
      where: {
        level: level || undefined,
        source: source || undefined,
      },
      orderBy: {
        timestamp: 'desc',
      },
      take: limit,
      include: {
        user: { select: { id: true, email: true } },
      },
    });
  }
}
