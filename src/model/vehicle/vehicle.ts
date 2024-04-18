import { Schema, SchemaFactory, Prop } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Vehicle extends Document {
  @Prop()
  private brand: string;

  @Prop()
  private firstName: string;

  @Prop()
  private lastName: string;

  @Prop()
  private latitude: number;

  @Prop()
  private longitude: number;

  @Prop()
  private startPrice: number;

  @Prop()
  private pricePerKM: number;
}

export const VehicleSchema = SchemaFactory.createForClass(Vehicle);
