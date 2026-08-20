import { ApiResponse } from '../common/index.js';
import publicService from '../services/public.service.js';

class PublicController {
  constructor() {
    this.calculatePublicKundli = this.calculatePublicKundli.bind(this);
    this.getPublicGuidanceToday = this.getPublicGuidanceToday.bind(this);
  }

  async calculatePublicKundli(req, res, next) {
    try {
      const result = await publicService.calculatePublicKundli(req.body);
      return new ApiResponse(res).success({ data: result, message: 'Calculations completed successfully' });
    } catch (e) { next(e); }
  }

  async getPublicGuidanceToday(req, res, next) {
    try {
      const guidance = await publicService.getPublicGuidanceToday(req.body.deviceId);
      return new ApiResponse(res).success({ data: guidance });
    } catch (e) { next(e); }
  }
}

export default new PublicController();
