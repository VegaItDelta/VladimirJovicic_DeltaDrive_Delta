import { Module } from '@nestjs/common';
import { PassengersController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Passenger, PassengerSchema } from './passenger';
import { DatabaseModule } from '../../database';
import { RouterModule } from '@nestjs/core';
import { CONSTRUCTOR_PREFIX } from '../../constants';

@Module({
  controllers: [PassengersController],
  providers: [PassengerService],
  imports: [
    RouterModule.register([ { path: CONSTRUCTOR_PREFIX, module: PassengersModule } ]),
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Passenger.name, schema: PassengerSchema },
    ]),
  ],
})
export class PassengersModule {}
