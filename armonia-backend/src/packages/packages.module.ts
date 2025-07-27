import { Module } from '@nestjs/common';
import { PackagesController } from './packages.controller';
import { PackagesService } from './packages.service';
import { PrismaService } from '../prisma/prisma.service';
import { CommunicationsModule } from '../communications/communications.module';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [CommunicationsModule, PrismaModule],
  controllers: [PackagesController],
  providers: [PackagesService, PrismaService],
  exports: [PackagesService]
})
export class PackagesModule {}