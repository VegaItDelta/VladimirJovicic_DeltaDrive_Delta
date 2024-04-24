import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus } from '@nestjs/common';
import { ReviewController, ReviewService } from '../../../src/model';

describe('ReviewController', () => {
  let controller: ReviewController;
  let reviewService: ReviewService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ReviewController],
      providers: [
        {
          provide: ReviewService,
          useValue: {
            getAllReviews: jest.fn(),
            get: jest.fn(),
            leaveReview: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ReviewController>(ReviewController);
    reviewService = module.get<ReviewService>(ReviewService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('get', () => {
    it('should return reviews successfully', async () => {
      const email = 'test@example.com';
      const reviews = { completed: [], pending: [] };

      (reviewService.getAllReviews as any).mockResolvedValue(reviews);

      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.get(response, { passenger: { email } });

      expect(reviewService.getAllReviews).toHaveBeenCalledWith(email);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.send).toHaveBeenCalledWith({
        message: 'Reviews',
        data: { completed: reviews.completed, pending: reviews.pending },
      });
    });

    it('should handle errors', async () => {
      const email = 'test@example.com';
      const errorMessage = 'Internal Server Error';

      (reviewService.getAllReviews as any).mockRejectedValue(new Error(errorMessage));

      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.get(response, { passenger: { email } });

      expect(reviewService.getAllReviews).toHaveBeenCalledWith(email);
      expect(response.status).toHaveBeenCalledWith(new Error(errorMessage));
      expect(response.send).toHaveBeenCalledWith({ message: errorMessage });
    });
  });

  describe('leaveReview', () => {
    it('should leave a review successfully', async () => {
      const id = '1';
      const reviewDto = { rate: 4, comment: 'Great experience!' };

      const review = { completed: false };
      (reviewService.get as any).mockResolvedValue(review);
      (reviewService.leaveReview as any).mockResolvedValue();

      const response = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
      };

      await controller.leaveReview(id, reviewDto as any, response);

      expect(reviewService.get).toHaveBeenCalledWith(id);
      expect(response.status).toHaveBeenCalledWith(HttpStatus.OK);
      expect(response.send).toHaveBeenCalledWith({ message: 'Thank you for reviewing!' });
    });

  });
});
