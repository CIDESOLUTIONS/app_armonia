import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller.js';
import { UserService } from '../user/user.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [StaffController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class StaffModule {}
