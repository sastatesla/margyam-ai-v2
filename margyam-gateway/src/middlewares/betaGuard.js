import { ApiError } from '../common/index.js';

/**
 * betaGuard — Blocks access for users who have not been approved for beta access.
 * Must be used AFTER `authenticate` middleware.
 */
export const betaGuard = (req, res, next) => {
  if (!req.user?.isBetaApproved) {
    return next(ApiError.Forbidden('Beta access is required. Please join the waitlist.', 'BETA_REQUIRED'));
  }
  next();
};
