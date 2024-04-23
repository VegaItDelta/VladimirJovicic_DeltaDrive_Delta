import { Injectable } from '@nestjs/common';
import { DrivingPositionData } from '../model/vehicle/vehicle.service';

/**
 * Service for handling queues
 */
@Injectable()
export class QueueService {
  private queue: DrivingPositionData[] = [];

  /**
   * 
   * @param data Adding a ride to the queue
   */
  public addToQueue(data: DrivingPositionData) {
    this.queue.push(data);
  }

  /**
   * Getter for the queue
   * @returns The queue
   */
  public getQueue() {
    return this.queue;
  }
}
