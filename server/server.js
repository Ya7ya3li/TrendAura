import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import aiRoutes from './routes/ai.js'
import paymentRoutes from './routes/payment.js' // 1️⃣ استيراد روات المدفوعات الجديد

dotenv.config()

const app = express()

app.use(cors())
app.use(express.json())

// الرواتس الأساسية للمنصة
app.use('/api/ai', aiRoutes)
app.use('/api/payment', paymentRoutes) // 2️⃣ تفعيل مسار مدفوعات ميسر (مدى، Apple Pay)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`🚀 TrendAura Server running on port ${PORT}`)
})