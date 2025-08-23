import { Module } from '@nestjs/common';
import { AppAdminController } from './app-admin.controller';
import { AppAdminService } from './app-admin.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [AppAdminController],
  providers: [AppAdminService],
})
export class AppAdminModule {}
