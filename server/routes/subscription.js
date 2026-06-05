import express from 'express';
import { subscriptionController } from '../controllers/subscriptionController.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// 👑 الاستعلام الفوري عن قيود ومميزات باقة الاشتراك النشطة حالياً للمستخدم
router.get('/details', authGuard, subscriptionController.checkSubscriptionDetails);

export default router;