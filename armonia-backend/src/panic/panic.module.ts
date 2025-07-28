import { Module } from '@nestjs/common';
import { PanicController } from './panic.controller.js';
import { PanicService } from './panic.service.js';
import { PanicGateway } from './panic.gateway.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PanicController],
  providers: [PanicService, PanicGateway, PrismaService],
  exports: [PanicGateway, PanicService],
})
export class PanicModule {}