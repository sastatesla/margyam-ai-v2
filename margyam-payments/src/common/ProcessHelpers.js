import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class ProcessHelpers {
  static async hashPassword(plainText) {
    return bcrypt.hash(plainText, 10);
  }

  static async compareHash(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }

  static signToken(payload, secret, expiresIn = '7d') {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verifyToken(token, secret) {
    return jwt.verify(token, secret);
  }

  static paginate(page = 1, limit = 20) {
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    return { skip: (safePage - 1) * safeLimit, limit: safeLimit, page: safePage };
  }

  static paginatedResult(data, total, page, limit) {
    return {
      data,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  static generateAlphanumeric(length = 6) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    const bytes = crypto.randomBytes(length);
    for (let i = 0; i < length; i++) {
      result += chars[bytes[i] % chars.length];
    }
    return result;
  }

  static generateTransactionNumber() {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    return `TXN-${dateStr}-${ProcessHelpers.generateAlphanumeric(5)}`;
  }

  static generatePayoutNumber() {
    const dateStr = new Date().toISOString().slice(2, 10).replace(/-/g, '');
    return `PAY-${dateStr}-${ProcessHelpers.generateAlphanumeric(5)}`;
  }
}
