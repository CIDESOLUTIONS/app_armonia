import { Module } from '@nestjs/common';
import { PanicController } from './panic.controller';
import { PanicService } from './panic.service';
import { CommunicationsModule } from '../communications/communications.module';

@Module({
  imports: [CommunicationsModule],
  controllers: [PanicController],
  providers: [PanicService],
})
export class PanicModule {}
