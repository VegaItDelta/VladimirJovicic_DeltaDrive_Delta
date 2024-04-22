import { Controller, Get, HttpStatus, Query, UseInterceptors, Res, Session, HttpException } from '@nestjs/common';
import { VehicleService } from './vehicle.service';
import { Position, PositionService } from '../../services';
import { VehicleOffer } from './vehicle-offer';
import { HistoryService } from '../history/history.service';
import { AuthentificationInterceptor } from '../../interceptor/authentification.interceptor';
import { ReviewService } from '../review';

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
@UseInterceptors(AuthentificationInterceptor)
@Controller('vehicle')
export class VehicleController {
  constructor(
    private readonly vehicleService: VehicleService,
    private readonly positionService: PositionService,
    private readonly historyService: HistoryService,
    private readonly reviewService: ReviewService,
  ) {}

  @Get('/getAll')
  public async getAllVehicles(@Res() response): Promise<void> {
    try {
      const vehicles = await this.vehicleService.getAllVehicles();
      response.status(HttpStatus.OK).send({ message: `${vehicles.length} vehciles found!`, data: vehicles });
    } catch (e) {
      response.status(e.getStatus()).send({ message: e.message });
    }
  }

  @Get('get-closest-vehicles')
  public async getClosestVehicles(
    @Query('passenger-latitude') passengerLatitude: number, @Query('passenger-longitude') passengerLongitude: number,
    @Query('destination-latitude') destinationLatitude: number, @Query('destination-longitude') destinationLongitude: number,
    @Res() response
  ): Promise<void> {
    try {
      if (
        passengerLatitude == null ||
        passengerLongitude == null ||
        destinationLatitude == null ||
        destinationLongitude == null
      ) {
          throw new HttpException('Wrong location data', HttpStatus.BAD_REQUEST);
      }
   
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

      const vehicleOffers: VehicleOffer[] = await this.vehicleService.findClosestVehicles(passengerPosition, vehicles, CLOSEST_VEHICLES_COUNT, distanceToDestination);
      response.status(HttpStatus.OK).send({ message: `${vehicleOffers.length} offers found!`, vehicleDistances: vehicleOffers });
    } catch(e) {
      response.status(e.getStatus()).send({ message: e.message });
    }
  }

  @Get('book-vehicle')
  public async bookVehicle(
    @Query('passenger-latitude') passengerLatitude: number, @Query('passenger-longitude') passengerLongitude: number,
    @Query('destination-latitude') destinationLatitude: number, @Query('destination-longitude') destinationLongitude: number,
    @Query('uuid') uuid: string,
    @Session() session: Record<string, any>,
    @Res() response): Promise<void> {

    try {
      if (
      passengerLatitude == null ||
      passengerLongitude == null ||
      destinationLatitude == null ||
      destinationLongitude == null
      ) {
        throw new HttpException('Wrong location data', HttpStatus.BAD_REQUEST);
      } 
    
      const vehicle = await this.vehicleService.getVehicle(uuid);

      if (vehicle == null) {
        throw new HttpException('Vehicle not found.', HttpStatus.NOT_FOUND);
      }

      // There is a chance of declining the ride
      if (Math.random() * 100 <= DECLINING_CHANCE) {
        // Generate a random reason for declining the ride
        const randomIndex = Math.floor(Math.random() * DECLINING_REASONS.length);
        const reason = DECLINING_REASONS[randomIndex];

        response.status(HttpStatus.OK).send({ message: `The driver have declined the ride. Reason: ${reason}` });
        return;
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
  
      console.log('Ride finished!');

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

      await this.reviewService.insertReviewRequest(session.passenger.email, vehicle.uuid, totalPrice);

      response.status(HttpStatus.OK).send({ message: 'Vehicle reached the desination. Thank you for using Drive Delta!' });

    } catch (e) {
      response.status(e.getStatus()).send({ message: e.message });
    }

  }
}
