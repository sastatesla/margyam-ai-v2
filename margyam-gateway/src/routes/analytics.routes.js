import express from 'express';
import analyticsController from '../controllers/analytics.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.get('/dashboard', authenticate, analyticsController.getDashboardStats);
router.post('/track', authenticate, analyticsController.trackEvent);

export default router;
