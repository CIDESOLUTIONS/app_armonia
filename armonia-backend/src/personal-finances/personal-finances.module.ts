import { Module } from '@nestjs/common';
import { PersonalFinancesController } from './personal-finances.controller.js';
import { PersonalFinancesService } from './personal-finances.service.js';

@Module({
  controllers: [PersonalFinancesController],
  providers: [PersonalFinancesService],
})
export class PersonalFinancesModule {}
