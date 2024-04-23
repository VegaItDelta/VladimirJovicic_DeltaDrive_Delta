import { VehicleDto } from '../../vehicle';
import { History } from '../history';

export class HistoryDto {
    public constructor(history: History) {
        this.startLatitude = history.startLatitude;
        this.startLongitude = history.startLongitude;
        this.destinationLatitude = history.destinationLatitude;
        this.destinationLongitude = history.destinationLongitude;
        this.totalPrice = history.totalPrice;
        this.date = history.date;

        const vehicle = history.vehicle;
        this.vehicle = {
            brand: vehicle?.brand,
            firstName: vehicle?.firstName,
            lastName: vehicle?.lastName,
        }
    }
    public startLatitude: number;
    public startLongitude: number;
    public destinationLatitude: number;
    public destinationLongitude: number;
    public totalPrice: number;
    public date: Date;
    public vehicle: VehicleDto;
}