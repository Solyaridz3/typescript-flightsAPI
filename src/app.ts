import express, { Application } from 'express';
import Controller from './utils/interfaces/controller.interface';
import mongoose from 'mongoose';
import { errorMiddleware as ErrorHandler } from './middleware';
import morgan from 'morgan';
import compression from 'compression';
import helmet from 'helmet';
import cors from 'cors';

class App {
    public express: Application;
    public port: number;

    constructor(controllers: Controller[], port: number) {
        this.express = express();
        this.port = port;
        this.initializeDatabaseConnection();
        this.initializeMiddleware();
        this.initializeControllers(controllers);
        this.initializeErrorHandling();
    }

    private initializeDatabaseConnection(): void {
        const { MONGO_URI } = process.env;
        mongoose.connect(`${MONGO_URI}`);
    }

    private initializeMiddleware(): void {
        this.express.use(helmet());
        this.express.use(cors());
        this.express.use(morgan('dev'));
        this.express.use(express.urlencoded({ extended: false }));
        this.express.use(express.json());
        this.express.use(compression());
    }

    private initializeControllers(controllers: Controller[]): void {
        controllers.forEach((controller: Controller) => {
            this.express.use('/api', controller.router);
        });
    }

    private initializeErrorHandling(): void {
        this.express.use(ErrorHandler);
    }

    public listen(): void {
        this.express.listen(this.port, () => {
            console.log(`App is running on port ${this.port}`);
        });
    }
}

export default App;
