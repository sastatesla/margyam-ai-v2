import express from 'express';
import authController from '../controllers/auth.controller.js';

const router = express.Router();

router.post('/send-otp',        authController.sendOtp);
router.post('/signup',          authController.signup);
router.post('/login',           authController.login);
router.post('/device-auth',     authController.deviceAuth);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password',  authController.resetPassword);

export default router;
