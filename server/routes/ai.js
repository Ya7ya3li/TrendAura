import express from 'express';
// 🏆 الشغل النظيف: استيراد الدوال بأسمائها المباشرة من الكنترولر الأصلي حقك بدون أي زيادة
import { generateScript, analyzeScriptMetrics } from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// 🧠 مسار توليد السكريبتات القديم والمستقر
router.post('/generate', authGuard, validateRequest.generationBody, generateScript);

// 🔬 مسار تحليل مؤشرات الفيروسية - تم تمرير الدالة مباشرة لمنع كراش الـ Undefined
router.post('/analyze-metrics', authGuard, analyzeScriptMetrics);

export default router;