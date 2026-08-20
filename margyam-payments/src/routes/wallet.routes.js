import express from 'express';
import walletController from '../controllers/wallet.controller.js';
import { authenticate } from '../middlewares/auth.js';

const router = express.Router();

router.use(authenticate);

router.get('/balance',      walletController.getBalance);
router.get('/transactions', walletController.getTransactions);

export default router;
