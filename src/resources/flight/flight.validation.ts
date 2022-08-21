import Joi from 'joi';

const create = Joi.object({
    name: Joi.string().required(),
    from: Joi.string().required(),
    destination: Joi.string().required(),
    transplants: Joi.array(),
    departureDate: Joi.string().required(),
    arrivalDate: Joi.string().required(),
    seatsCount: Joi.number().required(),
});

const update = Joi.object({
    name: Joi.string(),
    from: Joi.string(),
    destination: Joi.string(),
    transplants: Joi.array(),
    departureDate: Joi.string(),
    arrivalDate: Joi.string(),
    seatsCount: Joi.number(),
});

export default { create, update };
