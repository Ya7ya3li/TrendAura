import { GoogleGenAI } from "@google/genai";
import { env } from "../config/env.js";

const ai = new GoogleGenAI({
  apiKey: env.geminiApiKey
});

/**
 * استخراج JSON بشكل أكثر أمانًا
 */
const cleanAndParseResponse = (text) => {
  try {
    if (!text || typeof text !== "string") return null;

    const match = text.match(/\{[\s\S]*\}/);
    if (!match) return null;

    return JSON.parse(match[0]);
  } catch (err) {
    console.error("JSON Parse Error:", err.message);
    return null;
  }
};

export const aiService = {

  /**
   * 🧠 توليد محتوى فيروسي شامل ومدمج بالمؤشرات والنصائح
   */
  async generateViralContent(userPrompt) {
    try {
      const prompt = `
أنت خبير صناعة محتوى تيك توك.

الفكرة:
"${userPrompt}"

أرجع JSON فقط بدون أي نص إضافي نهائياً:
{
  "hook": "افتتاحية قوية جداً لجذب الانتباه في أول 3 ثوانٍ",
  "script": "النص الرئيسي والسيناريو الكامل للفيديو",
  "cta": "دعوة واضحة للتفاعل وحركية التعليقات",
  "hashtags": ["هاشتاق1", "هاشتاق2", "هاشتاق3", "هاشتاق4", "هاشتاق5", "هاشتاق6", "هاشتاق7", "هاشتاق8", "هاشتاق9", "هاشتاق10"],
  "ideas": ["فكرة مكملة 1", "فكرة مكملة 2", "فكرة مكملة 3", "فكرة مكملة 4", "فكرة مكملة 5"],
  "bestTime": "الوقت الأمثل للنشر (مثال: الساعة 07:00 مساءً)",
  "trendProbability": 85,
  "retentionRate": 80,
  "hookStrength": "قوي جداً ومثير للفضول",
  "ctaRating": "ممتاز ويحفز الردود",
  "tips": ["النصيحة الأولى لتحسين الفيديو بصرياً", "النصيحة الثانية لرفع ريتم الإلقاء", "النصيحة الثالثة لتفجير المشاركات"]
}

الشروط:
- يجب تعبئة كافة الحقول والمصفوفات بدقة كاملة مستندة على الفكرة.
- مصفوفة tips يجب أن تحتوي على 3 نصائح عملية حقيقية مبنية على النص.
- لا تكتب أي شيء خارج JSON نهائياً.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = cleanAndParseResponse(response.text);
      if (!parsed) throw new Error("Gemini returned invalid JSON structure");

      return parsed;
    } catch (error) {
      console.error("Gemini Error:", error.message);
      throw new Error("فشل توليد المحتوى");
    }
  },

  /**
   * 🔬 تحليل مستقل للفيروسية (محمي ومزود بـ tips دائماً لضمان عدم ضرب الكروت)
   */
  async analyzeViralMetrics(scriptText) {
    try {
      const prompt = `
حلل هذا السكربت من ناحية الفيروسية:
"${scriptText}"

أرجع JSON فقط:
{
  "trendProbability": 85,
  "retentionRate": 78,
  "hookStrength": "قوي وممتاز",
  "ctaRating": "ممتاز وموجه",
  "tips": ["نصيحة بصرية أولى", "نصيحة صوتية ثانية", "نصيحة تفاعلية ثالثة"]
}

القيم الرقمية من 0 إلى 100 فقط، ومصفوفة tips إجبارية ولا تضف أي شرح خارج JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json"
        }
      });

      const parsed = cleanAndParseResponse(response.text);
      if (!parsed) throw new Error("Invalid metrics response");

      return parsed;
    } catch (error) {
      console.error("Gemini Metrics Error:", error.message);
      throw new Error("فشل تحليل الفيرال");
    }
  }
};