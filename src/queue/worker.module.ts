import { Module } from '@nestjs/common';
import { WorkerService } from './worker.service';
import { HistoryService } from '../model';
import { PositionService } from '../services';
import { QueueService } from './queue.service';

@Module({
  providers: [WorkerService, QueueService, PositionService, HistoryService]
})
export class WorkerModule { }
