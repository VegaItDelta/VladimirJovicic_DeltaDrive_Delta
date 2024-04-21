import { Vehicle } from './vehicle';

/**
 * An interface that represents the offer from a driver
 */
export interface VehicleOffer {
    /**
     * The vehicle data
     */
    vehicle: Vehicle,

    /**
     * The distance from the vehicle position to the passenger
     */
    distanceToDriver: number,

    /**
     * The price of the ride
     */
    price: number
}