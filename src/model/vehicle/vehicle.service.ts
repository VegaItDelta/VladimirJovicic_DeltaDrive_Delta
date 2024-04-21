import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from './vehicle';
import { CacheService } from '../../cache';
import { Position, PositionService } from '../../services';
import { VehicleOffer } from './vehicle-offer';

export interface DrivingPositionData {
  // The current location of the passenger
  passengerPosition: Position;
  // The destination of the passenger
  destinationPosition: Position;
  // The vehicle current position
  vehiclePosition: Position;
}
@Injectable()
export class VehicleService {
  public constructor(
    @InjectModel(Vehicle.name) private vehicleModel: Model<Vehicle>,
    private readonly cacheService: CacheService,
    private readonly positionService: PositionService
  ) {}

  /**
   * Get all the vehicles and insert it to the chache.
   * If the cache is already loaded it will spare the fetch from the database
   * @returns The vehicles array
   */
  public async getAllVehicles(): Promise<Vehicle[]> {
    if (this.cacheService.isEmpty()) {
      const vehicles: Vehicle[] = await this.vehicleModel.find();
      this.cacheService.addAll(vehicles);
      return await this.vehicleModel.find();
    } else {
      return this.cacheService.getAll();
    }
  }

  /**
   * Return the vehicle from the cache if the cache is loaded, otherwise fetch it from the db
   * @param uuid The generated uuid of the vehicles
   * @returns The vehicle if it is found or null if it can't find it
   */
  public async getVehicle(uuid: string): Promise<Vehicle | null> {
    if (this.cacheService.isEmpty()) {
      return await this.vehicleModel.findOne({uuid});
    }
    return this.cacheService.get(uuid)
  }

  /**
   * Find the closest vehicles based of the provided point
   * @param userPosition The current user position
   * @param vehicles The vehicles array to look for
   * @param count How many vehicles should be returned
   * @returns Vehicles with the closest distances (count)
   */
  public findClosestVehicles(
    userPosition: Position,
    vehicles: Vehicle[],
    count: number,
    distanceToDestination: number
  ): VehicleOffer[] {
    const vehicleDistances = vehicles.map(vehicle => ({
      vehicle,
      distance: this.positionService.calculateDistance(userPosition, vehicle)
    }));
  
    // Sort the distances
    vehicleDistances.sort((a, b) => a.distance - b.distance);

  const closestVehicles: VehicleOffer[] = [];
    for (let vehicleDistance of vehicleDistances) {

      // If the vehicle is alreay booked move to the next one
      if (vehicleDistance.vehicle.booked) {
        continue;
      }

      closestVehicles.push({
        // THe vehicle data
        vehicle: vehicleDistance.vehicle,
        // The calculated distance between the vehicle and the passenger
        distanceToDriver: vehicleDistance.distance,
        // The price for the whole ride
        price: distanceToDestination * vehicleDistance.vehicle.pricePerKM + vehicleDistance.vehicle.startPrice
      });    
      
      // If the array has the maximum length break to loop
      if (closestVehicles.length === count) {
        break;
      }
    }
    return closestVehicles;
  }

  /**
   * Booking the vehicle for a ride by setting the booked flag to true
   * @param vehicle The vehicle to book
   */
  public async book(vehicle: Vehicle): Promise<void> {
    vehicle.booked = true;
    this.cacheService.set(vehicle);
    await this.vehicleModel.updateOne({uuid: vehicle.uuid}, vehicle).exec();
  }

  /**
   * Drives a vehicle from it's starting point to the passenger and then from the passenger to the destination
   * @param data The start, end and driver location needed for the ride {@link DrivingPositionData}
   */
  public async drive(data: DrivingPositionData): Promise<void>{
    const { destinationPosition, passengerPosition, vehiclePosition } = data;

    // Comming to pick up the passnger
    await this.positionService.move(vehiclePosition, passengerPosition);

    console.log('Taking you to your destination...');
    // Bringing the passenger to the destination
    await this.positionService.move(passengerPosition, destinationPosition);
  }

  /**
   * Updates the vehicle location and booked status, saves the data in the cache and updates the record in the db
   * @param vehicle The vehicle that finished the ride
   * @param newLocation The new location where the vehicle ride ended
   */
  public async finishRide(vehicle: Vehicle, newLocation: Position): Promise<void> {
    vehicle.longitude = newLocation.longitude;
    vehicle.latitude = newLocation.latitude;
    vehicle.booked = false;
    this.cacheService.set(vehicle);
    await this.vehicleModel.updateOne({uuid: vehicle.uuid}, vehicle).exec();
  }
}
