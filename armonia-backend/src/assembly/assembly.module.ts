import { Module } from '@nestjs/common';
import { AssemblyController } from './assembly.controller';
import { AssemblyAdvancedService } from '../../src/services/assembly-advanced-service-impl';
import { AssemblyGateway } from './assembly.gateway';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogger } from '../../src/logging/activity-logger';
import { WebSocketService } from '../../src/communications/websocket-service';
import { DigitalSignatureService } from '../../src/services/digital-signature-service';

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
