import Joi from 'joi';

// Request body schema for Post List
export const postListSchema = Joi.object({
  title: Joi.string().trim().max(50).required(),
});

// Request body schema for Update List
export const updateListSchema = Joi.object({
  index: Joi.number().integer().min(0).required(),
})