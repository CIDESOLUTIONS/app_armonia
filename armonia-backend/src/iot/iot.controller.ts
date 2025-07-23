import { Controller, Get, Post, Body, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import { IotService } from './iot.service';
import {
  SmartMeterReadingDto,
  SmartMeterFilterParamsDto,
  AutomatedBillingDto,
} from '../common/dto/iot.dto';

@UseGuards(JwtAuthGuard)
@Controller('iot')
export class IotController {
  constructor(private readonly iotService: IotService) {}

  @Post('smart-meters/readings')
  async recordSmartMeterReading(
    @GetUser() user: any,
    @Body() smartMeterReadingDto: SmartMeterReadingDto,
  ): Promise<SmartMeterReadingDto> {
    return this.iotService.recordSmartMeterReading(
      user.schemaName,
      smartMeterReadingDto,
    );
  }

  @Get('smart-meters/readings')
  async getSmartMeterReadings(
    @GetUser() user: any,
    @Query() filters: SmartMeterFilterParamsDto,
  ): Promise<SmartMeterReadingDto[]> {
    return this.iotService.getSmartMeterReadings(user.schemaName, filters);
  }

  @Post('automated-billing/trigger')
  async triggerAutomatedBilling(
    @GetUser() user: any,
    @Body() automatedBillingDto: AutomatedBillingDto,
  ): Promise<any> {
    return this.iotService.triggerAutomatedBilling(
      user.schemaName,
      automatedBillingDto,
    );
  }
}
