import { Module } from '@nestjs/common';
import { PanicController } from './panic.controller.js';
import { PanicService } from './panic.service.js';
import { CommunicationsModule } from '../communications/communications.module.js';

@Module({
  imports: [CommunicationsModule],
  controllers: [PanicController],
  providers: [PanicService],
})
export class PanicModule {}
