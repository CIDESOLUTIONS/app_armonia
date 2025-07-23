import { Module } from '@nestjs/common';
import { AssemblyController } from './assembly.controller';
import { AssemblyAdvancedService } from '../services/assembly-advanced-service-impl';
import { AssemblyGateway } from './assembly.gateway';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogger } from '../lib/logging/activity-logger';
import { WebSocketService } from '../communications/websocket.service';
import { DigitalSignatureService } from '../common/services/digital-signature.service';

@Module({
  controllers: [AssemblyController],
  providers: [
    AssemblyAdvancedService,
    AssemblyGateway,
    PrismaClientManager,
    PrismaService,
    ActivityLogger,
    WebSocketService,
    DigitalSignatureService,
  ],
})
export class AssemblyModule {}
