import Joi from 'joi';

// Request body schema for Post Card
export const postCardSchema = Joi.object({
  text: Joi.string().trim().max(50).required(),
  listId: Joi.number().integer().min(0).required(),
});

// Request body schema for Update Card
export const updateCardSchema = Joi.object({
  text: Joi.string().trim().max(50),
  listId: Joi.number().integer().min(0).when("index", {
    is: Joi.exist(),
    then: Joi.required()
  }),
  index: Joi.number().integer().min(0),
}).with('listId', 'index').or('text', 'listId')