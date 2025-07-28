import { Module } from '@nestjs/common';
import { ResidentialComplexService } from './residential-complex.service.js';
import { ResidentialComplexController } from './residential-complex.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [ResidentialComplexService],
  controllers: [ResidentialComplexController],
  exports: [ResidentialComplexService],
})
export class ResidentialComplexModule {}
