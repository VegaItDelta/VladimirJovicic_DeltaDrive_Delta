import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './vehicle';
import { DatabaseModule } from '../../database/database.module';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { CacheModule } from '../../cache';
import { PositionService } from '../../services';
import { HistoryService } from '../history/history.service';
import { HistorySchema, History } from '../history';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, PositionService, HistoryService],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    CacheModule,
    MongooseModule.forFeature([{ name: History.name, schema: HistorySchema }]),
  ],
})
export class VehicleModule {}
