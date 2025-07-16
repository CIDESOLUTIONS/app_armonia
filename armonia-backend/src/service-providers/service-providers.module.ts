import { Module } from '@nestjs/common';
import { ServiceProvidersController } from './service-providers.controller';
import { ServiceProvidersService } from './service-providers.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [ServiceProvidersController],
  providers: [ServiceProvidersService, PrismaClientManager, PrismaService],
})
export class ServiceProvidersModule {}
