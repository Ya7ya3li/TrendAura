import express from 'express'
// أضفنا استدعاء دالة الدفع (createCheckout) مع دالة التحقق
import { verifyMoyasarPayment, createCheckout } from '../controllers/paymentController.js'

const router = express.Router()

// 🟢 هذا المسار اللي كان ناقص ويسبب مشكلة 404! (تهيئة فاتورة الدفع)
router.post('/checkout', createCheckout)

// مسار التحقق من الدفع (بعد نجاح العملية)
router.post('/verify', verifyMoyasarPayment)

export default router