import { VehicleDto } from '../../vehicle';

export class ReviewDto {

    public uuid: string;

    public dateOfRide: Date;

    public vehicle: VehicleDto;

    public price: number;

    public rate?: number;

    public comment?: string;

}
