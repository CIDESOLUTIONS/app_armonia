import { Module } from '@nestjs/common';
import { CommunicationsService } from './communications.service.js';
import { CommunicationsController } from './communications.controller.js';

@Module({
  providers: [CommunicationsService],
  controllers: [CommunicationsController],
  exports: [CommunicationsService],
})
export class CommunicationsModule {}
