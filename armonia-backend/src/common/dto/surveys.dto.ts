import {
  IsString,
  IsNumber,
  IsOptional,
  IsDateString,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { Type } from 'class-transformer';

export enum SurveyStatus {
  DRAFT = 'DRAFT',
  PUBLISHED = 'PUBLISHED',
  CLOSED = 'CLOSED',
}

export enum QuestionType {
  SINGLE_CHOICE = 'SINGLE_CHOICE',
  MULTIPLE_CHOICE = 'MULTIPLE_CHOICE',
  TEXT = 'TEXT',
  RATING = 'RATING',
}

export class QuestionDto {
  @IsString()
  id: string;

  @IsString()
  surveyId: string;

  @IsString()
  text: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];
}

export class AnswerDto {
  @IsString()
  id: string;

  @IsString()
  questionId: string;

  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  textAnswer?: string;

  @IsOptional()
  @IsString({ each: true })
  selectedOptions?: string[];

  @IsOptional()
  @IsNumber()
  rating?: number;
}

export class SurveyDto {
  @IsString()
  id: string;

  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsEnum(SurveyStatus)
  status: SurveyStatus;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: QuestionDto[];

  @IsString()
  residentialComplexId: string; // Renamed from complexId

  @IsString()
  createdById: string; // Renamed from createdBy

  @IsDateString()
  createdAt: Date;

  @IsDateString()
  updatedAt: Date;
}

export class CreateSurveyDto {
  @IsString()
  title: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions: Omit<QuestionDto, 'id' | 'surveyId'>[];

  @IsString()
  residentialComplexId: string;

  @IsString()
  createdById: string;
}

export class UpdateSurveyDto {
  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsEnum(SurveyStatus)
  status?: SurveyStatus;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionDto)
  questions?: Omit<QuestionDto, 'id' | 'surveyId'>[];
}

export class CreateAnswerDto {
  @IsString()
  questionId: string;

  @IsOptional()
  @IsString()
  textAnswer?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  selectedOptions?: string[];

  @IsOptional()
  @IsNumber()
  rating?: number;
}