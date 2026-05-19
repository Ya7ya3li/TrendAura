import express from 'express'
import { verifyMoyasarPayment } from '../controllers/paymentController.js'

const router = express.Router()

// مسار التحقق من الدفع
router.post('/verify', verifyMoyasarPayment)

export default router