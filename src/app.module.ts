import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassengersModule } from './model/passenger';
import { VehicleModule } from './model/vehicle';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './model/vehicle/vehicle';
import { ImportVehiclesCommand } from './database';
import { Connection } from 'mongoose';
import { VehicleHelperService } from './model/vehicle/vehicle-helper.service';
import { CacheModule } from './cache';

@Module({
  imports: [
    PassengersModule,
    VehicleModule,
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    CacheModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    VehicleHelperService,
    ImportVehiclesCommand,
    Connection,
  ],
})
export class AppModule {}
