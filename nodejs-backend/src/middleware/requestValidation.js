import Joi from 'joi';
import { BadRequest } from '../error';

/**
 * Validate id in the path parameter if it's a number
 */
export const idPathValidation = async (req, res, next) => {
  try {
    await Joi.object({ id: Joi.number().integer().min(1).required() }).validateAsync({ id: req.params.id });
  } catch (error) {
    // move to another matching route
    return next('route');
  }
  next();
};

/**
 * Validate request body with a Joi schema
 *
 * @param schema request body validation schema
 */
export const requestBodyValidate = schema => async (req, res, next) => {
  try {
    await schema.validateAsync(req.body, { abortEarly: false });
  } catch (error) {
    next(new BadRequest(error));
  }
  next();
};
