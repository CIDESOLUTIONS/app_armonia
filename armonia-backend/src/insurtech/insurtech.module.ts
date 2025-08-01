import { Module } from '@nestjs/common';
import { InsurtechService } from './insurtech.service';
import { InsurtechController } from './insurtech.controller';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  providers: [InsurtechService],
  controllers: [InsurtechController],
  exports: [InsurtechService],
})
export class InsurtechModule {}
