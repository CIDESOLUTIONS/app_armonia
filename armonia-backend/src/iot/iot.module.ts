import { Module } from '@nestjs/common';
import { IotController } from './iot.controller';
import { IotService } from './iot.service';
import { UtilityReadingService } from './utility-reading.service';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [IotController],
  providers: [IotService, UtilityReadingService, PrismaService],
  exports: [IotService, UtilityReadingService],
})
export class IotModule {}