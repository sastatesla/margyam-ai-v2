class ApiError extends Error {
  constructor(statusCode, message, messageCode, isOperational = true, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.message = message;
    this.messageCode = messageCode;
    this.isOperational = isOperational;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }

  static BadRequest(message, messageCode = 'BAD_REQUEST', details = null) {
    return new ApiError(400, message, messageCode, true, details);
  }

  static Invalid(message, messageCode = 'INVALID', details = null) {
    return new ApiError(400, message, messageCode, true, details);
  }

  static AlreadyExists(message, messageCode = 'ALREADY_EXISTS', details = null) {
    return new ApiError(409, message, messageCode, true, details);
  }

  static Unauthorized(message, messageCode = 'UNAUTHORIZED', details = null) {
    return new ApiError(401, message, messageCode, true, details);
  }

  static Forbidden(message, messageCode = 'FORBIDDEN', details = null) {
    return new ApiError(403, message, messageCode, true, details);
  }

  static NotFound(message, messageCode = 'NOT_FOUND', details = null) {
    return new ApiError(404, message, messageCode, true, details);
  }

  static TooManyRequests(message = 'Too many requests', messageCode = 'RATE_LIMITED', details = null) {
    return new ApiError(429, message, messageCode, true, details);
  }

  static InternalServerError(message = 'An unexpected error occurred', messageCode = 'INTERNAL_SERVER_ERROR', details = null) {
    return new ApiError(500, message, messageCode, false, details);
  }
}

export default ApiError;
