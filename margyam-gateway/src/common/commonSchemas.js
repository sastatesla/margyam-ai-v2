import Joi from 'joi';

export const paginationSchema = Joi.object({
  page:  Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(20),
});

export const objectIdSchema = Joi.string().hex().length(24).required();

export const dateSchema = Joi.string()
  .pattern(/^\d{4}-\d{2}-\d{2}$/)
  .message('Date must be in YYYY-MM-DD format');

export const timeSchema = Joi.string()
  .pattern(/^\d{2}:\d{2}$/)
  .message('Time must be in HH:MM format');

export const phoneSchema = Joi.string()
  .pattern(/^[6-9]\d{9}$/)
  .message('Enter a valid 10-digit Indian mobile number');

export const languageSchema = Joi.string()
  .valid('en', 'hi', 'ta', 'te', 'kn', 'ml', 'bn', 'mr', 'gu', 'pa')
  .default('en');
