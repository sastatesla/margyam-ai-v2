import express from 'express';
import roleController from '../controllers/role.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';

const router = express.Router();

router.get('/', authenticate, authorize('ADMIN'), roleController.getRoles);
router.post('/assign', authenticate, authorize('ADMIN'), roleController.assignRole);

export default router;
