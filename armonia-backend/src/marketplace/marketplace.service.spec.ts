import { Test, TestingModule } from '@nestjs/testing';
import { MarketplaceService } from './marketplace.service';
import { PrismaClientManager } from '../prisma/prisma-client-manager';
import { PrismaService } from '../prisma/prisma.service';
import { CreateListingDto, ListingCategory, ListingStatus } from '../common/dto/marketplace.dto';

describe('MarketplaceService', () => {
  let service: MarketplaceService;
  let prismaClientManager: PrismaClientManager;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        MarketplaceService,
        {
          provide: PrismaClientManager,
          useValue: {
            getClient: jest.fn().mockReturnValue({
              listing: {
                create: jest.fn().mockResolvedValue({ id: 1, title: 'Test Listing', status: ListingStatus.ACTIVE }),
                findMany: jest.fn().mockResolvedValue([
                  { id: 1, title: 'Test Listing 1', status: ListingStatus.ACTIVE, author: { name: 'User 1' } },
                  { id: 2, title: 'Test Listing 2', status: ListingStatus.ACTIVE, author: { name: 'User 2' } },
                ]),
                findUnique: jest.fn().mockResolvedValue({ id: 1, title: 'Test Listing', authorId: 1, status: ListingStatus.ACTIVE }),
                update: jest.fn().mockResolvedValue({ id: 1, title: 'Updated Listing', status: ListingStatus.ACTIVE }),
                delete: jest.fn().mockResolvedValue(undefined),
              },
              reportedListing: {
                create: jest.fn().mockResolvedValue({ id: 1, listingId: 1, status: 'PENDING' }),
                findMany: jest.fn().mockResolvedValue([
                  { id: 1, listingId: 1, status: 'PENDING', listing: { title: 'Reported Listing' }, reporter: { name: 'Reporter User' } },
                ]),
                findUnique: jest.fn().mockResolvedValue({ id: 1, listingId: 1, status: 'PENDING' }),
                update: jest.fn().mockResolvedValue({ id: 1, listingId: 1, status: 'RESOLVED' }),
              },
            }),
          },
        },
        PrismaService,
      ],
    }).compile();

    service = module.get<MarketplaceService>(MarketplaceService);
    prismaClientManager = module.get<PrismaClientManager>(PrismaClientManager);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a listing', async () => {
    const createDto: CreateListingDto = {
      title: 'New Item',
      description: 'Description of new item',
      price: 100,
      category: ListingCategory.HOME,
      images: [],
    };
    const listing = await service.createListing('test_schema', 1, createDto);
    expect(listing).toBeDefined();
    expect(listing.title).toBe('Test Listing');
  });

  it('should get listings', async () => {
    const listings = await service.getListings('test_schema', {});
    expect(listings.length).toBeGreaterThan(0);
  });

  it('should report a listing', async () => {
    const report = await service.reportListing('test_schema', 1, 2, 'Inappropriate content');
    expect(report).toBeDefined();
    expect(report.status).toBe('PENDING');
  });

  it('should resolve a report', async () => {
    const result = await service.resolveReport('test_schema', 1, 'APPROVE');
    expect(result.message).toContain('aprobado');
  });
});
