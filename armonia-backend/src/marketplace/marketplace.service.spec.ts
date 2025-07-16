import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceService } from './marketplace.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { ListingCategory, ListingStatus } from '../common/dto/marketplace.dto'; // Importar ListingCategory

const mockPrismaService = {
  listing: {
    create: jest.fn(),
    findUnique: jest.fn(),
    findMany: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
  },
  reportedListing: {
    create: jest.fn(),
    findMany: jest.fn(),
    findUnique: jest.fn(),
    update: jest.fn(),
  },
  message: {
    create: jest.fn(),
    findMany: jest.fn(),
  },
};

const mockPrismaClientManager = {
  getClient: jest.fn(() => mockPrismaService),
};

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  let prisma: typeof mockPrismaService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceService,
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

    service = module.get<MarketplaceService>(MarketplaceService);
    prisma = module.get(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('createListing', () => {
    it('should create a listing', async () => {
      const createListingDto = {
        title: 'Test Listing',
        description: 'Description',
        price: 100,
        category: ListingCategory.OTHER, // Usar el enum
        images: [],
      };
      const userId = 1;
      const schemaName = 'test_schema';
      const expectedListing = { id: 1, ...createListingDto, authorId: userId, status: ListingStatus.ACTIVE };

      prisma.listing.create.mockResolvedValue(expectedListing);

      const result = await service.createListing(schemaName, userId, createListingDto);
      expect(result).toEqual(expectedListing);
      expect(prisma.listing.create).toHaveBeenCalledWith({
        data: { ...createListingDto, authorId: userId, status: ListingStatus.ACTIVE },
      });
    });
  });

  describe('getListingById', () => {
    it('should return a listing by ID', async () => {
      const listingId = 1;
      const schemaName = 'test_schema';
      const expectedListing = { id: listingId, title: 'Test Listing' };

      prisma.listing.findUnique.mockResolvedValue(expectedListing);

      const result = await service.getListingById(schemaName, listingId);
      expect(result).toEqual(expectedListing);
      expect(prisma.listing.findUnique).toHaveBeenCalledWith({
        where: { id: listingId },
        include: { author: { select: { name: true } } },
      });
    });

    it('should throw NotFoundException if listing not found', async () => {
      const listingId = 999;
      const schemaName = 'test_schema';

      prisma.listing.findUnique.mockResolvedValue(null);

      await expect(service.getListingById(schemaName, listingId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('updateListing', () => {
    it('should update a listing', async () => {
      const listingId = 1;
      const userId = 1;
      const schemaName = 'test_schema';
      // Proporcionar todos los campos requeridos por UpdateListingDto
      const updateListingDto = { 
        title: 'Updated Title',
        description: 'Updated Description',
        price: 120,
        category: ListingCategory.TECHNOLOGY,
      };
      const existingListing = { id: listingId, authorId: userId, title: 'Old Title', description: 'Old Description', price: 100, category: ListingCategory.OTHER };
      const updatedListing = { ...existingListing, ...updateListingDto };

      prisma.listing.findUnique.mockResolvedValue(existingListing);
      prisma.listing.update.mockResolvedValue(updatedListing);

      const result = await service.updateListing(schemaName, listingId, userId, updateListingDto);
      expect(result).toEqual(updatedListing);
      expect(prisma.listing.update).toHaveBeenCalledWith({
        where: { id: listingId },
        data: updateListingDto,
      });
    });

    it('should throw NotFoundException if listing not found', async () => {
      const listingId = 999;
      const userId = 1;
      const schemaName = 'test_schema';
      const updateListingDto = { 
        title: 'Updated Title',
        description: 'Updated Description',
        price: 120,
        category: ListingCategory.TECHNOLOGY,
      };

      prisma.listing.findUnique.mockResolvedValue(null);

      await expect(service.updateListing(schemaName, listingId, userId, updateListingDto)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not the author', async () => {
      const listingId = 1;
      const userId = 2; // Different user
      const schemaName = 'test_schema';
      const updateListingDto = { 
        title: 'Updated Title',
        description: 'Updated Description',
        price: 120,
        category: ListingCategory.TECHNOLOGY,
      };
      const existingListing = { id: listingId, authorId: 1, title: 'Old Title', description: 'Old Description', price: 100, category: ListingCategory.OTHER };

      prisma.listing.findUnique.mockResolvedValue(existingListing);

      await expect(service.updateListing(schemaName, listingId, userId, updateListingDto)).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteListing', () => {
    it('should delete a listing', async () => {
      const listingId = 1;
      const userId = 1;
      const schemaName = 'test_schema';
      const existingListing = { id: listingId, authorId: userId };

      prisma.listing.findUnique.mockResolvedValue(existingListing);
      prisma.listing.delete.mockResolvedValue(undefined);

      await expect(service.deleteListing(schemaName, listingId, userId)).resolves.toBeUndefined();
      expect(prisma.listing.delete).toHaveBeenCalledWith({ where: { id: listingId } });
    });

    it('should throw NotFoundException if listing not found', async () => {
      const listingId = 999;
      const userId = 1;
      const schemaName = 'test_schema';

      prisma.listing.findUnique.mockResolvedValue(null);

      await expect(service.deleteListing(schemaName, listingId, userId)).rejects.toThrow(NotFoundException);
    });

    it('should throw NotFoundException if user is not the author', async () => {
      const listingId = 1;
      const userId = 2; // Different user
      const schemaName = 'test_schema';
      const existingListing = { id: listingId, authorId: 1 };

      prisma.listing.findUnique.mockResolvedValue(existingListing);

      await expect(service.deleteListing(schemaName, listingId, userId)).rejects.toThrow(NotFoundException);
    });
  });

  describe('reportListing', () => {
    it('should create a reported listing', async () => {
      const reportListingDto = { listingId: 1, reason: 'Inappropriate content' };
      const userId = 1;
      const schemaName = 'test_schema';
      const expectedReport = { id: 1, ...reportListingDto, reporterId: userId, status: 'PENDING' };

      prisma.reportedListing.create.mockResolvedValue(expectedReport);

      const result = await service.reportListing(schemaName, reportListingDto.listingId, userId, reportListingDto.reason);
      expect(result).toEqual(expectedReport);
      expect(prisma.reportedListing.create).toHaveBeenCalledWith({
        data: { listingId: reportListingDto.listingId, reporterId: userId, reason: reportListingDto.reason, status: 'PENDING' },
      });
    });
  });

  describe('createMessage', () => {
    it('should create a message', async () => {
      const messageData = { listingId: 1, senderId: 1, receiverId: 2, content: 'Hello' };
      const schemaName = 'test_schema';
      const expectedMessage = { id: 1, ...messageData, createdAt: new Date() };

      prisma.message.create.mockResolvedValue(expectedMessage);

      const result = await service.createMessage(schemaName, messageData);
      expect(result).toEqual(expectedMessage);
      expect(prisma.message.create).toHaveBeenCalledWith({
        data: { ...messageData },
      });
    });
  });

  describe('getMessages', () => {
    it('should return messages for a listing and user', async () => {
      const listingId = 1;
      const userId = 1;
      const schemaName = 'test_schema';
      const expectedMessages = [
        { id: 1, listingId, senderId: userId, receiverId: 2, content: 'Hi', createdAt: new Date() },
        { id: 2, listingId, senderId: 2, receiverId: userId, content: 'Hello', createdAt: new Date() },
      ];

      prisma.message.findMany.mockResolvedValue(expectedMessages);

      const result = await service.getMessages(schemaName, listingId, userId);
      expect(result).toEqual(expectedMessages);
      expect(prisma.message.findMany).toHaveBeenCalledWith({
        where: {
          listingId: listingId,
          OR: [
            { senderId: userId },
            { receiverId: userId },
          ],
        },
        orderBy: { createdAt: 'asc' },
      });
    });
  });
});