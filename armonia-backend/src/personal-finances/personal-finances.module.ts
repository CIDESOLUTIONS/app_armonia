import { Module } from '@nestjs/common';
import { PersonalFinancesService } from './personal-finances.service';
import { PersonalFinancesController } from './personal-finances.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [PersonalFinancesService],
  controllers: [PersonalFinancesController],
  exports: [PersonalFinancesService],
})
export class PersonalFinancesModule {}
