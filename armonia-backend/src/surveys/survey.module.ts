import { Module } from '@nestjs/common';
import { SurveyController } from './survey.controller';
import { SurveyService } from './survey.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';

@Module({
  controllers: [SurveyController],
  providers: [SurveyService, PrismaClientManager, PrismaService],
  exports: [SurveyService],
})
export class SurveyModule {}
