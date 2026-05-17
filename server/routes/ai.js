import express from 'express'

import {
  generateAI,
  generateTrends,
  generateHashtags
} from '../controllers/aiController.js'

import {
  createCheckout,
  getSubscription
} from '../controllers/stripeController.js'

import { 
  checkUsageLimit 
} from '../controllers/usageController.js' // 👈 استدعاء ميدل وير الحماية

const router = express.Router()

// 🛡️ وضعنا checkUsageLimit لحماية مسارات الذكاء الاصطناعي
router.post('/generate', checkUsageLimit, generateAI)

router.post('/trends', checkUsageLimit, generateTrends)

router.post('/hashtags', checkUsageLimit, generateHashtags)

// مسارات Stripe لا تحتاج إلى حماية الاستخدام
router.post('/checkout', createCheckout)

router.post('/subscription', getSubscription)

export default router