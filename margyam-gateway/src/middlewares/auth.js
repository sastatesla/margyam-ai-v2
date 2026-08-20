import { verifyToken, ApiError } from '../common/index.js';
import prisma from '../configs/db.js';

/**
 * authenticate — Verifies the JWT from the Authorization header.
 * Attaches the decoded payload to req.user.
 * Also fire-and-forgets a lastActiveAt update for regular users.
 */
export const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith('Bearer ')) {
      throw ApiError.Unauthorized('No token provided');
    }

    const token   = authHeader.split(' ')[1];
    const decoded = verifyToken(token);  // throws ApiError on expiry/invalid

    // Verify user still exists in DB
    const user = await prisma.user.findUnique({ where: { id: decoded.userId } });
    if (!user) throw ApiError.Unauthorized('User no longer exists');

    req.user = decoded;

    // Non-blocking lastActiveAt update
    setImmediate(() => {
      prisma.userMetadata.upsert({
        where:  { userId: decoded.userId },
        create: { userId: decoded.userId, lastActiveAt: new Date() },
        update: { lastActiveAt: new Date() },
      }).catch(() => {});
    });

    next();
  } catch (e) { next(e); }
};
