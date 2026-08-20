import express from 'express';
import paymentController from '../controllers/payment.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { validate } from '../middlewares/validate.js';
import { createOrderSchema } from '../validations/payment.validation.js';

const router = express.Router();

router.use(authenticate);

router.post('/initiate',  validate(createOrderSchema), paymentController.initiatePayment);
router.post('/webhook',                                 paymentController.handleWebhook);
router.get('/order/:id',                                paymentController.getOrder);

export default router;
