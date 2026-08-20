import { ApiResponse } from '../common/index.js';
import walletService from '../services/wallet.service.js';

class WalletController {
  constructor() {
    this.getBalance      = this.getBalance.bind(this);
    this.getTransactions = this.getTransactions.bind(this);
  }

  async getBalance(req, res, next) {
    try {
      const wallet = await walletService.getBalance(req.user.userId);
      return new ApiResponse(res).success({ data: wallet });
    } catch (e) { next(e); }
  }

  async getTransactions(req, res, next) {
    try {
      const { page = 1, limit = 20 } = req.query;
      const result = await walletService.getTransactions(req.user.userId, +page, +limit);
      return new ApiResponse(res).success({ data: result.items, meta: { total: result.total, page: +page, limit: +limit } });
    } catch (e) { next(e); }
  }
}

export default new WalletController();
