import express from 'express';
import { aiController } from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// 🧠 مسار توليد السكريبتات وهندسة الخطافات النفسية الخاطفة للفيديو
router.post('/generate', authGuard, validateRequest.generationBody, aiController.generateScript);

// 🔬 مسار تحليل مؤشرات الفيروسية وأوقات ونسب احتفاظ الجماهير (Retention Rate)
router.post('/analyze-metrics', authGuard, aiController.analyzeScriptMetrics);

export default router;