import { Module } from '@nestjs/common';
import { StaffController } from './staff.controller.js';
import { UserService } from '../user/user.service'; // Restored original path
import { PrismaService } from '../prisma/prisma.service';
import { PrismaModule } from '../prisma/prisma.module';

@Module({
  imports: [PrismaModule],
  controllers: [StaffController],
  providers: [UserService, PrismaService],
  exports: [UserService],
})
export class StaffModule {}
