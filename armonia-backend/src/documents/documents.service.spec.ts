import { Test, TestingModule } from '@nestjs/testing';
import { DocumentsService } from './documents.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { DocumentType } from '../common/dto/documents.dto'; // Importar DocumentType

const mockPrismaService = {
  document: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    delete: jest.fn(),
  },
};

const mockPrismaClientManager = {
  getClient: jest.fn(() => mockPrismaService),
};

describe('DocumentsService', () => {
  let service: DocumentsService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        DocumentsService,
        {
          provide: PrismaClientManager,
          useValue: mockPrismaClientManager,
        },
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile();

    service = module.get<DocumentsService>(DocumentsService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('uploadDocument', () => {
    it('should upload a document', async () => {
      const schemaName = 'test_schema';
      const userId = 1;
      const mockFile = { originalname: 'test.pdf' } as any; // Mock Multer file
      const createDocumentDto = {
        name: 'Test Document',
        description: 'A test document',
        type: DocumentType.GENERAL, // Usar el enum
      };
      const expectedDocument = {
        id: 1,
        name: createDocumentDto.name,
        description: createDocumentDto.description,
        url: `https://your-s3-bucket.s3.amazonaws.com/${schemaName}/${mockFile.originalname}`,
        type: createDocumentDto.type,
        uploadedBy: userId,
        uploadedAt: new Date(),
      };

      prisma.document.create.mockResolvedValue(expectedDocument);

      const result = await service.uploadDocument(
        schemaName,
        userId,
        mockFile,
        createDocumentDto,
      );
      expect(result).toEqual(expectedDocument);
      expect(prisma.document.create).toHaveBeenCalledWith({
        data: {
          name: createDocumentDto.name,
          description: createDocumentDto.description,
          url: `https://your-s3-bucket.s3.amazonaws.com/${schemaName}/${mockFile.originalname}`,
          type: createDocumentDto.type,
          uploadedBy: userId,
        },
      });
    });
  });

  describe('getDocuments', () => {
    it('should return a list of documents', async () => {
      const schemaName = 'test_schema';
      const filters = { page: 1, limit: 10 };
      const expectedDocuments = [{ id: 1, name: 'Doc 1' }];
      prisma.document.findMany.mockResolvedValue(expectedDocuments);

      const result = await service.getDocuments(schemaName, filters);
      expect(result).toEqual(expectedDocuments);
    });
  });

  describe('getDocumentById', () => {
    it('should return a single document by ID', async () => {
      const schemaName = 'test_schema';
      const documentId = 1;
      const expectedDocument = { id: documentId, name: 'Doc 1' };
      prisma.document.findUnique.mockResolvedValue(expectedDocument);

      const result = await service.getDocumentById(schemaName, documentId);
      expect(result).toEqual(expectedDocument);
    });

    it('should throw NotFoundException if document not found', async () => {
      const schemaName = 'test_schema';
      const documentId = 999;
      prisma.document.findUnique.mockResolvedValue(null);

      await expect(service.getDocumentById(schemaName, documentId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteDocument', () => {
    it('should delete a document', async () => {
      const schemaName = 'test_schema';
      const documentId = 1;
      prisma.document.delete.mockResolvedValue(undefined);

      await expect(service.deleteDocument(schemaName, documentId)).resolves.toBeUndefined();
      expect(prisma.document.delete).toHaveBeenCalledWith({ where: { id: documentId } });
    });
  });
});
