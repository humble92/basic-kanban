import Joi from 'joi';

// Request body schema for Post User
export const postUserSchema = Joi.object({
  name: Joi.string().max(50).trim().required(),
  permissionIds: Joi.array().items(Joi.number().integer()),
});

// Request body schema for Update User
export const updateUserSchema = Joi.object({
  name: Joi.string().max(50).trim(),
  permissionIds: Joi.array().items(Joi.number().integer()),
}).or("name", "permissionIds")