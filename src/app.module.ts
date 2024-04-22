import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PassengersModule, VehicleModule, HistoryModule, VehicleHelperService, Vehicle, VehicleSchema } from './model';
import { MongooseModule } from '@nestjs/mongoose';
import { ImportVehiclesCommand } from './database';
import { Connection } from 'mongoose';
import { CacheModule } from './cache';
import { SessionModule } from 'nestjs-session';
import { GuidService } from './services';
import { ReviewModule } from './model/review';

@Module({
  imports: [
    PassengersModule,
    VehicleModule,
    MongooseModule.forFeature([{ name: Vehicle.name, schema: VehicleSchema }]),
    CacheModule,
    SessionModule.forRoot({
      session: { secret: 'vladimir-super-secret-key' },
    }),
    HistoryModule,
    ReviewModule
  ],
  controllers: [AppController],
  providers: [
    AppService,
    VehicleHelperService,
    ImportVehiclesCommand,
    Connection,
    GuidService
  ],
})
export class AppModule {}
