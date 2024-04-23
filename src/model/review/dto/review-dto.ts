import { Vehicle, VehicleDto } from '../../vehicle';
import { Review } from '../review';

export class ReviewDto {

    public constructor(review: Review) {
        this.uuid = review.uuid;
        this.dateOfRide = review.dateOfRide;
        this.price = review.price;
        this.rate = review.rate;

        if (review.comment != null) {
            this.comment = review.comment;
        }

        const vehicle: Vehicle = review.vehicle;

        this.vehicle = {
            brand: vehicle?.brand,
            firstName: vehicle?.firstName,
            lastName: vehicle?.lastName,
            vehicleId: vehicle?.uuid
        }
    }

    public uuid: string;

    public dateOfRide: Date;

    public price: number;

    public rate?: number;

    public comment?: string;

    public vehicle: VehicleDto;


}
