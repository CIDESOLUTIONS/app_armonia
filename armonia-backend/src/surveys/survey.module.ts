import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller.js';
import { SurveyService } from './survey.service.js';
import { PrismaService } from '../prisma/prisma.service.js';
import { PrismaModule } from '../prisma/prisma.module.js';

@Module({
  imports: [PrismaModule],
  controllers: [SurveyController],
  providers: [SurveyService, PrismaService],
  exports: [SurveyService],
})
export class SurveyModule {}