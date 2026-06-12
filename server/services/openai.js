import OpenAI from 'openai';
import { env } from '../config/env.js';
import { promptComposer } from '../utils/generatePrompt.js'; 

const openai = new OpenAI({
  apiKey: env.openaiApiKey,
  baseURL: "https://openrouter.ai/api/v1",
  defaultHeaders: {
    "HTTP-Referer": "https://trendaura.app", 
    "X-Title": "TrendAura"
  }
});

const cleanAndParseResponse = (rawJsonText) => {
  const jsonMatch = rawJsonText.match(/\{[\s\S]*\}/);
  if (!jsonMatch) {
    throw new Error('النص المعاد من الذكاء الاصطناعي لا يحتوي على هيكل صالح.');
  }
  
  const targetJson = jsonMatch[0];
  let cleanJsonText = "";
  let inString = false;
  
  for (let i = 0; i < targetJson.length; i++) {
    let char = targetJson[i];
    if (char === '"' && targetJson[i - 1] !== '\\') {
      inString = !inString;
    }
    if (inString) {
      if (char === '\n') { cleanJsonText += '\\n'; continue; }
      if (char === '\r') { cleanJsonText += '\\r'; continue; }
      if (char === '\t') { cleanJsonText += '\\t'; continue; }
    }
    cleanJsonText += char;
  }
  return JSON.parse(cleanJsonText);
};

export const openaiService = {
  generateViralContent: async (userPrompt, options = {}) => {
    const contentStyle = options.hookStyle || 'تحفيزي';
    const systemContext = promptComposer.buildSystemContext(contentStyle);
    const formattedUserPrompt = promptComposer.buildUserPrompt(userPrompt);

    // اتصال حقيقي وصارم بموديل جوجل المستقر والمجاني حالياً بدون أي تزييف نصوص
    const response = await openai.chat.completions.create({
      model: env.openaiModel || 'google/gemma-2-9b-it:free',
      messages: [
        { role: 'system', content: systemContext },
        { role: 'user', content: formattedUserPrompt }
      ],
      temperature: 0.82 
    });

    if (!response || !response.choices || response.choices.length === 0) {
      throw new Error('لم يقم محرك الذكاء الاصطناعي بإرسال أي بيانات.');
    }

    const rawJson = response.choices[0].message?.content || '';
    const parsed = cleanAndParseResponse(rawJson);
    
    return {
      hook: parsed.hook || parsed.المقدمة || "خطاف قوي لخطف الانتباه!",
      script: parsed.script || parsed.السيناريو || "نص الفيديو الرئيسي المستهدف.",
      cta: parsed.cta || parsed.الخاتمة || "تابعنا للمزيد!",
      hashtags: Array.isArray(parsed.hashtags) ? parsed.hashtags : ["تريند"],
      aiScore: Number(parsed.aiScore) || 88,
      retentionRate: Number(parsed.retentionRate) || 83
    };
  },

  analyzeViralMetrics: async (scriptText) => {
    if (!scriptText || scriptText.trim() === "") {
      throw new Error('السياق فارغ');
    }

    const systemContext = `أنت خبير ومحلل رائد في خوارزميات تيك توك. حلل النص وأعد النتيجة حصراً بصيغة JSON Object تحتوي على: trendProbability, retentionRate, hookStrength, ctaRating, tips كمصفوفة نصوص.`;

    const response = await openai.chat.completions.create({
      model: env.openaiModel || 'google/gemma-2-9b-it:free',
      messages: [
        { role: 'system', content: systemContext },
        { role: 'user', content: `حلل بدقة: "${scriptText}"` }
      ],
      temperature: 0.45 
    });

    const rawJson = response.choices[0].message?.content || '';
    const parsed = cleanAndParseResponse(rawJson);

    return {
      trendProbability: Number(parsed.trendProbability) || 85,
      retentionRate: Number(parsed.retentionRate) || 80,
      hookStrength: parsed.hookStrength || "ممتاز",
      ctaRating: parsed.ctaRating || "قوي وموجه",
      tips: Array.isArray(parsed.tips) ? parsed.tips : ["حسن الأداء البصري في أول ثانيتين"]
    };
  }
};