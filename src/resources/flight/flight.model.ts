import { Schema, model } from 'mongoose';
import Flight from './flight.interface';

const FlightSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
        },
        from: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
        },
        transplants: {
            type: Array,
            required: false,
        },
        departureDate: {
            type: String,
            required: true,
        },
        arrivalDate: {
            type: String,
            required: true,
        },
        seatsCount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

export default model<Flight>('Flight', FlightSchema);
