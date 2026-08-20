import Joi from 'joi';
import { dateSchema, timeSchema, languageSchema } from '../common/index.js';

export const updateProfileSchema = {
  body: Joi.object({
    fullName:    Joi.string().trim().min(2).max(80).optional(),
    email:       Joi.string().email().lowercase().optional(),
    gender:      Joi.string().valid('MALE', 'FEMALE', 'OTHER').optional(),
    dateOfBirth: dateSchema.optional(),
    timeOfBirth: timeSchema.optional(),
    birthPlace:  Joi.string().trim().optional(),
    latitude:    Joi.number().min(-90).max(90).optional(),
    longitude:   Joi.number().min(-180).max(180).optional(),
    language:    languageSchema.optional(),
  }),
};
