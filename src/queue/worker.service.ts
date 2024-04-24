import { Injectable } from '@nestjs/common';
import { QueueService } from './queue.service';
import { GuidService, PositionService } from '../services';
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
    private readonly guidService: GuidService,
  ) { }

  /**
   * Adds ride to the queue
   * @param data The ride data
   */
  public addToQueue(data: DrivingPositionData): void {
    this.queueService.addToQueue({
      data,
      processing: false,
      taskId: this.guidService.generateGuid()
    });
  }

  /**
   * Processing the queue and simulating driving from the driver position to the passanger and driving the passenger to the destination
   */
  public async processQueue(): Promise<void> {
    try {
      const queue = this.queueService.getQueue();
      // Promise.all is used to have multiple queues in parallell
      await Promise.all(queue.map(async (task) => {
        // If the task is already processing skip it
        if (!task.processing) {
          // If the task did not start yet set the processing status to true and start processing
          task.processing = true;
          await this.process(task.data);
          // After the task is finished remove the it from the queue
          this.queueService.removeFromQueue(task);
        }
      }));
    } catch (e) {
      console.error(e);
    }
  }

  /**
   * Process the data to drive to the passenger and then to the destination
   * @param data The data to process
   */
  private async process(data: DrivingPositionData): Promise<void> {
    // Get the data from the queue
    const { destinationPosition, passengerPosition, vehiclePosition, email, totalPrice, vehicle } = data;

    console.log(`Driver ${vehicle.firstName} ${vehicle.lastName} is comming to your destination! ${email}`);
    // Comming to pick up the passnger
    await this.positionService.move(vehicle, email, vehiclePosition, passengerPosition);

    console.log(`Taking ${email} to destination...`);
    // Bringing the passenger to the destination
    await this.positionService.move(vehicle, email, passengerPosition, destinationPosition);

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

    console.log(`Vehicle ${vehicle.brand} - ${vehicle.firstName} ${vehicle.lastName} reached the desination. Thank you ${email} for using Drive Delta!`);
  }
}
