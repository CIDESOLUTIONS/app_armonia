import { Module } from '@nestjs/common';
import { PqrController } from './pqr.controller.js';
import { PqrService } from './pqr.service.js';

@Module({
  controllers: [PqrController],
  providers: [PqrService],
})
export class PqrModule {}
