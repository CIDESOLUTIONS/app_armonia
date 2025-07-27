import { Module } from '@nestjs/common';
import { PanicController } from './panic.controller';
import { PanicService } from './panic.service';
import { PanicGateway } from './panic.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [PanicController],
  providers: [PanicService, PanicGateway, PrismaService],
  exports: [PanicGateway, PanicService],
})
export class PanicModule {}
