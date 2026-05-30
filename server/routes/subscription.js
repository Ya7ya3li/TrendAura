import express from 'express';
import { subscriptionController } from '../controllers/subscriptionController.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// 👑 الاستعلام عن صلاحيات وقدرات باقة الاشتراك الحالية
router.get('/details', authGuard, subscriptionController.checkSubscriptionDetails);

export default router;