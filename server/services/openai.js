import OpenAI from 'openai';
import { env } from '../config/env.js';
import { promptComposer } from '../utils/generatePrompt.js'; 

const openai = new OpenAI({
  apiKey: env.openaiApiKey, // يكلم مفتاحك trendiaura فقط لا غير
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://trendaura.app", 
    "X-Title": "TrendAura"
  }
});

// ⏱️ فتيل زمني صارم؛ لو علق السيرفر الخارجي أكثر من 15 ثانية نقطع الاتصال ونكشف العلة
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
   * 🧠 1. توليد حقيقي ونقي 100% مستند على فكرتك فقط بدون أي تزييف
   */
  generateViralContent: async (userPrompt, options = {}) => {
    try {
      const contentStyle = options.hookStyle || 'تحفيزي';
      const systemContext = promptComposer.buildSystemContext(contentStyle);
      const formattedUserPrompt = promptComposer.buildUserPrompt(userPrompt);

      const response = await Promise.race([
        openai.chat.completions.create({
          model: 'google/gemma-2-9b-it:free', // الموديل المجاني المستقر محقون هنا مباشرة
          messages: [
            { role: 'system', content: systemContext },
            { role: 'user', content: formattedUserPrompt }
          ],
          temperature: 0.82 
        }),
        apiTimeout(15000) // مهلة 15 ثانية للتوليد الكامل
      ]);

      if (response && response.choices && response.choices.length > 0) {
        const parsed = cleanAndParseResponse(response.choices[0].message?.content || '');
        if (parsed) return parsed;
      }
      throw new Error('فشل السيرفر الخارجي في إرجاع قالب JSON صالح.');
    } catch (error) {
      console.error('❌ [AI Engine Real Error Caught]:', error.message);
      // يرمي الخطأ الحقيقي الصافي للكنترولر بدون أي نصوص وهمية
      throw new Error(error.message === 'TIMEOUT' ? 'انتهت مهلة الاتصال بأوبن راوتر، السيرفر الخارجي معلق حالياً.' : error.message);
    }
  },

  /**
   * 🔬 2. فحص وتحليل حقيقي ونقي 100%
   */
  analyzeViralMetrics: async (scriptText) => {
    try {
      if (!scriptText || scriptText.trim() === "") throw new Error('السياق فارغ');

      const response = await Promise.race([
        openai.chat.completions.create({
          model: 'google/gemma-2-9b-it:free',
          messages: [
            { role: 'system', content: 'تحليل تيك توك ذكي JSON' },
            { role: 'user', content: `حلل: "${scriptText}"` }
          ],
          temperature: 0.45 
        }),
        apiTimeout(15000)
      ]);

      if (response && response.choices && response.choices.length > 0) {
        const parsed = cleanAndParseResponse(response.choices[0].message?.content || '');
        if (parsed) return parsed;
      }
      throw new Error('فشل محرك التحليل الخارجي في صياغة الإحصائيات.');
    } catch (error) {
      console.error('❌ [Viral Metrics Real Error Caught]:', error.message);
      throw new Error(error.message === 'TIMEOUT' ? 'انتهت مهلة خادم الفحص والتحليل الخارجي.' : error.message);
    }
  }
};