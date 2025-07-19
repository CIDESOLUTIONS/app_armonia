import {
  Controller,
  Post,
  Get,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';
import { SurveyService } from './survey.service';
import {
  CreateSurveyDto,
  UpdateSurveyDto,
  CreateAnswerDto,
} from '../../common/dto/surveys.dto';

@UseGuards(JwtAuthGuard)
@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  async createSurvey(
    @GetUser() user: any,
    @Body() createSurveyDto: CreateSurveyDto,
  ) {
    return this.surveyService.createSurvey(
      user.schemaName,
      user.userId,
      user.complexId,
      createSurveyDto,
    );
  }

  @Get()
  async getSurveys(@GetUser() user: any) {
    return this.surveyService.getSurveys(user.schemaName, user.complexId);
  }

  @Get(':id')
  async getSurveyById(@GetUser() user: any, @Param('id') id: string) {
    return this.surveyService.getSurveyById(user.schemaName, +id);
  }

  @Put(':id')
  async updateSurvey(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ) {
    return this.surveyService.updateSurvey(
      user.schemaName,
      +id,
      updateSurveyDto,
    );
  }

  @Delete(':id')
  async deleteSurvey(@GetUser() user: any, @Param('id') id: string) {
    return this.surveyService.deleteSurvey(user.schemaName, +id);
  }

  @Post(':id/answer')
  async submitAnswer(
    @GetUser() user: any,
    @Param('id') surveyId: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.surveyService.submitAnswer(
      user.schemaName,
      +surveyId,
      user.userId,
      createAnswerDto,
    );
  }

  @Get(':id/results')
  async getSurveyResults(@GetUser() user: any, @Param('id') id: string) {
    return this.surveyService.getSurveyResults(user.schemaName, +id);
  }
}
