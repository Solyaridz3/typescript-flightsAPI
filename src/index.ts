import FlightController from './resources/flight/flight.controller';
import 'dotenv/config';
import App from './app';
import validateEnv from './utils/validateEnv';
import UserController from './resources/user/user.controller';

validateEnv();

export const app = new App(
    [new FlightController(), new UserController()],
    Number(process.env.PORT)
);

app.listen();
