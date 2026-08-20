import { ApiResponse } from '../common/index.js';
import authService from '../services/auth.service.js';

class AuthController {
  constructor() {
    this.sendOtp        = this.sendOtp.bind(this);
    this.signup         = this.signup.bind(this);
    this.login          = this.login.bind(this);
    this.deviceAuth     = this.deviceAuth.bind(this);
    this.forgotPassword = this.forgotPassword.bind(this);
    this.resetPassword  = this.resetPassword.bind(this);
  }

  async sendOtp(req, res, next) {
    try {
      const result = await authService.sendOtp(req.body);
      return new ApiResponse(res).success({ message: result.message });
    } catch (e) { next(e); }
  }

  async signup(req, res, next) {
    try {
      const { user, token } = await authService.register(req.body);
      return new ApiResponse(res).success({ data: { user, token }, statusCode: 201, message: 'Account created successfully' });
    } catch (e) { next(e); }
  }

  async login(req, res, next) {
    try {
      const { user, token } = await authService.login(req.body);
      return new ApiResponse(res).success({ data: { user, token }, message: 'Logged in successfully' });
    } catch (e) { next(e); }
  }

  async deviceAuth(req, res, next) {
    try {
      const { user, token } = await authService.deviceAuth(req.body);
      return new ApiResponse(res).success({ data: { user, token }, message: 'Guest session created' });
    } catch (e) { next(e); }
  }

  async forgotPassword(req, res, next) {
    try {
      const result = await authService.forgotPassword(req.body);
      return new ApiResponse(res).success({ message: result.message });
    } catch (e) { next(e); }
  }

  async resetPassword(req, res, next) {
    try {
      const result = await authService.resetPassword(req.body);
      return new ApiResponse(res).success({ message: result.message });
    } catch (e) { next(e); }
  }
}

export default new AuthController();
