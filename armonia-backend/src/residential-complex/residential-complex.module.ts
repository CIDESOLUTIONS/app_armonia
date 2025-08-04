import { Module } from '@nestjs/common';
import { ResidentialComplexService } from './residential-complex.service'; // Original path
import { ResidentialComplexController } from './residential-complex.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [ResidentialComplexService],
  controllers: [ResidentialComplexController],
  exports: [ResidentialComplexService],
})
export class ResidentialComplexModule {}