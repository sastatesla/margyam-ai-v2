import { logger, ApiResponse } from '../common/index.js';

/**
 * errorHandler — Global Express error handler.
 * Must be registered LAST in app.js (after all routes).
 * Handles ApiError instances and unknown errors uniformly.
 */
export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode  = err.messageCode || err.code || 'INTERNAL_SERVER_ERROR';
  let message    = err.message    || 'Something went wrong';

  // Log full error server-side
  logger.error(`[${req.method}] ${req.url}`, {
    statusCode,
    errorCode,
    message,
    stack: err.stack,
  });

  // Mask Prisma schema errors from the client
  if (err.name === 'PrismaClientKnownRequestError' || err.name === 'PrismaClientValidationError') {
    statusCode = 400;
    message    = 'A database error occurred. Please check your input.';
    errorCode  = 'DATABASE_ERROR';
  }

  // Obfuscate non-operational 500 errors for the client
  if (statusCode === 500 && !err.isOperational) {
    message   = 'An unexpected server error occurred. Please try again later.';
    errorCode = 'INTERNAL_SERVER_ERROR';
  }

  return new ApiResponse(res).error({
    statusCode,
    message,
    errorCode,
  });
};
