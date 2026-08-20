import prisma from '../configs/db.js';
import { logger } from '../common/index.js';

class AuditService {
  async log({ userId, action, resource, metadata = {} }) {
    try {
      await prisma.auditLog.create({
        data: { userId, action, resource, metadata }
      });
    } catch (err) {
      // Audit logging must never break the main flow
      logger.warn('[Audit] Failed to log action', { action, error: err.message });
    }
  }
}

export default new AuditService();
