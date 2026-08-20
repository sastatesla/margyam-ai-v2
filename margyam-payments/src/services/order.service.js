import prisma from '../configs/db.js';
import { ApiError, logger } from '../common/index.js';

class OrderService {
  async getById(id, userId) {
    const order = await prisma.paymentOrder.findUnique({ where: { id } });
    if (!order) throw ApiError.NotFound('Order not found');
    if (order.userId !== userId) throw ApiError.Forbidden('Access denied');
    return order;
  }

  async createOrder({ userId, merchantTransactionId, amount, questions, coins, gateway = 'PHONEPE' }) {
    return prisma.paymentOrder.create({
      data: {
        userId,
        merchantTransactionId,
        amount,
        questions,
        coins,
        gateway,
        status: 'CREATED',
      },
    });
  }

  async updateStatus(id, status) {
    const order = await prisma.paymentOrder.findUnique({ where: { id } });
    if (!order) throw ApiError.NotFound('Order not found');

    return prisma.paymentOrder.update({
      where: { id },
      data:  { status, updatedAt: new Date() },
    });
  }

  async markPaid(merchantTransactionId) {
    const order = await prisma.paymentOrder.findUnique({ where: { merchantTransactionId } });
    if (!order) throw ApiError.NotFound('Order not found');

    return prisma.paymentOrder.update({
      where: { merchantTransactionId },
      data:  { status: 'PAID', updatedAt: new Date() },
    });
  }

  async cancelOrder(id, reason = 'User cancelled') {
    const order = await prisma.paymentOrder.findUnique({ where: { id } });
    if (!order) throw ApiError.NotFound('Order not found');
    if (order.status === 'COMPLETED' || order.status === 'PAID') {
      throw ApiError.BadRequest('Cannot cancel a completed or paid order');
    }

    return prisma.paymentOrder.update({
      where: { id },
      data:  { status: 'CANCELLED', updatedAt: new Date() },
    });
  }
}

export default new OrderService();

