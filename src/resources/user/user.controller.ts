import { Router, Request, Response, NextFunction } from 'express';
import Controller from '../../utils/interfaces/controller.interface';
import HttpException from '../../utils/exceptions/http.exception';
import validate from './user.validation';
import UserService from './user.service';
import { validationMiddleware, authenticated } from '../../middleware';
import updateDataInterface from '../../utils/interfaces/updateData';

class UserController implements Controller {
    public path = '/users';
    public router = Router();
    private UserService = new UserService();

    constructor() {
        this.initializeRoutes();
    }
    private initializeRoutes(): void {
        this.router.post(
            `${this.path}/register`,
            validationMiddleware(validate.register),
            this.register
        );

        this.router.post(
            `${this.path}/login`,
            validationMiddleware(validate.login),
            this.login
        );

        this.router.get(`${this.path}`, authenticated, this.getUser);

        this.router.delete(
            `${this.path}/delete/:id`,
            authenticated,
            this.deleteUser
        );

        this.router.patch(
            `${this.path}/update`,
            [authenticated, validationMiddleware(validate.updateUser)],
            this.updateUser
        );
    }

    private register = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const userRole = 'user';
            const { name, email, password } = req.body;
            const token = await this.UserService.register(
                name,
                email,
                password,
                userRole
            );

            return res.status(201).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private login = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const { email, password } = req.body;
            const token = await this.UserService.login(email, password);
            return res.status(200).json({ token });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private getUser(
        req: Request,
        res: Response,
        next: NextFunction
    ): Response | void {
        if (!req.user) {
            return next(new HttpException(404, 'User not found'));
        }
        return res.status(200).json({ user: req.user });
    }

    private deleteUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            if (!req.user || req.user.role !== 'admin') {
                return next(new HttpException(405, 'Not allowed'));
            }
            const id: string = req.params.id;
            const deletedUser = await this.UserService.delete(id);
            return res.status(200).json({ deletedUser });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };

    private updateUser = async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<Response | void> => {
        try {
            const id = req.user.id;
            const { old_password, name, email, password } = req.body;

            if (!old_password)
                return next(
                    new HttpException(400, 'You have to enter old password')
                );
            const data: updateDataInterface = { id, old_password };

            if (name) data['name'] = name;
            if (email) data['email'] = email;
            if (password) data['password'] = password;

            const updatedUser = await this.UserService.update(data);

            return res.status(200).json({ updatedUser });
        } catch (error: any) {
            next(new HttpException(400, error.message));
        }
    };
}

export default UserController;
