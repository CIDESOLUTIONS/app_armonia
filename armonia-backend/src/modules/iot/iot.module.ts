import { Module } from '@nestjs/common';
import { PrismaModule } from '../prisma/prisma.module';
import { IoTController } from './iot.controller';
import {
  DevicesService,
  ReadingsService,
  AlertsService,
  AnalyticsService,
} from './services';

@Module({
  imports: [PrismaModule],
  controllers: [IoTController],
  providers: [
    DevicesService,
    ReadingsService,
    AlertsService,
    AnalyticsService,
  ],
  exports: [
    DevicesService,
    ReadingsService,
    AlertsService,
    AnalyticsService,
  ],
})
export class IoTModule {}
