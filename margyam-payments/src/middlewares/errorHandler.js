import { logger, ApiResponse } from '../common/index.js';

export const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let errorCode  = err.messageCode || err.code || 'INTERNAL_SERVER_ERROR';
  let message    = err.message    || 'Something went wrong';

  logger.error(`[${req.method}] ${req.url}`, { statusCode, errorCode, stack: err.stack });

  if (err.name?.startsWith('PrismaClient')) {
    statusCode = 400;
    message    = 'Database error';
    errorCode  = 'DATABASE_ERROR';
  }
  if (statusCode === 500 && !err.isOperational) {
    message = 'An unexpected server error occurred.';
  }

  return new ApiResponse(res).error({
    statusCode,
    message,
    errorCode,
  });
};
