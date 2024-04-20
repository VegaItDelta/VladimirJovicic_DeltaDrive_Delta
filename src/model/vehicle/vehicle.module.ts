import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './vehicle';
import { DatabaseModule } from '../../database/database.module';
import { VehicleController } from './vehicle.controller';
import { VehicleService } from './vehicle.service';
import { CacheModule } from '../../cache';
import { PositionService } from '../../services';

@Module({
  controllers: [VehicleController],
  providers: [VehicleService, PositionService],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    CacheModule,
  ],
})
export class VehicleModule {}
