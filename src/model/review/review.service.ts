import { Injectable } from '@nestjs/common';
import { Review } from './review';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { GuidService } from '../../services';
import { ReviewDto } from './dto';
import { VehicleReviewDto } from '../vehicle';
import { CacheService } from '../../cache';

@Injectable()
export class ReviewService {
    public constructor(
        @InjectModel(Review.name) private reviewModel: Model<Review>,
        private readonly guidService: GuidService,
        private readonly cacheService: CacheService
    ) { }

    /**
     * Fetches the review by the uuid
     * @param uuid The uuid of the review
     * @returns The review
     */
    public async get(uuid: string): Promise<Review> {
        try {
            return await this.reviewModel.findOne({ uuid });
        } catch (e) {
            throw new Error(e);
        }
    }


    /**
     * Inserts an empty pending review request that the user can fill out at any time.
     * The review will only appear for the driver if when the user completes the review
     * @param email The email of the user
     * @param vehicleId The vehicle id
     */
    public async insertReviewRequest(email: string, vehicleId: string, price: number): Promise<void> {
        const uuid = this.guidService.generateGuid();
        await this.reviewModel.create({
            uuid,
            email,
            vehicleId,
            dateOfRide: new Date(),
            price,
            completed: false,
        });
    }

    /**
     * Fetches all pending and completed reviews for a user
     * @param email The email of the user
     * @returns An array of the reviews distributes by completed and pending
     */
    public async getAllReviews(email: string): Promise<{ completed: ReviewDto[]; pending: ReviewDto[]; }> {
        // Fetch the reviews by joining with the vehicle by the id
        const reviewsFromDb: Review[] = await this.reviewModel.find({email});

        const pending: ReviewDto[] = [];
        const completed: ReviewDto[] = [];
        for (let review of reviewsFromDb) {
            const vehicle = this.cacheService.get(review.vehicleId);
            review.vehicle = vehicle;
            const reviewDto: ReviewDto = new ReviewDto(review);

            // Add the rate if it is present
            if (review.rate != null) {
                reviewDto.rate = review.rate
            }

            // Add the comment if it is present
            if (review.comment != null) {
                reviewDto.comment = review.comment
            }

            // Distribute the reviews by completed and pending
            if (review.completed) {
                completed.push(reviewDto)
            } else {
                pending.push(reviewDto);
            }
        }
        return { completed, pending }
    }

    /**
     * Leave a review for a vehicle.
     * It completes a pending review.
     * @param review The review the user has left
     */
    public async leaveReview(review: Review): Promise<void> {
        await this.reviewModel.updateOne(
            { uuid: review.uuid },
            review
        );
    }

    /**
     * Get all completed reviews for a vehicle
     * @param vehicleId The id of the vehicle
     * @returns The reviews for the vehicle
     */
    public async getVehicleReviews(vehicleId): Promise<VehicleReviewDto[]> {
        const vehicleReviews: VehicleReviewDto[] = []

        // Get the review by the vehicleId and the completed ones
        const reviews: Review[] = await this.reviewModel.find({ vehicleId, completed: true });

        for (let review of reviews) {
            // Assign the rate
            const vehicleReview: VehicleReviewDto = {
                rate: review.rate
            }

            // Assign the comment if it is present
            if (review.comment != null) {
                vehicleReview.comment = review.comment;
            }

            // Push it to the returVal array
            vehicleReviews.push(vehicleReview)
        }

        return vehicleReviews;
    }
}
