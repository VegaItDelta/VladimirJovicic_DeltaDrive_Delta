import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CacheService } from '../../../src/cache';
import { ReviewService, Review } from '../../../src/model';
import { GuidService } from '../../../src/services';

describe('ReviewService', () => {
  let service: ReviewService;
  let model: Model<Review>;
  let guidService: GuidService;
  let cacheService: CacheService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ReviewService,
        {
          provide: getModelToken(Review.name),
          useValue: {
            findOne: jest.fn(),
            create: jest.fn(),
            find: jest.fn(),
            updateOne: jest.fn(),
          },
        },
        {
          provide: GuidService,
          useValue: {
            generateGuid: jest.fn().mockReturnValue('1234567890'),
          },
        },
        {
          provide: CacheService,
          useValue: {
            get: jest.fn().mockReturnValue({}),
          },
        },
      ],
    }).compile();

    service = module.get<ReviewService>(ReviewService);
    model = module.get<Model<Review>>(getModelToken(Review.name));
    cacheService = module.get<CacheService>(CacheService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('get', () => {
    it('should return a review', async () => {
      const uuid = '1234567890';
      const review = { uuid };

      (model.findOne as jest.Mock).mockResolvedValue(review);

      const result = await service.get(uuid);

      expect(result).toEqual(review);
      expect(model.findOne).toHaveBeenCalledWith({ uuid });
    });
  });

  describe('insertReviewRequest', () => {
    it('should insert a review request', async () => {
      const email = 'test@example.com';
      const vehicleId = 'vehicle123';
      const price = 100;

      await service.insertReviewRequest(email, vehicleId, price);

      expect(model.create).toHaveBeenCalledWith({
        uuid: '1234567890',
        email,
        vehicleId,
        dateOfRide: expect.any(Date),
        price,
        completed: false,
      });
    });
  });

  describe('getAllReviews', () => {
    it('should return completed and pending reviews', async () => {
      const email = 'test@example.com';
      const reviews = [
        { uuid: '1', completed: true, rate: 4 },
        { uuid: '2', completed: false },
      ];

      (model.find as jest.Mock).mockResolvedValue(reviews);
      (cacheService.get as jest.Mock).mockReturnValue({});

      const result = await service.getAllReviews(email);

      expect(result.completed).toHaveLength(1);
      expect(result.pending).toHaveLength(1);
      expect(result.completed[0].uuid).toEqual('1');
      expect(result.pending[0].uuid).toEqual('2');
    });
  });
});
