// المسار: server/services/openai.js
import OpenAI from 'openai';
import { env } from '../config/env.js';

// التحقق من وجود المفتاح قبل البدء
if (!env.openaiApiKey) {
  console.error("❌ [CRITICAL]: OpenAI API Key is missing!");
}

const openai = new OpenAI({
  apiKey: env.openaiApiKey || 'sk-none', // قيمة احتياطية لمنع الانهيار
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://trendaura.app", // استبدلها برابط موقعك الفعلي إن وجد
    "X-Title": "TrendAura"
  }
});

/**
 * TrendAura AI Psychological Script Engineering Service
 */
export const openaiService = {
  generateViralContent: async (userPrompt, option = 'تحفيزي') => {
    try {
      const systemContext = `
        أنت خبير سيكولوجية الجماهير وصناعة المحتوى الفيروسي.
        مهمتك هي إعادة صياغة فكرة المستخدم كسكريبت احترافي.
        أعد الخرج كـ JSON فقط (بدون أي ماركداون):
        {
          "hook": "مقدمة خاطفة",
          "script": "السيناريو",
          "cta": "نداء تفاعلي",
          "hashtags": ["ترند", "محتوى"],
          "aiScore": 90,
          "retentionRate": 85
        }
      `;

      const response = await openai.chat.completions.create({
        model: env.openaiModel || 'google/gemini-2.0-flash-exp:free',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: `فكرة الفيديو: ${userPrompt}` }
        ],
        temperature: 0.75,
      });

      let rawJson = response.choices[0].message.content.trim();
      
      // تنظيف المخرجات من أي شوائب ماركداون
      if (rawJson.startsWith('```')) {
        rawJson = rawJson.replace(/^```json\n?/, '').replace(/\n?```$/, '').replace(/^```\n?/, '');
      }

      return JSON.parse(rawJson);

    } catch (error) {
      console.error('❌ [OpenAI Core Error]:', error.message);
      throw new Error('فشل الاتصال: ' + error.message);
    }
  }
};