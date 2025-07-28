import { Module } from '@nestjs/common';
import { IotController } from './iot.controller.js';
import { IotService } from './iot.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [IotController],
  providers: [IotService, PrismaService],
})
export class IotModule {}