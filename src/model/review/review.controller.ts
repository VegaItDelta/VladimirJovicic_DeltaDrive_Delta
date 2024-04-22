import { Body, Controller, Get, HttpException, HttpStatus, Put, Res, Session, UseInterceptors } from '@nestjs/common';
import { AuthentificationInterceptor } from '../../interceptor';
import { ReviewService } from './review.service';
import { ReviewDto } from './dto';

@UseInterceptors(AuthentificationInterceptor)
@Controller('reviews')
export class ReviewController {
    public constructor(
      private readonly reviewService: ReviewService,
    ) {}

      @Get()
      public async get(
        @Res() response,
        @Session() session: Record<string, any>,
      ): Promise<void> {
        try {
          const reviews = await this.reviewService.getAllReviews(session.passenger.email);
  
          response.status(HttpStatus.OK).send({
              message: 'Reviews',
              data: { completed: reviews.completed, pending: reviews.pending }
          });
        } catch (e) {
          response.status(e.getStatus()).send({ message: e.message })
        }
      }

      @Put('/:id')
      public async leaveReview(
        @Body('review') reviewDto: ReviewDto,
        @Res() response,
        @Session() session: Record<string, any>
      ): Promise<void> {

        try {
          // If the rate is not provided return a bad request
          if (reviewDto.rate == null) {
            throw new HttpException('Rate is missing!', HttpStatus.BAD_REQUEST);
          }
  
          // If the rate is not in the range return a bad request
          if (reviewDto.rate < 1 || reviewDto.rate > 5) {
            throw new HttpException('The rate must be between 1 and 5', HttpStatus.BAD_REQUEST);
          }
  
          // Get the review
          const review = await this.reviewService.get(reviewDto.uuid);
  
          // Check if the review is found
          if (review == null) {
            throw new HttpException('The review is not found!', HttpStatus.BAD_REQUEST);
          }
  
          // Make sure that the user does not do a review multiple times
          if (review.completed) {
            throw new HttpException('You have already completed this review!', HttpStatus.BAD_REQUEST);
          }
  
          // Assigne the rate
          review.rate = reviewDto.rate;
  
          // Assign the comment if it is provided. It is optional
          if (reviewDto.comment) {
            review.comment = reviewDto.comment;
          }
  
          review.completed = true;
  
          // Set the review in the db
          await this.reviewService.leaveReview(review);
  
          response.status(HttpStatus.OK).send({ message: 'Thank you for reviewing!' });

        } catch (e) {
          response.status(e.getStatus()).send({ message: e.message });
        }
      }
}
