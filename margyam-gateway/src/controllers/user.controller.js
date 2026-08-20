import { ApiResponse } from '../common/index.js';
import userService from '../services/user.service.js';

class UserController {
  constructor() {
    this.getMyProfile           = this.getMyProfile.bind(this);
    this.onboardUser            = this.onboardUser.bind(this);
    this.updateProfile          = this.updateProfile.bind(this);
    this.requestFreeCoins       = this.requestFreeCoins.bind(this);
    this.updateLanguage         = this.updateLanguage.bind(this);
    this.updatePushSubscription = this.updatePushSubscription.bind(this);
    this.getOnboardingStatus    = this.getOnboardingStatus.bind(this);
    this.completeOnboardingStep = this.completeOnboardingStep.bind(this);
  }

  async getMyProfile(req, res, next) {
    try {
      const user = await userService.getById(req.user.userId);
      return new ApiResponse(res).success({ data: user });
    } catch (e) { next(e); }
  }

  async onboardUser(req, res, next) {
    try {
      const user = await userService.onboardUser(req.user.userId, req.body);
      return new ApiResponse(res).success({ data: user, message: 'Onboarding completed' });
    } catch (e) { next(e); }
  }

  async updateProfile(req, res, next) {
    try {
      const user = await userService.update(req.user.userId, req.body);
      return new ApiResponse(res).success({ data: user, message: 'Profile updated' });
    } catch (e) { next(e); }
  }

  async requestFreeCoins(req, res, next) {
    try {
      const result = await userService.requestFreeCoins(req.user.userId);
      return new ApiResponse(res).success({ data: result, message: 'Free coins requested' });
    } catch (e) { next(e); }
  }

  async updateLanguage(req, res, next) {
    try {
      const user = await userService.updateLanguage(req.user.userId, req.body.languageCode, req.body.action);
      return new ApiResponse(res).success({ data: user, message: 'Language updated' });
    } catch (e) { next(e); }
  }

  async updatePushSubscription(req, res, next) {
    try {
      const user = await userService.updatePushSubscription(req.user.userId, req.body);
      return new ApiResponse(res).success({ data: user, message: 'Push subscription saved' });
    } catch (e) { next(e); }
  }

  async getOnboardingStatus(req, res, next) {
    try {
      const status = await userService.getOnboardingStatus(req.user.userId);
      return new ApiResponse(res).success({ data: status });
    } catch (e) { next(e); }
  }

  async completeOnboardingStep(req, res, next) {
    try {
      const result = await userService.completeStep(req.user.userId, req.body);
      return new ApiResponse(res).success({ data: result });
    } catch (e) { next(e); }
  }
}

export default new UserController();
