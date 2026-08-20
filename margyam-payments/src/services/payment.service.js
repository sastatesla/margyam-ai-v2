import prisma from '../configs/db.js';
import { ApiError } from '../common/index.js';
import walletService from './wallet.service.js';
import { v4 as uuidv4 } from 'uuid';

// TODO: Replace with actual PhonePe SDK integration
// import PhonePe from '@phonepe-pg/pg-sdk-node';

class PaymentService {
  async initiate({ userId, amount, coins }) {
    const merchantOrderId = `MO-${uuidv4()}`;

    // 1. Create a pending order record
    const order = await prisma.paymentOrder.create({
      data: { userId, merchantOrderId, amount, coins, status: 'CREATED' },
    });

    // 2. TODO: Call PhonePe SDK to get payment URL
    // const phonePeResp = await PhonePe.initiatePayment({ ... });

    return {
      orderId:     order.id,
      merchantOrderId,
      paymentUrl:  `https://pay.phonepe.com/${merchantOrderId}`, // Replace with real URL
    };
  }

  async processWebhook(body, headers) {
    // 1. Validate webhook signature (PhonePe HMAC)
    // TODO: Implement HMAC verification using PHONEPE_API_KEY

    const { merchantOrderId, status } = body;
    const order = await prisma.paymentOrder.findUnique({ where: { merchantOrderId } });
    if (!order) throw ApiError.NotFound('Order not found');
    if (order.status !== 'CREATED') return;  // Already processed (idempotent)

    if (status === 'SUCCESS') {
      await prisma.$transaction(async (tx) => {
        await tx.paymentOrder.update({
          where: { id: order.id },
          data:  { status: 'PAID' },
        });
        await walletService.credit({
          userId:      order.userId,
          amount:      order.coins,
          description: `Top-up via PhonePe (Order ${merchantOrderId})`,
          type:        'CREDIT',
          idempotencyKey: merchantOrderId,
        });
      });
    } else {
      await prisma.paymentOrder.update({
        where: { id: order.id },
        data:  { status: 'CANCELLED' },
      });
    }
  }
}

export default new PaymentService();
