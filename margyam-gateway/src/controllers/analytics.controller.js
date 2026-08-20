import { ApiResponse } from '../common/index.js';
import analyticsService from '../services/analytics.service.js';
import prisma from '../configs/db.js';

class AnalyticsController {
  constructor() {
    this.getDashboardStats = this.getDashboardStats.bind(this);
    this.trackEvent        = this.trackEvent.bind(this);
  }

  async getDashboardStats(req, res, next) {
    try {
      const [totalUsers, activeToday, totalChats] = await Promise.all([
        prisma.user.count(),
        prisma.user.count({
          where: {
            userMetadata: {
              is: { lastActiveAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) } }
            }
          }
        }),
        prisma.chatMessage.count(),
      ]);

      return new ApiResponse(res).success({
        data: { totalUsers, activeToday, totalChats }
      });
    } catch (e) { next(e); }
  }

  async trackEvent(req, res, next) {
    try {
      const userId = req.user?.userId;
      if (userId) {
        await analyticsService.trackUserMetadata(userId, {
          userAgent: req.headers['user-agent'],
          ipAddress: req.ip,
        });
      }
      return new ApiResponse(res).success({ message: 'Event tracked' });
    } catch (e) { next(e); }
  }
}

export default new AnalyticsController();
