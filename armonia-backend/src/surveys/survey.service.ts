import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSurveyDto,
  UpdateSurveyDto,
  SurveyDto,
  CreateAnswerDto,
  SurveyStatus,
  QuestionType,
} from '../common/dto/surveys.dto';

@Injectable()
export class SurveyService {
  constructor(private prisma: PrismaService) {}

  async createSurvey(
    schemaName: string,
    userId: string, // Changed to string
    residentialComplexId: string, // Renamed from complexId and changed to string
    data: CreateSurveyDto,
  ): Promise<SurveyDto> {
    const prisma: any = this.prisma;
    const { questions, ...surveyData } = data;
    const survey = await prisma.survey.create({
      data: {
        ...surveyData,
        residentialComplexId, // Use residentialComplexId
        createdById: userId, // Use createdById
        status: SurveyStatus.DRAFT,
        questions: {
          create: questions.map((q, index) => ({
            text: q.text,
            type: q.type,
            options: q.options || [],
            order: index,
          })),
        },
      },
      include: { questions: true },
    });
    return survey;
  }

  async getSurveys(
    schemaName: string,
    residentialComplexId: string, // Renamed from complexId
  ): Promise<SurveyDto[]> {
    const prisma: any = this.prisma;
    return prisma.survey.findMany({
      where: { residentialComplexId }, // Use residentialComplexId
      include: { questions: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getSurveyById(schemaName: string, id: string): Promise<SurveyDto> { // Changed id to string
    const prisma: any = this.prisma;
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: { questions: true },
    });
    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${id} no encontrada.`);
    }
    return survey;
  }

  async updateSurvey(
    schemaName: string,
    id: string, // Changed id to string
    data: UpdateSurveyDto,
  ): Promise<SurveyDto> {
    const prisma: any = this.prisma;
    const { questions, ...surveyData } = data;

    const survey = await prisma.survey.findUnique({ where: { id } });
    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${id} no encontrada.`);
    }

    // Handle questions update: delete old, create new
    if (questions) {
      await prisma.question.deleteMany({ where: { surveyId: id } });
      await prisma.question.createMany({
        data: questions.map((q, index) => ({
          surveyId: id,
          text: q.text,
          type: q.type,
          options: q.options || [],
          order: index,
        })),
      });
    }

    const updatedSurvey = await prisma.survey.update({
      where: { id },
      data: surveyData,
      include: { questions: true },
    });
    return updatedSurvey;
  }

  async deleteSurvey(schemaName: string, id: string): Promise<void> { // Changed id to string
    const prisma: any = this.prisma;
    const survey = await prisma.survey.findUnique({ where: { id } });
    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${id} no encontrada.`);
    }
    await prisma.answer.deleteMany({ where: { question: { surveyId: id } } });
    await prisma.question.deleteMany({ where: { surveyId: id } });
    await prisma.survey.delete({ where: { id } });
  }

  async submitAnswer(
    schemaName: string,
    surveyId: string, // Changed surveyId to string
    userId: string, // Changed userId to string
    data: CreateAnswerDto,
  ): Promise<any> {
    const prisma: any = this.prisma;
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: { questions: true },
    });

    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${surveyId} no encontrada.`);
    }
    if (survey.status !== SurveyStatus.PUBLISHED) {
      throw new Error('La encuesta no está publicada o ya ha finalizado.');
    }

    const question = survey.questions.find((q) => q.id === data.questionId);
    if (!question) {
      throw new NotFoundException(
        `Pregunta con ID ${data.questionId} no encontrada en esta encuesta.`,
      );
    }

    // Basic validation based on question type
    if (
      question.type === QuestionType.SINGLE_CHOICE ||
      question.type === QuestionType.MULTIPLE_CHOICE
    ) {
      if (!data.selectedOptions || data.selectedOptions.length === 0) {
        throw new Error('Debe seleccionar al menos una opción.');
      }
      for (const option of data.selectedOptions) {
        if (!question.options.includes(option)) {
          throw new Error(`Opción '${option}' no válida para la pregunta.`);
        }
      }
    } else if (question.type === QuestionType.TEXT) {
      if (!data.textAnswer || data.textAnswer.trim() === '') {
        throw new Error('La respuesta de texto no puede estar vacía.');
      }
    } else if (question.type === QuestionType.RATING) {
      if (data.rating === undefined || data.rating < 1 || data.rating > 5) {
        throw new Error('La calificación debe ser un número entre 1 y 5.');
      }
    }

    const answer = await prisma.answer.create({
      data: {
        questionId: data.questionId,
        userId,
        textAnswer: data.textAnswer,
        selectedOptions: data.selectedOptions || [],
        rating: data.rating,
        answeredAt: new Date(),
      },
    });
    return answer;
  }

  async getSurveyResults(schemaName: string, surveyId: string): Promise<any> { // Changed surveyId to string
    const prisma: any = this.prisma;
    const survey = await prisma.survey.findUnique({
      where: { id: surveyId },
      include: {
        questions: {
          include: { answers: true },
        },
      },
    });

    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${surveyId} no encontrada.`);
    }

    const results: any = {
      surveyId: survey.id,
      title: survey.title,
      description: survey.description,
      status: survey.status,
      startDate: survey.startDate,
      endDate: survey.endDate,
      totalResponses: 0,
      questions: [],
    };

    const allAnswers = await prisma.answer.findMany({
      where: { question: { surveyId: surveyId } },
    });
    results.totalResponses = new Set(allAnswers.map((a) => a.userId)).size; // Unique users who answered

    for (const question of survey.questions) {
      const questionResults: any = {
        questionId: question.id,
        text: question.text,
        type: question.type,
        totalAnswers: question.answers.length,
      };

      if (
        question.type === QuestionType.SINGLE_CHOICE ||
        question.type === QuestionType.MULTIPLE_CHOICE
      ) {
        const optionCounts: { [key: string]: number } = {};
        question.options.forEach((option) => (optionCounts[option] = 0));
        question.answers.forEach((answer) => {
          answer.selectedOptions?.forEach((option) => {
            if (optionCounts[option] !== undefined) {
              optionCounts[option]++;
            }
          });
        });
        questionResults.optionCounts = optionCounts;
      } else if (question.type === QuestionType.RATING) {
        const totalRating = question.answers.reduce(
          (sum, answer) => sum + (answer.rating || 0),
          0,
        );
        questionResults.averageRating =
          question.answers.length > 0
            ? totalRating / question.answers.length
            : 0;
      } else if (question.type === QuestionType.TEXT) {
        questionResults.textAnswers = question.answers.map(
          (answer) => answer.textAnswer,
        );
      }
      results.questions.push(questionResults);
    }

    return results;
  }
}