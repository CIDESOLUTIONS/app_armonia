import { Module } from '@nestjs/common';
import { SecurityService } from './security.service.js';
import { SecurityController } from './security.controller.js';

@Module({
  providers: [SecurityService],
  controllers: [SecurityController],
})
export class SecurityModule {}
