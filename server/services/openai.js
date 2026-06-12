import OpenAI from 'openai';
import { env } from '../config/env.js';

const openai = new OpenAI({
  apiKey: env.openaiApiKey, // شغال على مفتاحك trendiaura الصافي والمكشوف
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://trendaura.app", 
    "X-Title": "TrendAura"
  }
});

// ⏱️ فتيل زمني (20 ثانية)
const apiTimeout = (ms) => new Promise((_, reject) => 
  setTimeout(() => reject(new Error('TIMEOUT')), ms)
);

const cleanAndParseResponse = (rawJsonText) => {
  try {
    const jsonMatch = rawJsonText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]);
  } catch (e) {
    return null;
  }
};

export const openaiService = {
  /**
   * 🧠 1. التوليد النقي المتوافق مع الكروت وبحجم توكنز اقتصادي
   */
  generateViralContent: async (userPrompt) => {
    try {
      const customPrompt = `
        أنت خبير محترف ورائد في صناعة المحتوى الفيروسي على منصة تيك توك وخوارزمياتها.
        بناءً على الفكرة التالية التي قدمها المستخدم: "${userPrompt}"
        
        قم بتوليد رد صريح ومباشر وبصيغة JSON Object يحتوي تماماً وحصرياً على المفاتيح التالية باللغة العربية:
        1. "script": سكريبت تيك توك كامل، مشوق، ومكتوب بأسلوب خاطف للعين من أول ثانيتين.
        2. "hashtags": مصفوفة (Array) تحتوي على 10 هاشتاقات قوية ونشطة لضرب التريند.
        3. "ideas": مصفوفة (Array) تحتوي على 5 أفكار لفيديوهات مشابهة أو مكملة.
        4. "bestTime": أفضل وقت دقيق ومقترح للنشر لجلب أعلى تفاعل (مثال: "7PM").

        تنبيه صارم: أعد كائن الـ JSON فقط، دون كتابة أي مقدمات أو علامات تشفير خارج أقواس الـ JSON.
      `;

      const response = await Promise.race([
        openai.chat.completions.create({
          model: 'deepseek/deepseek-chat', 
          messages: [
            { role: 'user', content: customPrompt }
          ],
          temperature: 0.72,
          max_tokens: 1200 // 🚀 حددنا الحجم هنا عشان محفظتك تكفي وتزيد 8 مرات عن المطلوب!
        }),
        apiTimeout(20000)
      ]);

      if (response && response.choices && response.choices.length > 0) {
        const parsed = cleanAndParseResponse(response.choices[0].message?.content || '');
        if (parsed) return parsed;
      }
      throw new Error('فشل المحرك في صياغة رد JSON متوافق مع الكروت.');
    } catch (error) {
      console.error('❌ [DeepSeek Engine Real Error Caught]:', error.message);
      throw new Error(error.message === 'TIMEOUT' ? 'انتهت مهلة خادم DeepSeek الخارجي.' : error.message);
    }
  },

  /**
   * 🔬 2. فحص المؤشرات بحجم توكنز اقتصادي جداً
   */
  analyzeViralMetrics: async (scriptText) => {
    try {
      if (!scriptText || scriptText.trim() === "") throw new Error('السياق فارغ');

      const response = await Promise.race([
        openai.chat.completions.create({
          model: 'deepseek/deepseek-chat',
          messages: [
            { role: 'user', content: `قم بتحليل نص السكريبت التالي وأعطني مصفوفة إحصائية سريعة له بصيغة JSON تحتوي حصراً على المفاتيح trendProbability و retentionRate و hookStrength و ctaRating كمفاتيح صريحة: "${scriptText}"` }
          ],
          temperature: 0.3,
          max_tokens: 400 // 🚀 حجم صغير جداً واقتصادي للفحص
        }),
        apiTimeout(15000)
      ]);

      if (response && response.choices && response.choices.length > 0) {
        const parsed = cleanAndParseResponse(response.choices[0].message?.content || '');
        if (parsed) return parsed;
      }
      throw new Error('فشل محرك التحليل في معالجة البيانات.');
    } catch (error) {
      console.error('❌ [DeepSeek Metrics Error Caught]:', error.message);
      throw new Error(error.message === 'TIMEOUT' ? 'انتهت مهلة خادم الفحص والتحليل.' : error.message);
    }
  }
};