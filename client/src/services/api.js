const API = 'https://trendaura-production-06c0.up.railway.app'

export const generateScript = async (prompt, userId = null, planType = 'free') => {
  try {
    const response = await fetch(`${API}/api/ai/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ prompt, userId, planType }) // إرسال بيانات المستخدم والباقة
    })
    
    const data = await response.json()
    
    // في حال رجع الباك إند خطأ (مثلاً استنفد المحاولات المجانية)
    if (!response.ok) {
       console.error("Generate Error:", data.error);
       // إذا كان الخطأ هو استنفاد الحد، يمكنك رميه ليتم التعامل معه في الداشبورد لو أردت
       // لكن حالياً سنكتفي بإرجاع رسالة خطأ داخل السكربت لتظهر للمستخدم
       return `[خطأ]: ${data.error || 'حدث خطأ أثناء التوليد'}`;
    }
    
    return data.result
  } catch (error) {
    console.error("Network Error:", error);
    return "[خطأ]: لا يمكن الاتصال بالخادم حالياً. تأكد من اتصالك بالإنترنت."
  }
}

export const fetchTrends = async (niche = '', userId = null, planType = 'free') => {
  try {
    const response = await fetch(`${API}/api/ai/trends`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ niche, userId, planType }) // إرسال الباقة للحصول على جودة ترندات أعلى
    })
    const data = await response.json()
    return data.trends || []
  } catch (error) {
    console.error("Trends Error:", error);
    return []
  }
}

export const fetchHashtags = async (topic = '', userId = null, planType = 'free') => {
  try {
    const response = await fetch(`${API}/api/ai/hashtags`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, userId, planType }) // إرسال الباقة للحصول على هاشتاقات استراتيجية
    })
    const data = await response.json()
    return data.hashtags || []
  } catch (error) {
    console.error("Hashtags Error:", error);
    return []
  }
}