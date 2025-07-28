import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller.js';
import { PackagesService } from './packages.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { CommunicationsModule } from '../communications/communications.module.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [CommunicationsModule, PrismaModule],
  controllers: [PackagesController],
  providers: [PackagesService, PrismaService],
  exports: [PackagesService]
})
export class PackagesModule {}
