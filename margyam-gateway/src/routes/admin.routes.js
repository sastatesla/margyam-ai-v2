import express from 'express';
import adminController from '../controllers/admin.controller.js';
import { authenticate } from '../middlewares/auth.js';
import { authorize } from '../middlewares/authorize.js';
import { UserRole } from '../configs/constants.js';

const router = express.Router();

router.use(authenticate);
router.use(authorize(UserRole.ADMIN));

router.get('/users',             adminController.listUsers);
router.get('/users/:id',         adminController.getUserById);
router.patch('/users/:id',       adminController.updateUser);
router.delete('/users/:id',      adminController.deleteUser);

router.get('/waitlist',          adminController.listWaitlist);
router.post('/approve-beta',     adminController.approveBetaUser);

export default router;
