import { Module } from '@nestjs/common';
import { PanicController } from './panic.controller';
import { PanicService } from './panic.service';
import { PanicGateway } from './panic.gateway';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [PanicController],
  providers: [PanicService, PanicGateway, PrismaClientManager, PrismaService],
  exports: [PanicGateway, PanicService],
})
export class PanicModule {}
