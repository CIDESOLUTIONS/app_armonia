import { Module } from '@nestjs/common';
import { AssemblyController } from './assembly.controller.js';
import { AssemblyService } from './assembly.service.js';
import { AssemblyGateway } from './assembly.gateway.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { ActivityLogger } from '../lib/logging/activity-logger.js';
import { WebSocketService } from '../communications/websocket.service.js';
import { DigitalSignatureService } from '../common/services/digital-signature.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [AssemblyController],
  providers: [
    AssemblyService,
    AssemblyGateway,
    PrismaService,
    ActivityLogger,
    WebSocketService,
    DigitalSignatureService,
  ],
  exports: [AssemblyService] // Export AssemblyService if it's used by other modules
})
export class AssemblyModule {}