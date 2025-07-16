import { Module } from '@nestjs/common';
import { AssemblyController } from './assembly.controller';
import { AssemblyService } from './assembly.service';
import { AssemblyGateway } from './assembly.gateway';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [AssemblyController],
  providers: [
    AssemblyService,
    AssemblyGateway,
    PrismaClientManager,
    PrismaService,
  ],
})
export class AssemblyModule {}
