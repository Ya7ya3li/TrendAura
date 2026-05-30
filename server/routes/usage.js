import express from 'express';
import { usageController } from '../controllers/usageController.js';
import { authGuard } from '../middleware/auth.js';

const router = express.Router();

// 📊 تتبع حجم استهلاك التوكنز اليومي حياً من قاعدة البيانات
router.get('/daily', authGuard, usageController.getDailyUsage);

export default router;