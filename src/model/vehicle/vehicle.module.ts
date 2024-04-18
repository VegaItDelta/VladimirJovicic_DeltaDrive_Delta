import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Vehicle, VehicleSchema } from './vehicle';
import { DatabaseModule } from '../../database/database.module';

@Module({
  controllers: [],
  providers: [],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
  ],
})
export class VehicleModule {}
