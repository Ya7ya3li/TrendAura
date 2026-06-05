# 🚀 TrendAura V2 - Cloud Deployment & Sovereignty Guide

دليل الرفع والإنتاج الاحترافي لتشغيل المنظومة بكفاءة وسرعة فائقة في بيئات العرض الحية العالمية لعام **2026**.

---

## 💻 1. واجهة المستخدم (Frontend - Vercel)
الواجهة مبنية باستخدام React + Vite وتستضيفها خوادم Vercel الحركية فائقة السرعة.

### ⚙️ المتغيرات البيئية المطلوبة في إعدادات Vercel:
* `VITE_SUPABASE_URL` = (رابط مشروع سوبابيس الخاص بك)
* `VITE_SUPABASE_ANON_KEY` = (مفتاح الـ Anon المنشور للواجهة)
* `VITE_API_URL` = (رابط السيرفر الحي المرفوع على Railway)
* `VITE_API_BASE_URL` = (رابط السيرفر الحي المرفوع على Railway لتوحيد قنوات اللقط)

### 📦 خطوات الرفع:
1. اربط مجلد `client` بمستودع GitHub.
2. اختر إطار العمل **Vite** في لوحة Vercel.
3. ضع الـ Root Directory على مجلد `client`.
4. اضغط **Deploy** ليتم البناء الفوري والانطلاق.

---

## ⚡ 2. الخادم الخلفي ومحرك Express (Backend - Railway)
السيرفر يدار عبر حاويات Railway السحابية باستخدام محرك البناء الذكي **NIXPACKS**.

### ⚙️ المتغيرات البيئية المطلوبة في إعدادات Railway:
* `PORT` = `5000`
* `NODE_ENV` = `production`
* `SUPABASE_URL` = (رابط مشروع سوبابيس)
* `SUPABASE_SERVICE_ROLE_KEY` = (المفتاح السيادي لتخطي الـ RLS خلفياً)
* `OPENAI_API_KEY` = (مفتاح الأمان لـ OpenRouter / OpenAI)
* `OPENAI_MODEL` = `openai/gpt-oss-120b:free` (أو النموذج المعتمد المستقر لديك)
* `MOYASAR_SECRET_KEY` = (مفتاح الربط الحي لبوابة ميسر السعودية)
* `JWT_SECRET` = (رمز التشفير الخاص بجلسات السيرفر الداخلية)

### 📦 بروتوكول الإقلاع التلقائي:
عند الرفع، يقرأ النظام ملف `railway.json` وملف `nixpacks.toml` ليقوم بتثبيت الاعتمادات أوتوماتيكياً عبر حزمة `package.json` ويطلق خط الإنتاج فوراً بالأمر المستقر:
```bash
node server.js