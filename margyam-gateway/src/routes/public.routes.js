import express from 'express';
import publicController from '../controllers/public.controller.js';

const router = express.Router();

router.post('/calculate-kundli', publicController.calculatePublicKundli);
router.post('/guidance-today',    publicController.getPublicGuidanceToday);

export default router;
