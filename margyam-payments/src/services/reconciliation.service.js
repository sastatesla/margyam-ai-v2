import prisma from '../configs/db.js';
import { logger } from '../common/index.js';

class ReconciliationService {
  async runDailyReconciliation() {
    logger.info('[Reconciliation] Running daily ledger check...');

    // Fetch paid orders from the last 24 hours
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
    const paidOrders = await prisma.paymentOrder.findMany({
      where: {
        status: 'PAID',
        updatedAt: { gte: yesterday },
      },
    });

    let mismatched = 0;
    const details = [];

    for (const order of paidOrders) {
      const matchingTx = await prisma.transaction.findFirst({
        where: {
          userId: order.userId,
          idempotencyKey: `ORDER-${order.merchantTransactionId}`,
        },
      });

      if (!matchingTx) {
        mismatched++;
        details.push({ orderId: order.id, merchantTransactionId: order.merchantTransactionId, issue: 'Missing credit transaction' });
      }
    }

    logger.info('[Reconciliation] Completed', { checked: paidOrders.length, mismatched });
    return { reconciled: mismatched === 0, checked: paidOrders.length, mismatched, details };
  }
}

export default new ReconciliationService();

