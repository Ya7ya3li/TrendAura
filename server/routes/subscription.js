import express from 'express';
import { subscriptionController } from '../controllers/subscriptionController.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// الاستعلام عن تفاصيل الخطة
router.get('/details', authGuard, subscriptionController.checkSubscriptionDetails);

// المطالبة بالمكافأة اليومية (محمي تماماً)
router.post('/claim-daily', authGuard, subscriptionController.claimDailyReward);

// إلغاء الاشتراك الحالي (محمي تماماً)
router.post('/cancel', authGuard, subscriptionController.cancelSubscription);

export default router;