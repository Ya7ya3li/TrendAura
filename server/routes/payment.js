import express from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

// 💳 استقبال إشعارات السداد الآمنة واللحظية من بوابة ميسر السعودية
router.post('/webhook', paymentController.handleWebhook);

export default router;