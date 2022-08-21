import { Request, Response, NextFunction, RequestHandler } from 'express';
import Joi from 'joi';

function validationMiddleware(schema: Joi.Schema): RequestHandler {
    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ): Promise<void> => {
        const validationOption = {
            abortEarly: false,
            allowUnknown: true,
            stripUnknown: true,
        };
        try {
            const value = await schema.validateAsync(
                req.body,
                validationOption
            );
            req.body = value;
            next();
        } catch (error: any) {
            const errors: string[] = [];
            error.details.forEach((error: Joi.ValidationErrorItem) => {
                errors.push(error.message);
            });
            res.status(400).send({ errors });
        }
    };
}

export { validationMiddleware };
