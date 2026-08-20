import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';

export class ProcessHelpers {
  // Password hashing utilities
  static async hashPassword(plainText) {
    const SALT_ROUNDS = 10;
    return bcrypt.hash(plainText, SALT_ROUNDS);
  }

  static async compareHash(plainText, hash) {
    return bcrypt.compare(plainText, hash);
  }

  // JWT token signing and verification
  static signToken(payload, secret, expiresIn = '7d') {
    return jwt.sign(payload, secret, { expiresIn });
  }

  static verifyToken(token, secret) {
    return jwt.verify(token, secret);
  }

  // Pagination calculation utilities
  static paginate(page = 1, limit = 20) {
    const safePage = Math.max(1, parseInt(page, 10) || 1);
    const safeLimit = Math.min(100, Math.max(1, parseInt(limit, 10) || 20));
    return {
      skip: (safePage - 1) * safeLimit,
      limit: safeLimit,
      page: safePage,
    };
  }

  static paginatedResult(data, total, page, limit) {
    return {
      data,
      pagination: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  // One-time password and random code generators
  static generateOTP(length = 6) {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
      otp += digits[Math.floor(Math.random() * 10)];
    }
    return otp;
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

  // URL slug generator
  static generateSlug(text) {
    if (!text) return '';
    return text
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }

  // Object property selector
  static pick(obj, keys) {
    return keys.reduce((finalObj, key) => {
      if (obj && Object.prototype.hasOwnProperty.call(obj, key)) {
        finalObj[key] = obj[key];
      }
      return finalObj;
    }, {});
  }
}
