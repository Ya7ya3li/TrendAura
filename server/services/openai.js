import OpenAI from 'openai';
import { env } from '../config/env.js';
import { promptComposer } from '../utils/generatePrompt.js'; 

const openai = new OpenAI({
  apiKey: env.openaiApiKey, // يكلم مفتاحك trendiaura الصافي وبس
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://trendaura.app", 
    "X-Title": "TrendAura"
  }
});

// ⏱️ فتيل زمني صارم (15 ثانية) لحمايتك من تعليق البوابة الخارجية
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
   * 🧠 1. توليد حقيقي ونقي 100% عبر موديل Nex-N2-Pro المعتمد
   */
  generateViralContent: async (userPrompt, options = {}) => {
    try {
      const contentStyle = options.hookStyle || 'تحفيزي';
      const systemContext = promptComposer.buildSystemContext(contentStyle);
      const formattedUserPrompt = promptComposer.buildUserPrompt(userPrompt);

      const response = await Promise.race([
        openai.chat.completions.create({
          model: 'nex-agi/nex-n2-pro:free', // 🚀 تم حقن الـ Slug الصحيح والصريح حقك هنا
          messages: [
            { role: 'system', content: systemContext },
            { role: 'user', content: formattedUserPrompt }
          ],
          temperature: 0.82 
        }),
        apiTimeout(15000)
      ]);

      if (response && response.choices && response.choices.length > 0) {
        const parsed = cleanAndParseResponse(response.choices[0].message?.content || '');
        if (parsed) return parsed;
      }
      throw new Error('فشل الموديل الخارجي في صياغة رد صالح ببيئة JSON.');
    } catch (error) {
      console.error('❌ [AI Engine Real Error Caught]:', error.message);
      throw new Error(error.message === 'TIMEOUT' ? 'انتهت مهلة الاتصال بأوبن راوتر.' : error.message);
    }
  },

  /**
   * 🔬 2. فحص وتحليل حقيقي 100% عبر نفس الموديل المعتمد
   */
  analyzeViralMetrics: async (scriptText) => {
    try {
      if (!scriptText || scriptText.trim() === "") throw new Error('السياق فارغ');

      const response = await Promise.race([
        openai.chat.completions.create({
          model: 'nex-agi/nex-n2-pro:free', // 🚀 توحيد الـ Slug المباشر هنا أيضاً
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
      throw new Error('فشل محرك التحليل الخارجي في معالجة المصفوفة الحركية.');
    } catch (error) {
      console.error('❌ [Viral Metrics Real Error Caught]:', error.message);
      throw new Error(error.message === 'TIMEOUT' ? 'انتهت مهلة خادم الفحص والتحليل.' : error.message);
    }
  }
};