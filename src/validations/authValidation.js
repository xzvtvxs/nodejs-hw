import { Joi, Segments } from "celebrate";


export const registerUserSchema = {
  [Segments.BODY]: Joi.object({
    username: Joi.string(),
    email: Joi.string().required(),
    password: Joi.string.required().min(8),
  })
};

export const loginUserSchema = {
  [Segments.BODY]: Joi.object({
    email: Joi.string().required(),
    password: Joi.string.required().min(8),
  })
};
