import { Module } from '@nestjs/common';
import { PersonalFinancesController } from './personal-finances.controller';
import { PersonalFinancesService } from './personal-finances.service';

@Module({
  controllers: [PersonalFinancesController],
  providers: [PersonalFinancesService],
})
export class PersonalFinancesModule {}
