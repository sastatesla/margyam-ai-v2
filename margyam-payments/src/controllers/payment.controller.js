import { ApiResponse } from '../common/index.js';
import paymentService from '../services/payment.service.js';
import orderService from '../services/order.service.js';

class PaymentController {
  constructor() {
    this.initiatePayment = this.initiatePayment.bind(this);
    this.handleWebhook   = this.handleWebhook.bind(this);
    this.getOrder        = this.getOrder.bind(this);
  }

  async initiatePayment(req, res, next) {
    try {
      const order = await paymentService.initiate({ userId: req.user.userId, ...req.body });
      return new ApiResponse(res).success({ data: order, statusCode: 201 });
    } catch (e) { next(e); }
  }

  async handleWebhook(req, res, next) {
    try {
      await paymentService.processWebhook(req.body, req.headers);
      return res.status(200).json({ success: true });  // Always 200 for webhooks
    } catch (e) { next(e); }
  }

  async getOrder(req, res, next) {
    try {
      const order = await orderService.getById(req.params.id, req.user.userId);
      return new ApiResponse(res).success({ data: order });
    } catch (e) { next(e); }
  }
}

export default new PaymentController();
