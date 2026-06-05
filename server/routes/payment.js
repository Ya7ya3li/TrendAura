import express from 'express';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

// 💳 استقبال إشارات السداد اللحظية والآمنة (Webhooks) من بوابة دفع ميسر السعودية السيادية
router.post('/webhook', express.json(), paymentController.handleWebhook);

export default router;