import express from "express";
import cors from "cors";
import aiRoute from "./routes/ai.js";

const app = express();

// 1️⃣ إعدادات CORS الدقيقة والمفصلة عشان Vercel ما ينحظر
app.use(cors({
  origin: [
    'http://localhost:5173', // للبيئة المحلية
    'https://trendaura-two.vercel.app' // موقعك الفعلي في Vercel
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

app.use(express.json());

// 2️⃣ توجيه المسارات
app.use("/api/ai", aiRoute);

// 💡 ملاحظة: إذا كود ميسر (paymentController) موجود في مسار منفصل، فعّل السطرين اللي تحت بعد ما تستدعي الملف فوق
// import paymentRoute from "./routes/payment.js";
// app.use("/api/payment", paymentRoute);

// 3️⃣ استخدام بورت Railway الديناميكي عشان يشبك السيرفر صح
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});