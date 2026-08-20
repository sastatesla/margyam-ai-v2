import prisma from '../configs/db.js';
import { ApiError, ErrorCodes, logger } from '../common/index.js';
import { v4 as uuidv4 } from 'uuid';

const COIN_TO_PAISE_RATE = 100; // 1 Coin = ₹1 (100 Paise)

class PayoutService {
  async requestPayout({ userId, coinsAmount, upiId }) {
    if (!coinsAmount || coinsAmount <= 0) {
      throw ApiError.BadRequest('Invalid payout coin amount');
    }

    const paiseAmount = coinsAmount * COIN_TO_PAISE_RATE;

    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.findUnique({ where: { userId } });
      if (!wallet || wallet.balance < coinsAmount) {
        throw ApiError.BadRequest('Insufficient coin balance for payout', ErrorCodes.INSUFFICIENT_BALANCE);
      }

      const updatedWallet = await tx.wallet.update({
        where: { userId },
        data: { balance: { decrement: coinsAmount } },
      });

      await tx.transaction.create({
        data: {
          walletId: updatedWallet.id,
          userId,
          type: 'DEBIT',
          source: 'ADMIN_GRANT',
          amount: paiseAmount,
          coins: coinsAmount,
          description: `Astrologer Payout Request (${coinsAmount} coins)`,
          idempotencyKey: `PAYOUT-${userId}-${Date.now()}`,
          status: 'SUCCESS',
        },
      });

      const payout = await tx.payout.create({
        data: {
          walletId: updatedWallet.id,
          userId,
          amount: paiseAmount,
          upiId,
          status: 'PENDING',
        },
      });

      logger.info('[Payout] Request created', { userId, coinsAmount, paiseAmount, payoutId: payout.id });
      return payout;
    });
  }
}

export default new PayoutService();

