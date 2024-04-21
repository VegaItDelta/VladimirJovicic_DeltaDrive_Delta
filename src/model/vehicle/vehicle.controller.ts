import { Controller, Get, HttpStatus, Query, UseInterceptors, Res, Session, UnauthorizedException } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Vehicle } from './vehicle';
import { CustomInterceptors } from '../../interceptor';
import { Position, PositionService } from '../../services';
import { VehicleOffer } from './vehicle-offer';
import { HistoryService } from '../history/history.service';

// Get the n closes vehicles
const CLOSEST_VEHICLES_COUNT = 10;

// Percantage of chance to declining the ride
const DECLINING_CHANCE = 25;

// Various reasons for the declining of a ride
const DECLINING_REASONS = [
  'Vehicle Malfunctioning',
  'Broken clutch',
  'It is too far away',
  'No enough gas',
  'I have no driving licence',
  'I don\'t feel like it',
  'I don\'t want to drive you',
  'Meh',
]
@UseInterceptors(CustomInterceptors)
@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly positionService: PositionService,
    private readonly historyService: HistoryService
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
        latitude: +passengerLatitude,
        longitude: +passengerLongitude
      };

      // The currenct desitnation location
      const destinationPosition: Position = {
        latitude: +destinationLatitude,
        longitude: +destinationLongitude
      };

      const vehicles = await this.vehicleService.getAllVehicles();
      const distanceToDestination = this.positionService.calculateDistance(passengerPosition, destinationPosition);

      const vehicleOffers: VehicleOffer[] = this.vehicleService.findClosestVehicles(passengerPosition, vehicles, CLOSEST_VEHICLES_COUNT, distanceToDestination);
      response.status(HttpStatus.OK).send({ message: `${vehicleOffers.length} offers found!`, vehicleDistances: vehicleOffers });
      return vehicleOffers;
    } catch(e) {
      console.error('bookVehicles error', e);
    }
  }

  @Get('book-vehicle')
  public async bookVehicle(
    @Query('passenger-latitude') passengerLatitude: number, @Query('passenger-longitude') passengerLongitude: number,
    @Query('destination-latitude') destinationLatitude: number, @Query('destination-longitude') destinationLongitude: number,
    @Query('uuid') uuid: string,
    @Session() session: Record<string, any>,
    @Res() response): Promise<Vehicle | null> {

    if (
      passengerLatitude == null ||
      passengerLongitude == null ||
      destinationLatitude == null ||
      destinationLongitude == null
    ) {
      response.status(HttpStatus.BAD_REQUEST).send({ message: 'Wrong location data' });
      return null;
    }
  
    try {
      const vehicle = await this.vehicleService.getVehicle(uuid);

      if (vehicle == null) {
        response.status(HttpStatus.NOT_FOUND).send({ message: 'ERROR: The vehicle can not be found!' });
        return null;
      }

      // There is a chance of declining the ride
      if (Math.random() * 100 <= DECLINING_CHANCE) {
        // Generate a random reason for declining the ride
        const randomIndex = Math.floor(Math.random() * DECLINING_REASONS.length);
        const reason = DECLINING_REASONS[randomIndex];

        response.status(HttpStatus.OK).send({ message: `The driver have declined the ride. Reason: ${reason}` });
        return null;
      }
      
      const passengerPosition: Position = {
        latitude: +passengerLatitude,
        longitude: +passengerLongitude
      };

      const destinationPosition: Position = {
        latitude: +destinationLatitude,
        longitude: +destinationLongitude
      };

      const vehiclePosition: Position = {
        latitude: vehicle.latitude,
        longitude: vehicle.longitude
      }

      // The time and date the start of the booking
      const dateOfBooking = new Date();
      // Calculate the total price
      const distanceToDestination = this.positionService.calculateDistance(passengerPosition, destinationPosition);
      const totalPrice = distanceToDestination * vehicle.pricePerKM + vehicle.startPrice;

      await this.vehicleService.book(vehicle);

      console.log('Vehicle is on the way. Please wait...')

      await this.vehicleService.drive({destinationPosition, passengerPosition, vehiclePosition})
      
      await this.vehicleService.finishRide(vehicle, destinationPosition);
  
      response.status(HttpStatus.OK).send({ message: 'Vehicle reached the desination. Thank you for using Drive Delta!' });

      console.log('Ride finished!');

      if (session.passenger == null) {
        throw new UnauthorizedException('Undable to save data in histroy. No passenger in session found')
      }

      // Saving the ride to the history
      await this.historyService.insert({
        email: session.passenger.email,
        vehicleId: vehicle.uuid,
        startLatitude: passengerLatitude,
        startLongitude: passengerLongitude,
        destinationLatitude: destinationLatitude,
        destinationLongitude: destinationLongitude,
        totalPrice: totalPrice,
        date: dateOfBooking
      } as any);

      return vehicle;
    } catch (e) {
      console.error(e);
    }

  }
}


