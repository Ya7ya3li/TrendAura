// المسار: server/services/openai.js
import OpenAI from 'openai';
import { env } from '../config/env.js';

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://trendaura.app", 
    "X-Title": "TrendAura"
  }
});

export const openaiService = {
  generateViralContent: async (userPrompt, option = 'تحفيزي') => {
    try {
      const ALLOWED_KEYS = ["hook", "script", "cta", "hashtags", "aiScore", "retentionRate"];

      const systemContext = `
        أنت خبير سيكولوجية الجماهير. مهمتك: إعادة صياغة الفكرة في JSON.
        يجب أن يحتوي الـ JSON على هذه المفاتيح الستة فقط (ممنوع إضافة أي حقول أخرى):
        ${JSON.stringify(ALLOWED_KEYS)}
        أعد الخرج كـ JSON نقي فقط. أسلوب المحتوى: ${option}.
      `;

      const response = await openai.chat.completions.create({
        model: env.openaiModel || 'openai/gpt-oss-120b:free',
        messages: [
          { role: 'system', content: systemContext },
          { role: 'user', content: `فكرة الفيديو: ${userPrompt}` }
        ],
        temperature: 0.75,
      });

      let rawJson = response.choices[0].message.content.trim();
      
      if (rawJson.includes('```')) {
        rawJson = rawJson.replace(/```json/g, '').replace(/```/g, '').trim();
      }

      const parsed = JSON.parse(rawJson);
      const sanitized = {};
      
      // التنظيف مع حماية خاصة للهاشتاقات
      ALLOWED_KEYS.forEach(key => {
        if (parsed[key] !== undefined) {
          if (key === 'hashtags') {
            // 🛡️ السطر السحري: نضمن دائماً أنها Array
            sanitized[key] = Array.isArray(parsed[key]) 
              ? parsed[key] 
              : (typeof parsed[key] === 'string' ? parsed[key].split(',').map(s => s.trim()) : ['ترند']);
          } else {
            sanitized[key] = parsed[key];
          }
        }
      });

      return sanitized;

    } catch (error) {
      console.error('❌ [OpenAI Core Error]:', error.message);
      throw new Error('فشل الاتصال بمحرك الذكاء الاصطناعي: ' + error.message);
    }
  }
};