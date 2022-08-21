import { Request, Response, NextFunction } from 'express';
import HttpException from '../utils/exceptions/http.exception';

function errorMiddleware(
    err: HttpException,
    req: Request,
    res: Response,
    next: NextFunction
): void {
    const status = err.status || 500;
    const message = err.message || 'Something wend wrong';
    res.status(status).json({ status, message });
}

export { errorMiddleware };
