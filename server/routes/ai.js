import express from 'express';
// 🏆 الحل السحري: استيراد الكل كـ aiController لمنع خطأ الـ SyntaxError نهائياً
import * as aiController from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// 🧠 مسار توليد السكريبتات وهندسة الخطافات النفسية الخاطفة للفيديو
router.post('/generate', authGuard, validateRequest.generationBody, aiController.generateScript);

// 🔬 مسار تحليل مؤشرات الفيروسية وأوقات ونسب احتفاظ الجماهير (Retention Rate) الحقيقي
// 💡 قمنا بربطه مباشرة مع دالة التحليل الذكي الجديدة
router.post('/analyze-metrics', authGuard, aiController.analyzeViralScript);

export default router;