import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../auth/jwt-auth.guard';
import { GetUser } from '../../common/decorators/user.decorator';
import { SurveysService } from './surveys.service';
import {
  CreateSurveyDto,
  UpdateSurveyDto,
  SurveyDto,
  SurveyFilterParamsDto,
  SubmitVoteDto,
} from '../../common/dto/surveys.dto';

@UseGuards(JwtAuthGuard)
@Controller('surveys')
export class SurveysController {
  constructor(private readonly surveysService: SurveysService) {}

  @Post()
  async createSurvey(
    @GetUser() user: any,
    @Body() createSurveyDto: CreateSurveyDto,
  ): Promise<SurveyDto> {
    return this.surveysService.createSurvey(
      user.schemaName,
      user.userId,
      createSurveyDto,
    );
  }

  @Get()
  async getSurveys(
    @GetUser() user: any,
    @Query() filters: SurveyFilterParamsDto,
  ): Promise<SurveyDto[]> {
    return this.surveysService.getSurveys(user.schemaName, filters);
  }

  @Get(':id')
  async getSurveyById(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<SurveyDto> {
    return this.surveysService.getSurveyById(user.schemaName, +id);
  }

  @Put(':id')
  async updateSurvey(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() updateSurveyDto: UpdateSurveyDto,
  ): Promise<SurveyDto> {
    return this.surveysService.updateSurvey(
      user.schemaName,
      +id,
      updateSurveyDto,
    );
  }

  @Delete(':id')
  async deleteSurvey(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<void> {
    return this.surveysService.deleteSurvey(user.schemaName, +id);
  }

  @Post('vote')
  async submitVote(
    @GetUser() user: any,
    @Body() submitVoteDto: SubmitVoteDto,
  ): Promise<void> {
    return this.surveysService.submitVote(user.schemaName, submitVoteDto);
  }

  @Get(':id/results')
  async getSurveyResults(
    @GetUser() user: any,
    @Param('id') id: string,
  ): Promise<SurveyDto> {
    return this.surveysService.getSurveyResults(user.schemaName, +id);
  }
}
