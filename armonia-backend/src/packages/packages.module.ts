import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller.js';
import { PackagesService } from './packages.service.js';
import { CommunicationsModule } from '../communications/communications.module.js';

@Module({
  imports: [CommunicationsModule],
  controllers: [PackagesController],
  providers: [PackagesService],
})
export class PackagesModule {}
