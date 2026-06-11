import express from 'express';
// 🏆 استيراد الدالتين المكتملتين معاً باسمائهما الصريحة من الكنترولر الصافي
import { generateScript, analyzeViralScript } from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// 🧠 مسار توليد السكريبتات وهندسة الخطافات
router.post('/generate', authGuard, validateRequest.generationBody, generateScript);

// 🔬 مسار تحليل مؤشرات الفيروسية ونسب احتفاظ الجماهير الحقيقي
router.post('/analyze-metrics', authGuard, analyzeViralScript);

export default router;