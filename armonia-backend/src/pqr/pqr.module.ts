import { Module } from '@nestjs/common';
import { PqrService } from './pqr.service.js';
import { PqrController } from './pqr.controller.js';

@Module({
  providers: [PqrService],
  controllers: [PqrController],
})
export class PqrModule {}
