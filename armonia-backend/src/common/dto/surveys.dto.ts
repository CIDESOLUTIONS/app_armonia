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
  @IsNumber()
  id: number;

  @IsNumber()
  surveyId: number;

  @IsString()
  text: string;

  @IsEnum(QuestionType)
  type: QuestionType;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  options?: string[];

  @IsNumber()
  order: number;
}

export class AnswerDto {
  @IsNumber()
  id: number;

  @IsNumber()
  questionId: number;

  @IsNumber()
  userId: number;

  @IsOptional()
  @IsString()
  textAnswer?: string;

  @IsOptional()
  @IsString({ each: true })
  selectedOptions?: string[];

  @IsOptional()
  @IsNumber()
  rating?: number;

  @IsDateString()
  answeredAt: Date;
}

export class SurveyDto {
  @IsNumber()
  id: number;

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

  @IsNumber()
  complexId: number;

  @IsNumber()
  createdBy: number;

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
  @IsNumber()
  questionId: number;

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
