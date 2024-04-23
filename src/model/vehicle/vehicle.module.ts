import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './vehicle';
import { DatabaseModule } from '../../database/database.module';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { CacheModule } from '../../cache';
import { HistorySchema, History } from '../history';
import { GuidService, PositionService } from '../../services';
import { HistoryService } from '../history/history.service';
import { Review, ReviewSchema, ReviewService } from '../review';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, PositionService, HistoryService, GuidService, ReviewService],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    CacheModule,
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
    MongooseModule.forFeature([{ name: Review.name, schema: ReviewSchema }])
  ],
})
export class VehicleModule {}
