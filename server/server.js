import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import aiRoutes from './routes/ai.js'
import paymentRoutes from './routes/payment.js'

dotenv.config()

const app = express()

// 🛡️ كسر حماية CORS إجبارياً لموقعك (الضربة القاضية)
app.use((req, res, next) => {
  const allowedOrigins = ['http://localhost:5173', 'https://trendaura-two.vercel.app'];
  const origin = req.headers.origin;
  
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,Authorization,Accept');
  res.setHeader('Access-Control-Allow-Credentials', true);
  
  // معالجة طلبات Preflight (التي ترسلها بوابات الدفع)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }
  next();
});

// إعدادات CORS الأساسية كطبقة حماية إضافية
app.use(cors({
  origin: [
    'http://localhost:5173', 
    'https://trendaura-two.vercel.app' 
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