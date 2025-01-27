import Joi from "joi";
import { UserRole } from "../models/userModel";

export const registerUserSchema = Joi.object({
  role: Joi.string().valid(UserRole.CLIENT, UserRole.TALENT).required(),
  firstName: Joi.string().required(),
  lastName: Joi.string().required(),
  email: Joi.string().email().required(),
  password: Joi.string().min(6).required(),
}).unknown(false);

export const loginUserSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
}).unknown(false);
