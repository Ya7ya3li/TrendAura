import express from 'express';
import { authController } from '../controllers/authController.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// 👤 جلب وتحديث بيانات الهوية الشخصية للمبدع من قاعدة البيانات
router.get('/profile', authGuard, authController.getProfile);
router.put('/profile', authGuard, authController.updateProfile);

export default router;