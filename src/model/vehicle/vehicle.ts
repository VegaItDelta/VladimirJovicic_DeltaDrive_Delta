import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicle extends Document {
  @Prop()
  public uuid: string;

  @Prop()
  public brand: string;

  @Prop()
  public firstName: string;

  @Prop()
  public lastName: string;

  @Prop()
  public latitude: number;

  @Prop()
  public longitude: number;

  @Prop()
  public startPrice: number;

  @Prop()
  public pricePerKM: number;

  @Prop()
  public booked: boolean;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
