import express from 'express';
// 🏆 الاستيراد الشامل الآمن لمنع أي خطأ Syntax
import * as aiController from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// 🧠 مسار توليد السكريبتات وهندسة الخطافات النفسية الخاطفة للفيديو
router.post('/generate', authGuard, validateRequest.generationBody, aiController.generateScript);

// 🔬 مسار تحليل مؤشرات الفيروسية - تم ضبط اسم الدالة هنا ليتطابق مع الكنترولر بالملي لمنع الـ Undefined
router.post('/analyze-metrics', authGuard, aiController.analyzeViralScript);

export default router;