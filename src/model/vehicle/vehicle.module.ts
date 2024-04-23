import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './vehicle';
import { DatabaseModule } from '../../database/database.module';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { CacheModule } from '../../cache';
import { GuidService, PositionService } from '../../services';
import { Review, ReviewSchema, ReviewService } from '../review';
import { QueueService, WorkerService } from '../../queue';
import { HistoryService, History, HistorySchema } from '../history';
import { RouterModule } from '@nestjs/core';
import { CONSTRUCTOR_PREFIX } from '../../constants';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, PositionService, GuidService, ReviewService, WorkerService, QueueService, HistoryService],
  imports: [
    RouterModule.register([ { path: CONSTRUCTOR_PREFIX, module: VehicleModule } ]),
    DatabaseModule,
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    CacheModule,
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }]),
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }])

  ],
})
export class VehicleModule {}
