import { Controller, Get, HttpStatus, Query, UseInterceptors, Res } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle';
import { CustomInterceptors } from '../../interceptor';
import { Position, PositionService } from '../../services';
import { VehicleOffer } from './vehicle-offer';

// Get the n closes vehicles
const CLOSEST_VEHICLES_COUNT = 10;
@UseInterceptors(CustomInterceptors)
@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly positionService: PositionService
  ) {}

  @Get('/getAll')
  public async getAllVehicles(): Promise<Vehicle[]> {
    try {
      const vehicles = await this.vehicleService.getAllVehicles();
      return vehicles;
    } catch (e) {
      console.error('getAllVehicles error', e);
    }
  }

  @Get('get-closest-vehicles')
  public async getClosestVehicles(
    @Query('passenger-latitude') passengerLatitude: number, @Query('passenger-longitude') passengerLongitude: number,
    @Query('destination-latitude') destinationLatitude: number, @Query('destination-longitude') destinationLongitude: number,
    @Res() response
  ): Promise<VehicleOffer[]> {
    if (
      passengerLatitude == null ||
      passengerLongitude == null ||
      destinationLatitude == null ||
      destinationLongitude == null
    ) {
      response.status(HttpStatus.BAD_REQUEST).send({ message: 'Wrong location data' });
      return [];
    }
    try {
      // The currenct location of the passenger
      const passengerPosition: Position = {
        latitude: passengerLatitude,
        longitude: passengerLongitude
      };

      // The currenct desitnation location
      const destinationPosition: Position = {
        latitude: destinationLatitude,
        longitude: destinationLongitude
      };

      const vehicles = await this.vehicleService.getAllVehicles();
      const distanceToDestination = this.positionService.calculateDistance(passengerPosition, destinationPosition)
      const vehicleDistances: VehicleOffer[] = this.vehicleService.findClosestVehicles(passengerPosition, vehicles, CLOSEST_VEHICLES_COUNT, distanceToDestination);
      response.status(HttpStatus.OK).send({ message: `${vehicleDistances.length} offers found!`, vehicleDistances });
      return vehicleDistances;
    } catch(e) {
      console.error('bookVehicles error', e);
    }
  }
}


