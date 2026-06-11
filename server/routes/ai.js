import express from 'express';
// 🏆 الاستيراد الشامل الآمن لمنع خطأ الـ SyntaxError نهائياً في نظام ESM
import * as aiController from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// 🧠 مسار توليد السكريبتات وهندسة الخطافات النفسية الخاطفة للفيديو
router.post('/generate', authGuard, validateRequest.generationBody, aiController.generateScript);

// 🔬 مسار تحليل مؤشرات الفيروسية (تم تعديل الاسم ليتطابق مع ملف الكنترولر حقك بالظبط)
router.post('/analyze-metrics', authGuard, aiController.analyzeViralScript);

export default router;