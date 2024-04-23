import { Injectable } from '@nestjs/common';
import { DrivingPositionData } from '../model/vehicle/vehicle.service';

export interface QueueData {
  taskId: string;
  data: DrivingPositionData;
  processing: boolean
}


/**
 * Service for handling queues
 */
@Injectable()
export class QueueService {
  private queue: QueueData[] = [];

  /**
   * 
   * @param data Adding a ride to the queue
   */
  public addToQueue(data: QueueData) {
    this.queue.push(data);
  }

  /**
   * Getter for the queue
   * @returns The queue
   */
  public getQueue() {
    return this.queue;
  }

  /**
   * Removes data from the queue
   * @param data The data to remove from the queue
   */
  public removeFromQueue(data: QueueData) {
    const index = this.queue.findIndex(item => item.taskId === data.taskId);
    if (index !== -1) {
      this.queue.splice(index, 1);
    }
  }
}
