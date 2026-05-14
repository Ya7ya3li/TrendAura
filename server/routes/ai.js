import express from 'express'

import {
  generateAI,
  generateTrends,
  generateHashtags
}
from '../controllers/aiController.js'

import {
  createCheckout,
  getSubscription
}
from '../controllers/stripeController.js'

const router = express.Router()

router.post('/generate', generateAI)

router.post('/trends', generateTrends)

router.post('/hashtags', generateHashtags)

router.post('/checkout', createCheckout)

router.post('/subscription', getSubscription)

export default router