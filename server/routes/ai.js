import express from 'express'

import {
  generateAI,
  generateTrends,
  generateHashtags
} from '../controllers/aiController.js'

import { 
  checkUsageLimit 
} from '../controllers/usageController.js' // 👈 استدعاء ميدل وير الحماية

const router = express.Router()

// 🛡️ وضعنا checkUsageLimit لحماية مسارات الذكاء الاصطناعي
router.post('/generate', checkUsageLimit, generateAI)
router.post('/trends', checkUsageLimit, generateTrends)
router.post('/hashtags', checkUsageLimit, generateHashtags)

// 💡 تم إزالة مسارات Stripe من هنا لأننا نقلنا الدفع إلى بوابة ميسر في ملف (payment.js)

export default router