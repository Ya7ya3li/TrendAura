import express from 'express';
import { aiController } from '../controllers/aiController.js';
import { authGuard } from '../middleware/auth.js';
import { validateRequest } from '../middleware/validateRequest.js';

const router = express.Router();

// 🧠 مسار توليد السكريبتات والهندسة النفسية الخاطفة للفيديو
router.post('/generate', authGuard, validateRequest.generationBody, aiController.generateScript);
// أضف هذا السطر بعد مسار الـ generate
router.post('/analyze-metrics', authGuard, aiController.analyzeScriptMetrics);
export default router;