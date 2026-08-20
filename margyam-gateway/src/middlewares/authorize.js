import { ApiError } from '../common/index.js';

/**
 * authorize — Role-based access control (RBAC) guard.
 * Must be used AFTER `authenticate` middleware.
 *
 * Usage:
 *   router.use(authenticate, authorize(UserRole.ADMIN));
 *   router.use(authenticate, authorize(UserRole.ADMIN, UserRole.ASTROLOGER));
 */
export const authorize = (...allowedRoles) => {
  return (req, res, next) => {
    if (!req.user?.roleId) {
      return next(ApiError.Forbidden('Access denied: no role assigned'));
    }
    if (!allowedRoles.includes(req.user.roleId)) {
      return next(ApiError.Forbidden(`Access denied: requires one of [${allowedRoles.join(', ')}]`));
    }
    next();
  };
};
