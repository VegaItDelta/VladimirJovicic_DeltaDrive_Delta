import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Vehicle } from '../vehicle';

@Schema()
export class Review extends Document {

    @Prop()
    public uuid: string;

    @Prop()
    public email: string;

    @Prop()
    public vehicleId: string;

    @Prop()
    public price: number;

    @Prop()
    public rate?: number;

    @Prop()
    public comment?: string;

    @Prop()
    public completed: boolean;

    @Prop()
    public dateOfRide: Date;

    public vehicle?: Vehicle;
}

export const ReviewSchema = SchemaFactory.createForClass(Review);
