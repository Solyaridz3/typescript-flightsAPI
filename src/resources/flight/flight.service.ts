import FlightModel from './flight.model';
import Flight from './flight.interface';

class FlightService {
    private flight = FlightModel;

    public async create(data: Flight): Promise<Flight> {
        try {
            const newFlight = await this.flight.create(data);
            return newFlight;
        } catch {
            throw new Error('Unable to create flight');
        }
    }

    public async show(): Promise<Flight[]> {
        try {
            const allFlights = await this.flight.find().exec();
            return allFlights;
        } catch {
            throw new Error('Unable to find flights');
        }
    }

    public async showOne(id: string): Promise<Flight> {
        try {
            const flight = await this.flight.findOne({ _id: id });
            return flight as Flight;
        } catch {
            throw new Error('Unable to find that flight');
        }
    }

    public async delete(id: string): Promise<Flight | void> {
        try {
            const deletedFlight = await this.flight.findOneAndDelete({
                _id: id,
            });
            return deletedFlight as Flight;
        } catch {
            throw new Error('Unable to delete this flight');
        }
    }

    public async update(id: string, data: Flight) {
        try {
            const updatedFlight = await this.flight.findOneAndUpdate(
                { _id: id },
                data,
                {
                    new: true,
                    runValidators: true,
                }
            );
            return updatedFlight;
        } catch {
            throw new Error(
                'Unable to update this flight or flight does not exists'
            );
        }
    }
}

export default FlightService;
