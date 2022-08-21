import { Document } from 'mongoose';

interface Flight extends Document {
    name: string;
    from: string;
    destination: string;
    transplants: string;
    departureDate: string;
    arrivalDate: string;
    seatsCount: number;
}

export default Flight;
