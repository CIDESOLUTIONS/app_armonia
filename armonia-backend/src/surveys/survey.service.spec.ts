import { SurveyService } from './survey.service';
import { vi } from 'vitest';
import { NotFoundException } from '@nestjs/common';

// Mock dependencies
const mockPrismaClient = {
  survey: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  question: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  option: {
    create: vi.fn(),
    findMany: vi.fn(),
    findUnique: vi.fn(),
    update: vi.fn(),
    delete: vi.fn(),
  },
  userVote: {
    create: vi.fn(),
    findMany: vi.fn(),
  },
  answer: {
    deleteMany: vi.fn(),
  },
};

const mockPrismaClientManager = {
  getClient: vi.fn(() => mockPrismaClient),
};

const mockPrismaService = {
  // Mock global PrismaService methods if needed
};

describe('SurveyService', () => {
  let service: SurveyService;

  beforeEach(() => {
    vi.clearAllMocks();
    service = new SurveyService(
      mockPrismaClientManager as any,
      mockPrismaService as any,
    );
    (service as any).prismaClientManager = mockPrismaClientManager;
    (service as any).prisma = mockPrismaService;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createSurvey', () => {
    it('should create a new survey', async () => {
      const mockSurvey = { id: 1, title: 'Test Survey', description: 'Desc', status: 'DRAFT' };
      mockPrismaClient.survey.create.mockResolvedValue(mockSurvey);

      const result = await service.createSurvey('test_schema', { title: 'Test Survey', description: 'Desc', questions: [] });

      expect(result).toEqual(mockSurvey);
      expect(mockPrismaClient.survey.create).toHaveBeenCalledWith({
        data: { title: 'Test Survey', description: 'Desc', questions: { create: [] } },
      });
    });
  });

  describe('getSurveys', () => {
    it('should return a list of surveys', async () => {
      const mockSurveys = [
        { id: 1, title: 'Survey 1' },
        { id: 2, title: 'Survey 2' },
      ];
      mockPrismaClient.survey.findMany.mockResolvedValue(mockSurveys);

      const result = await service.getSurveys('test_schema', {});

      expect(result).toEqual(mockSurveys);
      expect(mockPrismaClient.survey.findMany).toHaveBeenCalledWith({
        where: {},
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
      });
    });
  });

  describe('getSurveyById', () => {
    it('should return a single survey by ID', async () => {
      const mockSurvey = { id: 1, title: 'Test Survey' };
      mockPrismaClient.survey.findUnique.mockResolvedValue(mockSurvey);

      const result = await service.getSurveyById('test_schema', 1);

      expect(result).toEqual(mockSurvey);
      expect(mockPrismaClient.survey.findUnique).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaClient.survey.findUnique.mockResolvedValue(null);

      await expect(service.getSurveyById('test_schema', 999)).rejects.toThrow(new NotFoundException(`Encuesta con ID 999 no encontrada.`));
    });
  });

  describe('updateSurvey', () => {
    it('should update an existing survey', async () => {
      const existingSurvey = { id: 1, title: 'Old Title' };
      const updatedSurvey = { ...existingSurvey, title: 'New Title' };
      mockPrismaClient.survey.findUnique.mockResolvedValue(existingSurvey);
      mockPrismaClient.survey.update.mockResolvedValue(updatedSurvey);

      const result = await service.updateSurvey('test_schema', 1, { title: 'New Title' });

      expect(result).toEqual(updatedSurvey);
      expect(mockPrismaClient.survey.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { title: 'New Title' },
      });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaClient.survey.findUnique.mockResolvedValue(null);

      await expect(service.updateSurvey('test_schema', 999, { title: 'New Title' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteSurvey', () => {
    it('should delete an existing survey', async () => {
      const existingSurvey = { id: 1 };
      mockPrismaClient.survey.findUnique.mockResolvedValue(existingSurvey);
      mockPrismaClient.survey.delete.mockResolvedValue(existingSurvey);

      await service.deleteSurvey('test_schema', 1);

      expect(mockPrismaClient.survey.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaClient.survey.findUnique.mockResolvedValue(null);

      await expect(service.deleteSurvey('test_schema', 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createQuestion', () => {
    it('should create a new question for a survey', async () => {
      const mockQuestion = { id: 1, surveyId: 1, text: 'Question 1' };
      mockPrismaClient.question.create.mockResolvedValue(mockQuestion);

      const result = await service.createQuestion('test_schema', 1, { text: 'Question 1' });

      expect(result).toEqual(mockQuestion);
      expect(mockPrismaClient.question.create).toHaveBeenCalledWith({
        data: { surveyId: 1, text: 'Question 1' },
      });
    });
  });

  describe('updateQuestion', () => {
    it('should update an existing question', async () => {
      const existingQuestion = { id: 1, surveyId: 1, text: 'Old Question' };
      const updatedQuestion = { ...existingQuestion, text: 'New Question' };
      mockPrismaClient.question.findUnique.mockResolvedValue(existingQuestion);
      mockPrismaClient.question.update.mockResolvedValue(updatedQuestion);

      const result = await service.updateQuestion('test_schema', 1, { text: 'New Question' });

      expect(result).toEqual(updatedQuestion);
      expect(mockPrismaClient.question.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { text: 'New Question' },
      });
    });

    it('should throw NotFoundException if question not found', async () => {
      mockPrismaClient.question.findUnique.mockResolvedValue(null);

      await expect(service.updateQuestion('test_schema', 999, { text: 'New Question' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteQuestion', () => {
    it('should delete an existing question', async () => {
      const existingQuestion = { id: 1 };
      mockPrismaClient.question.findUnique.mockResolvedValue(existingQuestion);
      mockPrismaClient.question.delete.mockResolvedValue(existingQuestion);

      await service.deleteQuestion('test_schema', 1);

      expect(mockPrismaClient.question.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if question not found', async () => {
      mockPrismaClient.question.findUnique.mockResolvedValue(null);

      await expect(service.deleteQuestion('test_schema', 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('createOption', () => {
    it('should create a new option for a question', async () => {
      const mockOption = { id: 1, questionId: 1, text: 'Option 1' };
      mockPrismaClient.option.create.mockResolvedValue(mockOption);

      const result = await service.createOption('test_schema', 1, { text: 'Option 1' });

      expect(result).toEqual(mockOption);
      expect(mockPrismaClient.option.create).toHaveBeenCalledWith({
        data: { questionId: 1, text: 'Option 1' },
      });
    });
  });

  describe('updateOption', () => {
    it('should update an existing option', async () => {
      const existingOption = { id: 1, questionId: 1, text: 'Old Option' };
      const updatedOption = { ...existingOption, text: 'New Option' };
      mockPrismaClient.option.findUnique.mockResolvedValue(existingOption);
      mockPrismaClient.option.update.mockResolvedValue(updatedOption);

      const result = await service.updateOption('test_schema', 1, { text: 'New Option' });

      expect(result).toEqual(updatedOption);
      expect(mockPrismaClient.option.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { text: 'New Option' },
      });
    });

    it('should throw NotFoundException if option not found', async () => {
      mockPrismaClient.option.findUnique.mockResolvedValue(null);

      await expect(service.updateOption('test_schema', 999, { text: 'New Option' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteOption', () => {
    it('should delete an existing option', async () => {
      const existingOption = { id: 1 };
      mockPrismaClient.option.findUnique.mockResolvedValue(existingOption);
      mockPrismaClient.option.delete.mockResolvedValue(existingOption);

      await service.deleteOption('test_schema', 1);

      expect(mockPrismaClient.option.delete).toHaveBeenCalledWith({ where: { id: 1 } });
    });

    it('should throw NotFoundException if option not found', async () => {
      mockPrismaClient.option.findUnique.mockResolvedValue(null);

      await expect(service.deleteOption('test_schema', 999)).rejects.toThrow(NotFoundException);
    });
  });

  describe('submitVote', () => {
    it('should submit a user vote', async () => {
      const mockVote = { id: 1, userId: 1, optionId: 1 };
      mockPrismaClient.userVote.create.mockResolvedValue(mockVote);

      const result = await service.submitVote('test_schema', 1, 1);

      expect(result).toEqual(mockVote);
      expect(mockPrismaClient.userVote.create).toHaveBeenCalledWith({
        data: { userId: 1, optionId: 1 },
      });
    });
  });

  describe('getSurveyResults', () => {
    it('should return survey results', async () => {
      const mockSurvey = { id: 1, title: 'Test Survey', questions: [{ id: 1, text: 'Q1', options: [{ id: 10, text: 'OptA' }] }] };
      const mockVotes = [{ id: 1, optionId: 10 }];
      mockPrismaClient.survey.findUnique.mockResolvedValue(mockSurvey);
      mockPrismaClient.userVote.findMany.mockResolvedValue(mockVotes);

      const result = await service.getSurveyResults('test_schema', 1);

      expect(result).toEqual({
        survey: mockSurvey,
        results: { '1': { '10': 1 } },
      });
      expect(mockPrismaClient.survey.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { questions: { include: { options: true } } },
      });
      expect(mockPrismaClient.userVote.findMany).toHaveBeenCalledWith({ where: { optionId: { in: [10] } } });
    });

    it('should throw NotFoundException if survey not found', async () => {
      mockPrismaClient.survey.findUnique.mockResolvedValue(null);

      await expect(service.getSurveyResults('test_schema', 999)).rejects.toThrow(NotFoundException);
    });
  });
});
