import prisma from '../configs/db.js';

class AnalyticsService {
  parseUserAgent(userAgentString) {
    if (!userAgentString) return { os: 'Unknown', browser: 'Unknown', deviceType: 'Unknown' };

    let os = 'Unknown';
    let browser = 'Unknown';
    let deviceType = 'Desktop';
    const ua = userAgentString.toLowerCase();

    if (ua.includes('windows')) os = 'Windows';
    else if (ua.includes('macintosh') || ua.includes('mac os')) os = 'macOS';
    else if (ua.includes('android')) os = 'Android';
    else if (ua.includes('iphone') || ua.includes('ipad')) os = 'iOS';

    if (ua.includes('chrome')) browser = 'Chrome';
    else if (ua.includes('firefox')) browser = 'Firefox';
    else if (ua.includes('safari')) browser = 'Safari';

    if (ua.includes('mobile') || ua.includes('android') || ua.includes('iphone')) deviceType = 'Mobile';

    return { os, browser, deviceType };
  }

  async trackUserMetadata(userId, data = {}) {
    try {
      const { userAgent, ipAddress } = data;
      const { os, browser, deviceType } = this.parseUserAgent(userAgent);

      await prisma.user.update({
        where: { id: userId },
        data: {
          userMetadata: {
            set: {
              deviceType,
              browser,
              os,
              ipAddress: ipAddress || undefined,
              lastActiveAt: new Date(),
            },
          },
        },
      });
    } catch (err) {}
  }
}

export default new AnalyticsService();
