import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Vehicle } from './vehicle';
import { CacheService } from '../../cache';
import { Position, PositionService } from '../../services';
import { VehicleOffer } from './vehicle-offer';

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
        price: distanceToDestination * vehicleDistance.vehicle.pricePerKM
      });    
      
      // If the array has the maximum length break to loop
      if (closestVehicles.length === count) {
        break;
      }
    }
  
    return closestVehicles;
  }
}
