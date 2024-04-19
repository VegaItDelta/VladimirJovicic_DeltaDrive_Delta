import { Module } from '@nestjs/common';
import { PassengersController } from './passenger.controller';
import { PassengerService } from './passenger.service';
import { MongooseModule } from '@nestjs/mongoose';
import { Passenger, PassengerSchema } from './passenger';
import { DatabaseModule } from '../../database';

@Module({
  controllers: [PassengersController],
  providers: [PassengerService],
  imports: [
    DatabaseModule,
    MongooseModule.forFeature([
      { name: Passenger.name, schema: PassengerSchema },
    ]),
  ],
})
export class PassengersModule {}
