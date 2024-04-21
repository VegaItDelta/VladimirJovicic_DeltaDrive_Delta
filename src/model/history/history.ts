import { Schema, Prop, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema()
export class History extends Document {
    @Prop()
    public passengerId: string;

    @Prop()
    public vehicleId: string;

    @Prop()
    public startLatitude: number;

    @Prop()
    public startLongitude: number;

    @Prop()
    public destinationLatitude: number;

    @Prop()
    public destinationLongitude: number;

    @Prop()
    public totalPrice: number;

    @Prop()
    public date: Date;
}

export const HistorySchema = SchemaFactory.createForClass(History);