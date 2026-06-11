import express from 'express';
// 🏆 الاستيراد النظيف: استدعاء الدوال بأسمائها الحقيقية الموجودة داخل الكنترولر حقك
import { generateScript, analyzeViralScript } from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// 🧠 مسار توليد السكريبتات المستقر
router.post('/generate', authGuard, validateRequest.generationBody, generateScript);

// 🔬 مسار تحليل مؤشرات الفيروسية الحقيقي مرتبط بالدالة الصحيحة
router.post('/analyze-metrics', authGuard, analyzeViralScript);

export default router;