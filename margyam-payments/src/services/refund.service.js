import prisma from '../configs/db.js';
import walletService from './wallet.service.js';
import { logger } from '../common/index.js';

class RefundService {
  async processRefund({ transactionId, reason }) {
    const originalTx = await prisma.transaction.findUnique({ where: { id: transactionId } });
    if (!originalTx) throw new Error('Original transaction not found');

    const wallet = await prisma.wallet.findUnique({ where: { id: originalTx.walletId } });
    return walletService.credit({
      userId:         wallet.userId,
      amount:         originalTx.amount,
      description:    `Refund: ${reason}`,
      type:           'REFUND',
      idempotencyKey: `REFUND-${transactionId}`,
    });
  }
}

export default new RefundService();
