// استخدام مصفوفات مؤقتة (في بيئة الإنتاج المتقدمة يمكنك ربطها بـ Supabase لاحقاً)
const usageDB = []; 
const dailyLimits = {}; // لتتبع عدد المحاولات اليومية: { userId: { date: 'YYYY-MM-DD', count: 2 } }

// 1. التحقق من إمكانية التوليد (نستخدمها كـ Middleware قبل استدعاء الذكاء الاصطناعي)
export const checkUsageLimit = (req, res, next) => {
  const { userId, planType } = req.body;

  if (!userId) return res.status(400).json({ error: 'User ID required' });

  // 🟢 إذا كانت الباقة مدفوعة (Pro أو Viral)، مسموح له بالتوليد اللامحدود
  if (planType === 'pro' || planType === 'pro_viral') {
    return next(); // انتقل للخطوة التالية بنجاح
  }

  // 🔴 إذا كانت الباقة مجانية (Free)
  const today = new Date().toISOString().split('T')[0]; // "YYYY-MM-DD"
  
  // تهيئة العداد للمستخدم الجديد
  if (!dailyLimits[userId]) {
    dailyLimits[userId] = { date: today, count: 0 };
  }

  // تصفير العداد تلقائياً إذا بدأ يوم جديد
  if (dailyLimits[userId].date !== today) {
    dailyLimits[userId] = { date: today, count: 0 };
  }

  // التحقق من الحد الأقصى (5 توليدات)
  if (dailyLimits[userId].count >= 5) {
    return res.status(403).json({ 
      error: 'لقد استنفدت حدك اليومي (5 توليدات). قم بالترقية لباقة Pro للتوليد اللامحدود!' 
    });
  }

  // السماح بالمرور
  next();
};

// 2. حفظ الاستخدام وزيادة العداد (يتم استدعاؤها من aiController بعد نجاح توليد الذكاء الاصطناعي)
export const saveUsage = async (userId, planType, prompt, result) => {
  const today = new Date().toISOString().split('T')[0];

  // زيادة عداد الاستخدام للباقة المجانية فقط (لأن المدفوع لا محدود)
  if (planType === 'free' || !planType) {
    if (!dailyLimits[userId]) {
      dailyLimits[userId] = { date: today, count: 0 };
    }
    if (dailyLimits[userId].date === today) {
      dailyLimits[userId].count += 1;
    } else {
      dailyLimits[userId] = { date: today, count: 1 };
    }
  }

  // تطبيق ميزة "بدون حفظ دائم" للمجاني و "حفظ السكربتات" للمدفوع
  if (planType === 'pro' || planType === 'pro_viral') {
    usageDB.push({
      userId,
      prompt,
      result,
      date: new Date(),
    });
  }
};

// 3. جلب سجل الاستخدام (لصفحة History في الفرونت إند)
export const getUsage = (req, res) => {
  // استقبال البيانات من الـ Query Params
  const { userId, planType } = req.query; 
  
  // الباقة المجانية لا تملك ميزة History
  if (planType === 'free' || !planType) {
     return res.json({ message: 'ميزة سجل السكربتات متاحة لباقات Pro فقط', history: [] }); 
  }

  // جلب سجل المستخدم (للباقات المدفوعة)
  const userHistory = usageDB.filter(item => item.userId === userId);
  
  // ترتيب السجل من الأحدث للأقدم
  const sortedHistory = userHistory.sort((a, b) => b.date - a.date);

  res.json({ history: sortedHistory });
};