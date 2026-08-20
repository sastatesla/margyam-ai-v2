import { describe, it, expect } from '@jest/globals';
import { ProcessHelpers } from '../../src/common/ProcessHelpers.js';

describe('Payments ProcessHelpers Class', () => {
  it('should generate a valid transaction number format', () => {
    const txnNo = ProcessHelpers.generateTransactionNumber();
    expect(txnNo).toBeDefined();
    expect(txnNo.startsWith('TXN-')).toBe(true);
  });

  it('should generate a valid payout number format', () => {
    const payNo = ProcessHelpers.generatePayoutNumber();
    expect(payNo).toBeDefined();
    expect(payNo.startsWith('PAY-')).toBe(true);
  });
});
