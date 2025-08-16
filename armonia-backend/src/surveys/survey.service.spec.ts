
import { Test, TestingModule } from '@nestjs/testing';
import { SurveyService } from './survey.service';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { SurveyStatus, QuestionType } from '../common/dto/surveys.dto';

// Mock dependencies
const mockPrismaClient = {
  survey: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  question: {
    create: jest.fn(),
    createMany: jest.fn(),
    deleteMany: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  answer: {
    create: jest.fn(),
    findMany: jest.fn(),
    deleteMany: jest.fn(),
  },
};

describe('SurveyService', () => {
  let service: SurveyService;
  let prisma: PrismaService;

  beforeEach(async () => {
    const testModule: TestingModule = await Test.createTestingModule({
      providers: [
        SurveyService,
        {
          provide: PrismaService,
          useValue: mockPrismaClient,
        },
      ],
    }).compile();

    service = testModule.get<SurveyService>(SurveyService);
    prisma = testModule.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSurvey', () => {
    it('should create a new survey with questions', async () => {
      const mockSurvey = {
        id: '1',
        title: 'Test Survey',
        description: 'Desc',
        residentialComplexId: '123',
        createdById: '1',
        status: SurveyStatus.DRAFT,
        startDate: new Date().toISOString(), // Return Date object
        endDate: new Date().toISOString(), // Return Date object
        questions: [],
      };
      mockPrismaClient.survey.create.mockResolvedValue(mockSurvey);

      const createSurveyDto = {
        title: 'Test Survey',
        description: 'Desc',
        startDate: new Date().toISOString(), // Pass Date object
        endDate: new Date().toISOString(), // Pass Date object
        questions: [
          {
            text: 'Q1',
            type: QuestionType.SINGLE_CHOICE,
            options: ['A', 'B'],
            order: 0,
          },
        ],
        residentialComplexId: '123',
        createdById: '1',
      };

      const result = await service.createSurvey(
        'test_schema',
        '1',
        '123',
        createSurveyDto,
      );

      expect(result).toEqual(mockSurvey);
      expect(mockPrismaClient.survey.create).toHaveBeenCalledWith({
        data: {
          title: 'Test Survey',
          description: 'Desc',
          residentialComplexId: '123',
          createdById: '1',
          status: SurveyStatus.DRAFT,
          startDate: expect.any(String),
          endDate: expect.any(String),
          questions: {
            create: [
              {
                text: 'Q1',
                type: QuestionType.SINGLE_CHOICE,
                options: ['A', 'B'],
                order: 0,
              },
            ],
          },
        },
        include: { questions: true },
      });
    });
  });

  describe('getSurveys', () => {
    it('should return a list of surveys for a complex', async () => {
      const mockSurveys = [
        {
          id: '1',
          title: 'Survey 1',
          residentialComplexId: '123',
          questions: [],
        },
        {
          id: '2',
          title: 'Survey 2',
          residentialComplexId: '123',
          questions: [],
        },
      ];
      mockPrismaClient.survey.findMany.mockResolvedValue(mockSurveys);

      const result = await service.getSurveys('test_schema', '123');

      expect(result).toEqual(mockSurveys);
      expect(mockPrismaClient.survey.findMany).toHaveBeenCalledWith({
        where: { residentialComplexId: '123' },
        include: { questions: true },
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getSurveyById', () => {
    it('should return a single survey by ID', async () => {
      const mockSurvey = { id: '1', title: 'Test Survey', questions: [] };
      mockPrismaClient.survey.findUnique.mockResolvedValue(mockSurvey);

      const result = await service.getSurveyById('test_schema', '1');

      expect(result).toEqual(mockSurvey);
      expect(mockPrismaClient.survey.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { questions: true },
      });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaClient.survey.findUnique.mockResolvedValue(null);

      await expect(service.getSurveyById('test_schema', '999')).rejects.toThrow(
        new NotFoundException(`Encuesta con ID 999 no encontrada.`),
      );
    });
  });

  describe('updateSurvey', () => {
    it('should update an existing survey and its questions', async () => {
      const existingSurvey = {
        id: '1',
        title: 'Old Title',
        description: 'Old Desc',
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        questions: [
          {
            id: '10',
            text: 'Old Q',
            type: QuestionType.TEXT,
            options: [],
            order: 0,
          },
        ],
      };
      const updatedSurvey = {
        ...existingSurvey,
        title: 'New Title',
        description: 'New Desc',
        questions: [
          {
            id: '11',
            text: 'New Q',
            type: QuestionType.TEXT,
            options: [],
            order: 0,
          },
        ],
      };

      mockPrismaClient.survey.findUnique.mockResolvedValue(existingSurvey);
      mockPrismaClient.survey.update.mockResolvedValue(updatedSurvey);
      mockPrismaClient.question.deleteMany.mockResolvedValue({ count: 1 });
      mockPrismaClient.question.createMany.mockResolvedValue({ count: 1 });

      const updateSurveyDto = {
        title: 'New Title',
        description: 'New Desc',
        startDate: new Date().toISOString(), // Pass Date object
        endDate: new Date().toISOString(), // Pass Date object
        questions: [
          { text: 'New Q', type: QuestionType.TEXT, options: [], order: 0 },
        ],
      };

      const result = await service.updateSurvey(
        'test_schema',
        '1',
        updateSurveyDto,
      );

      expect(result).toEqual(updatedSurvey);
      expect(mockPrismaClient.survey.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: {
          title: 'New Title',
          description: 'New Desc',
          startDate: expect.any(String),
          endDate: expect.any(String),
          // questions are handled separately, so they should not be in the data object for survey update
        },
        include: { questions: true },
      });
      expect(mockPrismaClient.question.deleteMany).toHaveBeenCalledWith({
        where: { surveyId: '1' },
      });
      expect(mockPrismaClient.question.createMany).toHaveBeenCalledWith({
        data: [
          {
            surveyId: '1',
            text: 'New Q',
            type: QuestionType.TEXT,
            options: [],
            order: 0,
          },
        ],
      });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaClient.survey.findUnique.mockResolvedValue(null);

      await expect(
        service.updateSurvey('test_schema', '999', { title: 'New Title' }),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteSurvey', () => {
    it('should delete an existing survey', async () => {
      const existingSurvey = { id: '1' };
      mockPrismaClient.survey.findUnique.mockResolvedValue(existingSurvey);
      mockPrismaClient.survey.delete.mockResolvedValue(existingSurvey);
      mockPrismaClient.answer.deleteMany.mockResolvedValue({ count: 0 });
      mockPrismaClient.question.deleteMany.mockResolvedValue({ count: 0 });

      await service.deleteSurvey('test_schema', '1');

      expect(mockPrismaClient.answer.deleteMany).toHaveBeenCalledWith({
        where: { question: { surveyId: '1' } },
      });
      expect(mockPrismaClient.question.deleteMany).toHaveBeenCalledWith({
        where: { surveyId: '1' },
      });
      expect(mockPrismaClient.survey.delete).toHaveBeenCalledWith({
        where: { id: '1' },
      });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaClient.survey.findUnique.mockResolvedValue(null);

      await expect(service.deleteSurvey('test_schema', '999')).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('submitAnswer', () => {
    it('should submit an answer to a survey question', async () => {
      const mockSurvey = {
        id: '1',
        status: SurveyStatus.PUBLISHED,
        questions: [
          {
            id: '10',
            text: 'Q1',
            type: QuestionType.SINGLE_CHOICE,
            options: ['A', 'B'],
          },
        ],
      };
      const mockAnswer = {
        id: '100',
        questionId: '10',
        userId: '1',
        selectedOptions: ['A'],
      };

      mockPrismaClient.survey.findUnique.mockResolvedValue(mockSurvey);
      mockPrismaClient.answer.create.mockResolvedValue(mockAnswer);

      const createAnswerDto = {
        questionId: '10',
        selectedOptions: ['A'],
      };

      const result = await service.submitAnswer(
        'test_schema',
        '1',
        '1',
        createAnswerDto,
      );

      expect(result).toEqual(mockAnswer);
      expect(mockPrismaClient.answer.create).toHaveBeenCalledWith({
        data: {
          questionId: '10',
          userId: '1',
          textAnswer: undefined,
          selectedOptions: ['A'],
          rating: undefined,
          answeredAt: expect.any(Date),
        },
      });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaClient.survey.findUnique.mockResolvedValue(null);

      await expect(
        service.submitAnswer('test_schema', '999', '1', {
          questionId: '1',
          selectedOptions: ['A'],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error if survey not published', async () => {
      const mockSurvey = { id: '1', status: SurveyStatus.DRAFT, questions: [] };
      mockPrismaClient.survey.findUnique.mockResolvedValue(mockSurvey);

      await expect(
        service.submitAnswer('test_schema', '1', '1', {
          questionId: '1',
          selectedOptions: ['A'],
        }),
      ).rejects.toThrow('La encuesta no está publicada o ya ha finalizado.');
    });

    it('should throw NotFoundException if question not found in survey', async () => {
      const mockSurvey = {
        id: '1',
        status: SurveyStatus.PUBLISHED,
        questions: [
          {
            id: '10',
            text: 'Q1',
            type: QuestionType.SINGLE_CHOICE,
            options: ['A', 'B'],
          },
        ],
      };
      mockPrismaClient.survey.findUnique.mockResolvedValue(mockSurvey);

      await expect(
        service.submitAnswer('test_schema', '1', '1', {
          questionId: '999',
          selectedOptions: ['A'],
        }),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw error for invalid option', async () => {
      const mockSurvey = {
        id: '1',
        status: SurveyStatus.PUBLISHED,
        questions: [
          {
            id: '10',
            text: 'Q1',
            type: QuestionType.SINGLE_CHOICE,
            options: ['A', 'B'],
          },
        ],
      };
      mockPrismaClient.survey.findUnique.mockResolvedValue(mockSurvey);

      await expect(
        service.submitAnswer('test_schema', '1', '1', {
          questionId: '10',
          selectedOptions: ['C'],
        }),
      ).rejects.toThrow("Opción 'C' no válida para la pregunta.");
    });
  });

  describe('getSurveyResults', () => {
    it('should return survey results', async () => {
      const mockSurvey = {
        id: '1',
        title: 'Test Survey',
        description: 'Desc',
        status: SurveyStatus.PUBLISHED,
        startDate: new Date().toISOString(),
        endDate: new Date().toISOString(),
        questions: [
          {
            id: '10',
            text: 'Q1',
            type: QuestionType.SINGLE_CHOICE,
            options: ['A', 'B'],
            answers: [
              {
                id: '100',
                questionId: '10',
                userId: '1',
                selectedOptions: ['A'],
              },
              {
                id: '101',
                questionId: '10',
                userId: '2',
                selectedOptions: ['A'],
              },
            ],
          },
          {
            id: '11',
            text: 'Q2',
            type: QuestionType.TEXT,
            options: [],
            answers: [
              {
                id: '102',
                questionId: '11',
                userId: '1',
                textAnswer: 'Text Answer',
              },
            ],
          },
        ],
      };
      const mockAnswers = [
        { id: '100', questionId: '10', userId: '1', selectedOptions: ['A'] },
        { id: '101', questionId: '10', userId: '2', selectedOptions: ['A'] },
        { id: '102', questionId: '11', userId: '1', textAnswer: 'Text Answer' },
      ];

      mockPrismaClient.survey.findUnique.mockResolvedValue(mockSurvey);
      mockPrismaClient.answer.findMany.mockResolvedValue(mockAnswers);

      const result = await service.getSurveyResults('test_schema', '1');

      expect(result).toEqual({
        surveyId: '1',
        title: 'Test Survey',
        description: 'Desc',
        status: SurveyStatus.PUBLISHED,
        startDate: expect.any(String),
        endDate: expect.any(String),
        totalResponses: 2,
        questions: [
          {
            questionId: '10',
            text: 'Q1',
            type: QuestionType.SINGLE_CHOICE,
            totalAnswers: 2,
            optionCounts: { A: 2, B: 0 },
          },
          {
            questionId: '11',
            text: 'Q2',
            type: QuestionType.TEXT,
            totalAnswers: 1,
            textAnswers: ['Text Answer'],
          },
        ],
      });
      expect(mockPrismaClient.survey.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: { questions: { include: { answers: true } } },
      });
      expect(mockPrismaClient.answer.findMany).toHaveBeenCalledWith({
        where: { question: { surveyId: '1' } },
      });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaClient.survey.findUnique.mockResolvedValue(null);

      await expect(
        service.getSurveyResults('test_schema', '999'),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
