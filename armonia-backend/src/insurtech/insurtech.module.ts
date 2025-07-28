import { Module } from '@nestjs/common';
import { InsurtechService } from './insurtech.service.js';
import { InsurtechController } from './insurtech.controller.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  providers: [InsurtechService],
  controllers: [InsurtechController],
  exports: [InsurtechService],
})
export class InsurtechModule {}
