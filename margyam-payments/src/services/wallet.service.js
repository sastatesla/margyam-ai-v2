import prisma from '../configs/db.js';
import { ApiError, ErrorCodes } from '../common/index.js';
import { v4 as uuidv4 } from 'uuid';

class WalletService {
  async getOrCreate(userId) {
    return prisma.wallet.upsert({
      where:  { userId },
      create: { userId, balance: 0 },
      update: {},
    });
  }

  async getBalance(userId) {
    return this.getOrCreate(userId);
  }

  /**
   * credit — Adds coins to wallet. Used for top-ups, bonuses, refunds.
   */
  async credit({ userId, amount, description, type = 'CREDIT', idempotencyKey }) {
    return prisma.$transaction(async (tx) => {
      const wallet = await tx.wallet.update({
        where: { userId },
        data:  { balance: { increment: amount } },
      });
      await tx.transaction.create({
        data: {
          walletId:       wallet.id,
          type,
          amount,
          description,
          idempotencyKey: idempotencyKey || uuidv4(),
          status:         'SUCCESS',
        },
      });
      return wallet;
    });
  }

  /**
   * debit — Atomically checks balance and deducts coins.
   * Uses SELECT FOR UPDATE via prisma.$transaction to prevent race conditions.
   */
  async debit({ userId, amount, description, idempotencyKey }) {
    return prisma.$transaction(async (tx) => {
      // Lock the wallet row
      const wallet = await tx.$queryRaw`
        SELECT * FROM "Wallet" WHERE "userId" = ${userId} FOR UPDATE
      `;

      if (!wallet[0] || wallet[0].balance < amount) {
        throw ApiError.BadRequest('Insufficient coin balance', ErrorCodes.INSUFFICIENT_BALANCE);
      }

      const updated = await tx.wallet.update({
        where: { userId },
        data:  { balance: { decrement: amount } },
      });

      const txRecord = await tx.transaction.create({
        data: {
          walletId:       updated.id,
          type:           'DEBIT',
          amount,
          description,
          idempotencyKey: idempotencyKey || uuidv4(),
          status:         'SUCCESS',
        },
      });

      return { wallet: updated, transactionId: txRecord.id };
    });
  }

  async getTransactions(userId, page, limit) {
    const wallet = await this.getOrCreate(userId);
    const skip   = (page - 1) * limit;
    const [items, total] = await Promise.all([
      prisma.transaction.findMany({
        where:   { walletId: wallet.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take:    limit,
      }),
      prisma.transaction.count({ where: { walletId: wallet.id } }),
    ]);
    return { items, total };
  }
}

export default new WalletService();
