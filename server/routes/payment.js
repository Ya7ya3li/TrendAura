import express from 'react';
import { paymentController } from '../controllers/paymentController.js';

const router = express.Router();

// 💳 طلب فاتورة ورابط سداد جديد من ميسر
router.post('/create-invoice', express.json(), paymentController.createInvoice);

// 🔍 التحقق اللحظي من حالة نجاح الفاتورة
router.get('/verify/:id', paymentController.verifyPaymentStatus);

// 🔔 الـ Webhook الخاص باستقبال إشارات السداد الآمنة من بوابات ميسر السعودية السيادية
router.post('/webhook', express.json(), paymentController.handleWebhook);

export default router;