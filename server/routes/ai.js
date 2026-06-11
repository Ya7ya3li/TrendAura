import express from 'express';
// 🏆 الاستيراد النظيف: استدعاء الدالتين بأسمائهما الحقيقية المكتملة في الكنترولر الصافي
import { generateScript, analyzeViralScript } from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// 🧠 مسار توليد السكريبتات المستقر وهندسة الخطافات
router.post('/generate', authGuard, validateRequest.generationBody, generateScript);

// 🔬 مسار تحليل مؤشرات الفيروسية الحقيقي مرتبط بالدالة الجديدة
router.post('/analyze-metrics', authGuard, analyzeViralScript);

export default router;