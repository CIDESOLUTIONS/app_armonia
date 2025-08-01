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
import { SurveyService } from './survey.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { GetUser } from '../common/decorators/user.decorator';
import {
  CreateSurveyDto,
  UpdateSurveyDto,
  CreateAnswerDto,
} from '../common/dto/surveys.dto';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { UserRole } from '../common/enums/user-role.enum';

@UseGuards(JwtAuthGuard)
@Controller('surveys')
export class SurveyController {
  constructor(private readonly surveyService: SurveyService) {}

  @Post()
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  createSurvey(@GetUser() user: any, @Body() createSurveyDto: CreateSurveyDto) {
    return this.surveyService.createSurvey(
      user.schemaName,
      user.userId,
      user.complexId,
      createSurveyDto,
    );
  }

  @Get()
  getSurveys(@GetUser() user: any) {
    return this.surveyService.getSurveys(user.schemaName, user.complexId);
  }

  @Get(':id')
  getSurveyById(@GetUser() user: any, @Param('id') id: string) {
    return this.surveyService.getSurveyById(user.schemaName, +id);
  }

  @Put(':id')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  updateSurvey(
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
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  deleteSurvey(@GetUser() user: any, @Param('id') id: string) {
    return this.surveyService.deleteSurvey(user.schemaName, +id);
  }

  @Post(':id/answers')
  submitAnswer(
    @GetUser() user: any,
    @Param('id') id: string,
    @Body() createAnswerDto: CreateAnswerDto,
  ) {
    return this.surveyService.submitAnswer(
      user.schemaName,
      +id,
      user.userId,
      createAnswerDto,
    );
  }

  @Get(':id/results')
  @UseGuards(RolesGuard([UserRole.ADMIN, UserRole.COMPLEX_ADMIN]))
  getSurveyResults(@GetUser() user: any, @Param('id') id: string) {
    return this.surveyService.getSurveyResults(user.schemaName, +id);
  }
}
