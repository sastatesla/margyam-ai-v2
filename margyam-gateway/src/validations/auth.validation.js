import Joi from 'joi';
import { phoneSchema } from '../common/index.js';

export const sendOtpSchema = {
  body: Joi.object({ mobile: phoneSchema.required() }),
};

export const verifyOtpSchema = {
  body: Joi.object({
    mobile: phoneSchema.required(),
    otp:    Joi.number().integer().min(100000).max(999999).required(),
  }),
};

export const signupSchema = {
  body: Joi.object({
    mobile:   phoneSchema.required(),
    fullName: Joi.string().trim().min(2).max(80).required(),
    email:    Joi.string().email().lowercase().optional(),
  }),
};

export const loginSchema = {
  body: Joi.object({
    mobile: phoneSchema.required(),
    otp:    Joi.number().integer().required(),
  }),
};
