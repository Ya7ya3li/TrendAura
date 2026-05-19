import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import aiRoutes from './routes/ai.js'
import paymentRoutes from './routes/payment.js'

dotenv.config()

const app = express()

// 👈 هنا السر: إعدادات CORS المخصصة لفيرسل
app.use(cors({
  origin: [
    'http://localhost:5173', // للبيئة المحلية
    'https://trendaura-two.vercel.app' // موقعك الفعلي في Vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}))

app.use(express.json())

// الرواتس الأساسية للمنصة
app.use('/api/ai', aiRoutes)
app.use('/api/payment', paymentRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 TrendAura Server running on port ${PORT}`)
})