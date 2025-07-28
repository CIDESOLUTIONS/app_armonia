import { Module } from '@nestjs/common';
import { PersonalFinancesService } from './personal-finances.service.js';
import { PersonalFinancesController } from './personal-finances.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [PersonalFinancesService],
  controllers: [PersonalFinancesController],
  exports: [PersonalFinancesService],
})
export class PersonalFinancesModule {}
