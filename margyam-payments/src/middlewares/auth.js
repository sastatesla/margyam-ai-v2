import { verifyToken, ApiError } from '../common/index.js';

export const authenticate = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) throw ApiError.Unauthorized('No token provided');
    req.user = verifyToken(authHeader.split(' ')[1]);
    next();
  } catch (e) { next(e); }
};
