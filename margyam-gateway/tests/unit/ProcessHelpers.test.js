import { describe, it, expect } from '@jest/globals';
import { ProcessHelpers } from '../../src/common/ProcessHelpers.js';

describe('ProcessHelpers Utility Class', () => {
  describe('Password Hash Helpers', () => {
    it('should hash a password and verify it correctly', async () => {
      const password = 'SecurePassword123!';
      const hash = await ProcessHelpers.hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toEqual(password);

      const isValid = await ProcessHelpers.compareHash(password, hash);
      expect(isValid).toBe(true);

      const isInvalid = await ProcessHelpers.compareHash('WrongPassword', hash);
      expect(isInvalid).toBe(false);
    });
  });

  describe('JWT Token Helpers', () => {
    it('should sign and verify a JWT payload correctly', () => {
      const payload = { userId: '123', role: 'USER' };
      const secret = 'super-secret-key';
      const token = ProcessHelpers.signToken(payload, secret, '1h');

      expect(token).toBeDefined();

      const decoded = ProcessHelpers.verifyToken(token, secret);
      expect(decoded.userId).toBe('123');
      expect(decoded.role).toBe('USER');
    });
  });

  describe('OTP & Generator Helpers', () => {
    it('should generate a 6-digit numeric OTP', () => {
      const otp = ProcessHelpers.generateOTP(6);
      expect(otp).toHaveLength(6);
      expect(/^\d{6}$/.test(otp)).toBe(true);
    });

    it('should generate an alphanumeric string of specified length', () => {
      const str = ProcessHelpers.generateAlphanumeric(8);
      expect(str).toHaveLength(8);
      expect(/^[A-Z0-9]{8}$/.test(str)).toBe(true);
    });
  });

  describe('Slug Generator', () => {
    it('should generate a clean lower-case slug', () => {
      const slug = ProcessHelpers.generateSlug(' Vedic Astrology & Kundli ');
      expect(slug).toBe('vedic-astrology-kundli');
    });
  });

  describe('Pagination Calculation', () => {
    it('should calculate skip and limit bounds accurately', () => {
      const p1 = ProcessHelpers.paginate(1, 20);
      expect(p1.skip).toBe(0);
      expect(p1.limit).toBe(20);

      const p2 = ProcessHelpers.paginate(3, 10);
      expect(p2.skip).toBe(20);
      expect(p2.limit).toBe(10);
    });

    it('should construct paginated result payload metadata', () => {
      const items = [{ id: 1 }, { id: 2 }];
      const result = ProcessHelpers.paginatedResult(items, 45, 2, 10);

      expect(result.data).toHaveLength(2);
      expect(result.pagination.total).toBe(45);
      expect(result.pagination.page).toBe(2);
      expect(result.pagination.totalPages).toBe(5);
    });
  });
});
