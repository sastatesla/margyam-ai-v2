import express from 'express';
import userController from '../controllers/user.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/me',                   userController.getMyProfile);
router.post('/onboard',             userController.onboardUser);
router.patch('/profile',            userController.updateProfile);
router.post('/request-free-coins',  userController.requestFreeCoins);
router.post('/language',            userController.updateLanguage);
router.post('/push-subscription',   userController.updatePushSubscription);
router.get('/onboarding-status',    userController.getOnboardingStatus);
router.post('/onboarding-step',     userController.completeOnboardingStep);

export default router;
