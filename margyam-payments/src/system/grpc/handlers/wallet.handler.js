import walletService from '../../../services/wallet.service.js';
import refundService from '../../../services/refund.service.js';
import { logger } from '../../../common/index.js';
import { v4 as uuidv4 } from 'uuid';

/**
 * walletHandler — Implements the LedgerService gRPC interface.
 * Called by margyam-gateway before and after AI chat queries.
 */
const walletHandler = {
  async VerifyAndDeduct(call, callback) {
    const { user_id, amount, idempotency_key, description } = call.request;
    try {
      const { wallet, transactionId } = await walletService.debit({
        userId:         user_id,
        amount,
        description,
        idempotencyKey: idempotency_key || uuidv4(),
      });
      callback(null, {
        success:           true,
        remaining_balance: wallet.balance,
        transaction_id:    transactionId,
      });
    } catch (err) {
      logger.error('[gRPC] VerifyAndDeduct failed', { userId: user_id, error: err.message });
      callback(null, { success: false, error: err.message });
    }
  },

  async RefundCoins(call, callback) {
    const { transaction_id, reason } = call.request;
    try {
      logger.info('[gRPC] RefundCoins processing', { transaction_id, reason });
      await refundService.processRefund({ transactionId: transaction_id, reason });
      callback(null, { success: true });
    } catch (err) {
      logger.error('[gRPC] RefundCoins failed', { transaction_id, error: err.message });
      callback(null, { success: false, error: err.message });
    }
  },


  async GetBalance(call, callback) {
    const { user_id } = call.request;
    try {
      const wallet = await walletService.getBalance(user_id);
      callback(null, { success: true, balance: wallet.balance });
    } catch (err) {
      callback(null, { success: false, error: err.message });
    }
  },
};

export default walletHandler;
