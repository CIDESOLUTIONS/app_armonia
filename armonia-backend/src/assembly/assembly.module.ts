import { Module } from '@nestjs/common';
import { AssemblyController } from './assembly.controller';
import { AssemblyService } from './assembly.service';
import { AssemblyGateway } from './assembly.gateway';
import { PrismaService } from '../prisma/prisma.service';
import { ActivityLogger } from '../lib/logging/activity-logger';
import { WebSocketService } from '../communications/websocket.service';
import { DigitalSignatureService } from '../common/services/digital-signature.service';
import { PrismaModule } from '../prisma/prisma.module';

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