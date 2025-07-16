import { Module } from '@nestjs/common';
import { PqrService } from './pqr.service';
import { PqrController } from './pqr.controller';

@Module({
  providers: [PqrService],
  controllers: [PqrController],
})
export class PqrModule {}
