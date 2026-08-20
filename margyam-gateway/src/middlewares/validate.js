import Joi from 'joi';
import { pick, ApiError } from '../common/index.js';

/**
 * validate — Joi schema validation middleware factory.
 * Validates req.body, req.params, and req.query against a schema object.
 *
 * Usage:
 *   router.post('/signup', validate(signupSchema), authController.signup);
 *
 * Schema format:
 *   export const signupSchema = { body: Joi.object({ ... }) };
 */
export const validate = (schema) => (req, res, next) => {
  const validSchema = pick(schema, ['params', 'query', 'body']);
  const obj         = pick(req, Object.keys(validSchema));

  const { value, error } = Joi.compile(validSchema)
    .prefs({ errors: { label: 'key' }, abortEarly: false })
    .validate(obj);

  if (error) {
    const message = error.details.map((d) => d.message).join(', ');
    return next(ApiError.BadRequest(message, 'VALIDATION_ERROR', error.details));
  }

  Object.assign(req, value);
  next();
};
