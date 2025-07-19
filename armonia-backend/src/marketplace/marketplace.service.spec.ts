import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceService } from './marketplace.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import {
  ListingCategory,
  ListingStatus,
  CreateListingDto,
  UpdateListingDto,
} from '../common/dto/marketplace.dto';
import { vi } from "vitest";

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  let prisma: PrismaService;
  let prismaClientManager: PrismaClientManager;

  const mockPrismaClient = {
    listing: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
    reportedListing: {
      create: vi.fn(),
      findMany: vi.fn(),
      findUnique: vi.fn(),
      update: vi.fn(),
    },
    message: {
      create: vi.fn(),
      findMany: vi.fn(),
    },
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: vi.fn(() => mockPrismaClient),
          },
        },
        {
          provide: PrismaService,
          useValue: {
            // Mock global PrismaService methods if needed
          },
        },
      ],
    }).compile();

    service = module.get<MarketplaceService>(MarketplaceService);
    prisma = module.get<PrismaService>(PrismaService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
    (service as any).prismaClientManager = prismaClientManager;
    (service as any).prisma = prisma;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  // Removed uploadImage test block

  describe('createListing', () => {
    it('should create a new listing', async () => {
      const mockListing = {
        id: 1,
        title: 'Test Listing',
        description: 'Test Desc',
        price: 100,
        category: ListingCategory.HOME,
        authorId: 1,
        status: ListingStatus.ACTIVE,
      };
      mockPrismaClient.listing.create.mockResolvedValue(mockListing);

      const createListingDto: CreateListingDto = {
        title: 'Test Listing',
        description: 'Test Desc',
        price: 100,
        category: ListingCategory.HOME,
      };
      const result = await service.createListing(
        'test_schema',
        1,
        createListingDto,
      );

      expect(result).toEqual(mockListing);
      expect(mockPrismaClient.listing.create).toHaveBeenCalledWith({
        data: {
          ...createListingDto,
          authorId: 1,
          status: ListingStatus.ACTIVE,
        },
      });
    });
  });

  describe('getListings', () => {
    it('should return a list of listings', async () => {
      const mockListings = [
        { id: 1, title: 'Listing 1', status: ListingStatus.ACTIVE },
        { id: 2, title: 'Listing 2', status: ListingStatus.ACTIVE },
      ];
      mockPrismaClient.listing.findMany.mockResolvedValue(mockListings);

      const result = await service.getListings('test_schema', {});

      expect(result).toEqual(mockListings);
      expect(mockPrismaClient.listing.findMany).toHaveBeenCalledWith({
        where: { status: ListingStatus.ACTIVE },
        skip: 0,
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { author: { select: { name: true } } },
      });
    });
  });

  describe('getListingById', () => {
    it('should return a single listing by ID', async () => {
      const mockListing = {
        id: 1,
        title: 'Test Listing',
        author: { name: 'Test User' },
      };
      mockPrismaClient.listing.findUnique.mockResolvedValue(mockListing);

      const result = await service.getListingById('test_schema', 1);

      expect(result).toEqual(mockListing);
      expect(mockPrismaClient.listing.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        include: { author: { select: { name: true } } },
      });
    });

    it('should throw NotFoundException if listing not found', async () => {
      mockPrismaClient.listing.findUnique.mockResolvedValue(null);

      await expect(service.getListingById('test_schema', 999)).rejects.toThrow(
        new NotFoundException(`Anuncio con ID 999 no encontrado.`),
      );
    });
  });

  describe('updateListing', () => {
    it('should update an existing listing', async () => {
      const existingListing = {
        id: 1,
        title: 'Old Title',
        description: 'Old Desc',
        price: 100,
        category: ListingCategory.HOME,
        authorId: 1,
        status: ListingStatus.ACTIVE,
      };
      const updatedListing = {
        ...existingListing,
        title: 'New Title',
        description: 'New Desc',
        price: 200,
        category: ListingCategory.TECHNOLOGY,
      };
      mockPrismaClient.listing.findUnique.mockResolvedValue(existingListing);
      mockPrismaClient.listing.update.mockResolvedValue(updatedListing);

      const updateListingDto: UpdateListingDto = {
        title: 'New Title',
        description: 'New Desc',
        price: 200,
        category: ListingCategory.TECHNOLOGY,
      };
      const result = await service.updateListing(
        'test_schema',
        1,
        1,
        updateListingDto,
      );

      expect(result).toEqual(updatedListing);
      expect(mockPrismaClient.listing.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: updateListingDto,
      });
    });

    it('should throw NotFoundException if listing not found or unauthorized', async () => {
      mockPrismaClient.listing.findUnique.mockResolvedValue(null);

      const updateListingDto: UpdateListingDto = {
        title: 'New Title',
        description: 'New Description',
        price: 200,
        category: ListingCategory.HOME,
      };
      await expect(
        service.updateListing('test_schema', 999, 1, updateListingDto),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('deleteListing', () => {
    it('should delete an existing listing', async () => {
      const existingListing = { id: 1, authorId: 1 };
      mockPrismaClient.listing.findUnique.mockResolvedValue(existingListing);
      mockPrismaClient.listing.delete.mockResolvedValue(existingListing);

      await service.deleteListing('test_schema', 1, 1);

      expect(mockPrismaClient.listing.delete).toHaveBeenCalledWith({
        where: { id: 1 },
      });
    });

    it('should throw NotFoundException if listing not found or unauthorized', async () => {
      mockPrismaClient.listing.findUnique.mockResolvedValue(null);

      await expect(
        service.deleteListing('test_schema', 999, 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('reportListing', () => {
    it('should report a listing', async () => {
      const mockReport = {
        id: 1,
        listingId: 1,
        reporterId: 1,
        reason: 'Spam',
        status: 'PENDING',
      };
      mockPrismaClient.reportedListing.create.mockResolvedValue(mockReport);

      const result = await service.reportListing('test_schema', 1, 1, 'Spam');

      expect(result).toEqual(mockReport);
      expect(mockPrismaClient.reportedListing.create).toHaveBeenCalledWith({
        data: {
          listingId: 1,
          reporterId: 1,
          reason: 'Spam',
          status: 'PENDING',
        },
      });
    });
  });

  describe('getReportedListings', () => {
    it('should return a list of reported listings', async () => {
      const mockReports = [
        { id: 1, listingId: 1, status: 'PENDING' },
        { id: 2, listingId: 2, status: 'PENDING' },
      ];
      mockPrismaClient.reportedListing.findMany.mockResolvedValue(mockReports);

      const result = await service.getReportedListings('test_schema');

      expect(result).toEqual(mockReports);
      expect(mockPrismaClient.reportedListing.findMany).toHaveBeenCalledWith({
        where: { status: 'PENDING' },
        include: {
          listing: { include: { author: { select: { name: true } } } },
          reporter: { select: { name: true } },
        },
      });
    });
  });

  describe('resolveReport', () => {
    it('should resolve a report', async () => {
      const mockReport = { id: 1, listingId: 1, status: 'PENDING' };
      const updatedReport = { ...mockReport, status: 'RESOLVED' };
      mockPrismaClient.reportedListing.findUnique.mockResolvedValue(mockReport);
      mockPrismaClient.reportedListing.update.mockResolvedValue(updatedReport);

      const result = await service.resolveReport('test_schema', 1, 'APPROVE');

      expect(result).toEqual({ message: 'Reporte aprobado correctamente.' });
      expect(mockPrismaClient.reportedListing.update).toHaveBeenCalledWith({
        where: { id: 1 },
        data: { status: 'RESOLVED' },
      });
    });

    it('should throw NotFoundException if report not found', async () => {
      mockPrismaClient.reportedListing.findUnique.mockResolvedValue(null);

      await expect(
        service.resolveReport('test_schema', 999, 'APPROVE'),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('createMessage', () => {
    it('should create a new message', async () => {
      const mockMessage = {
        id: 1,
        listingId: 1,
        senderId: 1,
        receiverId: 2,
        content: 'Hello',
      };
      mockPrismaClient.message.create.mockResolvedValue(mockMessage);

      const result = await service.createMessage('test_schema', {
        listingId: 1,
        senderId: 1,
        receiverId: 2,
        content: 'Hello',
      });

      expect(result).toEqual(mockMessage);
      expect(mockPrismaClient.message.create).toHaveBeenCalledWith({
        data: { listingId: 1, senderId: 1, receiverId: 2, content: 'Hello' },
      });
    });
  });

  describe('getMessages', () => {
    it('should return a list of messages for a listing and user', async () => {
      const mockMessages = [
        { id: 1, listingId: 1, senderId: 1, receiverId: 2, content: 'Hello' },
        { id: 2, listingId: 1, senderId: 2, receiverId: 1, content: 'Hi' },
      ];
      mockPrismaClient.message.findMany.mockResolvedValue(mockMessages);

      const result = await service.getMessages('test_schema', 1, 1);

      expect(result).toEqual(mockMessages);
      expect(mockPrismaClient.message.findMany).toHaveBeenCalledWith({
        where: {
          listingId: 1,
          OR: [{ senderId: 1 }, { receiverId: 1 }],
        },
        orderBy: { createdAt: 'asc' },
      });
    });
  });
});