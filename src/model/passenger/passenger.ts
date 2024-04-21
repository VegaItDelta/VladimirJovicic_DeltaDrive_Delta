import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class Passenger extends Document {
  @Prop()
  public email: string;

  @Prop()
  public password: string;

  @Prop()
  private firstName: string;

  @Prop()
  private lastName: string;

  @Prop()
  private datOfBirth: Date;

}

export const PassengerSchema = SchemaFactory.createForClass(Passenger);
