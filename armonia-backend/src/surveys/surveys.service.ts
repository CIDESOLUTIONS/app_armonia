import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateSurveyDto,
  UpdateSurveyDto,
  SurveyDto,
  SurveyFilterParamsDto,
  SubmitVoteDto,
  SurveyStatus,
} from '../common/dto/surveys.dto';

@Injectable()
export class SurveysService {
  constructor(
    private prismaClientManager: PrismaClientManager,
    private prisma: PrismaService,
  ) {}

  private getTenantPrismaClient(schemaName: string) {
    return this.prismaClientManager.getClient(schemaName);
  }

  async createSurvey(
    schemaName: string,
    userId: number,
    data: CreateSurveyDto,
  ): Promise<SurveyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    return prisma.survey.create({
      data: {
        ...data,
        createdBy: userId,
        questions: {
          create: data.questions.map((q) => ({
            text: q.text,
            options: { create: q.options },
          })),
        },
      },
      include: { questions: { include: { options: true } } },
    });
  }

  async getSurveys(
    schemaName: string,
    filters: SurveyFilterParamsDto,
  ): Promise<SurveyDto[]> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const where: any = {};

    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: 'insensitive' } },
        { description: { contains: filters.search, mode: 'insensitive' } },
      ];
    }
    if (filters.status) {
      where.status = filters.status;
    }
    if (filters.startDate) {
      where.startDate = { gte: new Date(filters.startDate) };
    }
    if (filters.endDate) {
      where.endDate = { lte: new Date(filters.endDate) };
    }

    return prisma.survey.findMany({
      where,
      skip: (filters.page - 1) * filters.limit || 0,
      take: filters.limit || 10,
      orderBy: { createdAt: 'desc' },
      include: { questions: { include: { options: true } } },
    });
  }

  async getSurveyById(schemaName: string, id: number): Promise<SurveyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: { questions: { include: { options: true } } },
    });
    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${id} no encontrada.`);
    }
    return survey;
  }

  async updateSurvey(
    schemaName: string,
    id: number,
    data: UpdateSurveyDto,
  ): Promise<SurveyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const survey = await prisma.survey.findUnique({ where: { id } });

    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${id} no encontrada.`);
    }

    // Handle nested updates for questions and options if necessary
    // This example assumes simple updates without complex nested logic
    return prisma.survey.update({
      where: { id },
      data: {
        title: data.title,
        description: data.description,
        status: data.status,
        startDate: data.startDate,
        endDate: data.endDate,
        // Questions and options would require more complex update logic
      },
      include: { questions: { include: { options: true } } },
    });
  }

  async deleteSurvey(schemaName: string, id: number): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    await prisma.survey.delete({ where: { id } });
  }

  async submitVote(schemaName: string, data: SubmitVoteDto): Promise<void> {
    const prisma = this.getTenantPrismaClient(schemaName);
    // In a real scenario, you'd also check if the user has already voted
    // and if the survey is active.
    await prisma.vote.create({
      data: {
        surveyId: data.surveyId,
        questionId: data.questionId,
        optionId: data.optionId,
        userId: data.userId,
      },
    });

    // Increment vote count for the option (if you store it denormalized)
    await prisma.option.update({
      where: { id: data.optionId },
      data: { votes: { increment: 1 } },
    });
  }

  async getSurveyResults(schemaName: string, id: number): Promise<SurveyDto> {
    const prisma = this.getTenantPrismaClient(schemaName);
    const survey = await prisma.survey.findUnique({
      where: { id },
      include: {
        questions: {
          include: {
            options: { include: { votes: true } }, // Include votes if stored separately
          },
        },
      },
    });

    if (!survey) {
      throw new NotFoundException(`Encuesta con ID ${id} no encontrada.`);
    }

    // Aggregate votes if not denormalized
    const results = { ...survey };
    results.questions = await Promise.all(
      survey.questions.map(async (q) => {
        const optionsWithCounts = await Promise.all(
          q.options.map(async (opt) => {
            const voteCount = await prisma.vote.count({
              where: { optionId: opt.id },
            });
            return { ...opt, votes: voteCount };
          }),
        );
        return { ...q, options: optionsWithCounts };
      }),
    );

    return results;
  }
}
