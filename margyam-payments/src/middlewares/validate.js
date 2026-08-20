import Joi from 'joi';
import { pick, ApiError } from '../common/index.js';

export const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const obj         = pick(req, Object.keys(validSchema));
  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(obj);
  if (error) {
    return next(ApiError.BadRequest(error.details.map((d) => d.message).join(', '), 'VALIDATION_ERROR'));
  }
  Object.assign(req, value);
  next();
};
