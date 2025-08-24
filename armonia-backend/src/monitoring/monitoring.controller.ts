import { Controller, Post, Body, UseGuards, Req, Get, Query } from '@nestjs/common';
import { MonitoringService } from './monitoring.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { ApiTags, ApiOperation, ApiQuery } from '@nestjs/swagger';

// Basic DTO for incoming log events
class LogEventDto {
  level: 'INFO' | 'WARN' | 'ERROR' | 'DEBUG';
  message: string;
  context?: any;
  stackTrace?: string;
  source: string; // e.g., 'frontend', 'backend-billing'
}

@ApiTags('Monitoring')
@Controller('monitoring')
@UseGuards(JwtAuthGuard)
export class MonitoringController {
  constructor(private readonly monitoringService: MonitoringService) {}

  @Post('log')
  @ApiOperation({ summary: 'Submit a log event' })
  async createLogEvent(@Body() logEventDto: LogEventDto, @GetUser() user: any) {
    // Associate the log with the user and their complex if available
    const enrichedLog = {
      ...logEventDto,
      userId: user?.id,
      residentialComplexId: user?.residentialComplexId,
    };
    return this.monitoringService.createLogEvent(enrichedLog);
  }

  @Get('logs')
  @ApiOperation({ summary: 'Get log events' })
  @ApiQuery({ name: 'level', required: false, type: String })
  @ApiQuery({ name: 'source', required: false, type: String })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async getLogEvents(
    @Query('level') level?: string,
    @Query('source') source?: string,
    @Query('limit') limit?: number,
  ) {
    return this.monitoringService.getLogEvents({ level, source, limit });
  }
}
