import { logger, NotificationChannel } from '../common/index.js';

/**
 * NotificationService — Dispatches push notifications and emails.
 * TODO: Wire up Firebase Admin SDK (FCM) and Nodemailer/Resend.
 */
class NotificationService {
  async sendPush({ userId, title, body, data = {} }) {
    // TODO: Implement FCM push via firebase-admin
    logger.info('[Notification] Push queued', { userId, title });
  }

  async sendEmail({ to, subject, html }) {
    // TODO: Implement via Nodemailer transport
    logger.info('[Notification] Email queued', { to, subject });
  }
}

export default new NotificationService();
