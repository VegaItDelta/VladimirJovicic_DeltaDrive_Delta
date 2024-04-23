import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';
import { PositionService } from '../services';
import { DrivingPositionData } from '../model';
import { ReviewService } from '../model/review/review.service';
import { HistoryService } from '../model/history/history.service';
import { VehicleService } from '../model/vehicle/vehicle.service';

@Injectable()
export class WorkerService {
  constructor(
    private readonly queueService: QueueService,
    private readonly positionService: PositionService,
    private readonly historyService: HistoryService,
    private readonly reviewService: ReviewService,
    private readonly vehicleService: VehicleService,
  ) { }

  /**
   * Adds ride to the queue
   * @param data The ride data
   */
  public addToQueue(data: DrivingPositionData): void {
    this.queueService.addToQueue(data);
  }

  /**
   * Processing the queue and simulating driving from the driver position to the passanger and driving the passenger to the destination
   */
  public async processQueue(): Promise<void> {
    try {
      const queue = this.queueService.getQueue();
      // Promise.all is used to have multiple queues in parallell
      await Promise.all(queue.map(async (task) => {

        // Get the data from the queue
        const { destinationPosition, passengerPosition, vehiclePosition, email, totalPrice, vehicle } = task;

        console.log(`Driver ${vehicle.firstName} ${vehicle.lastName} is comming to your destination!`);
        // Comming to pick up the passnger
        await this.positionService.move(vehicle, vehiclePosition, passengerPosition);

        console.log('Taking you to your destination...');
        // Bringing the passenger to the destination
        await this.positionService.move(vehicle, passengerPosition, destinationPosition);

        // After the ride finished add a history record of the ride
        await this.historyService.insert({
          email,
          vehicleId: vehicle.uuid,
          startLatitude: passengerPosition.latitude,
          startLongitude: passengerPosition.longitude,
          destinationLatitude: destinationPosition.latitude,
          destinationLongitude: destinationPosition.longitude,
          totalPrice,
          date: new Date()
        } as any);

        // Add an empty review request for the user so he can review the ride
        await this.reviewService.insertReviewRequest(email, vehicle.uuid, totalPrice);

        // Wrap up the ride by making the driver avaiblable again and changing his position
        await this.vehicleService.finishRide(vehicle, destinationPosition);

        console.log('Vehicle reached the desination. Thank you for using Drive Delta!');
      }));
    } catch (e) {
      throw new Error(e);
    }
  }
}
