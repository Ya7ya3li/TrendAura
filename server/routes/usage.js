import express from 'express';
import { usageController } from '../controllers/usageController.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// 📊 مراقبة وتتبع حجم استهلاك التوكنز والطلبات اليومية حياً للعميل
router.get('/daily', authGuard, usageController.getDailyUsage);

export default router;