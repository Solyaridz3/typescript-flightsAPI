import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import FlightService from './flight.service';
import HttpException from '../../utils/exceptions/http.exception';
import { validationMiddleware, authenticated } from '../../middleware/';
import validate from './flight.validation';

class FlightController implements Controller {
    public path = '/flights';
    public router = Router();
    private FlightService = new FlightService();

    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes(): void {
        this.router.post(
            this.path,
            [authenticated, validationMiddleware(validate.create)],
            this.create
        );

        this.router.get(this.path, this.show);

        this.router.get(`${this.path}/:id`, this.showOne);

        this.router.delete(`${this.path}/:id`, authenticated, this.delete);

        this.router.patch(
            `${this.path}/update/:id`,
            [authenticated, validationMiddleware(validate.update)],
            this.update
        );
    }

    private create = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (req.user.role !== 'admin')
                return next(new HttpException(403, 'Forbidden'));
            const flight = await this.FlightService.create(req.body);
            return res.status(201).json({ flight });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private show = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const flights = await this.FlightService.show();
            return res.status(200).json({ flights });
        } catch (error: any) {
            next(new HttpException(404, error.message));
        }
    };

    private showOne = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.params.id;
            const flight = await this.FlightService.showOne(id);
            return res.status(200).json({ flight });
        } catch (error: any) {
            next(new HttpException(404, error.message));
        }
    };

    private delete = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (req.user.role !== 'admin')
                return next(new HttpException(403, 'Forbidden'));
            const id: string = req.params.id;
            const deletedFlight = await this.FlightService.delete(id);
            return res.status(200).json({ deletedFlight });
        } catch (error: any) {
            return next(new HttpException(400, error.message));
        }
    };

    private update = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (req.user.role !== 'admin')
                return next(new HttpException(403, 'Forbidden'));
            const id = req.params.id;
            const updatedFlight = await this.FlightService.update(id, req.body);
            return res.status(200).json({ updatedFlight });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default FlightController;
