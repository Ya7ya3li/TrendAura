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

    // تحسين: أخذ أول JSON فعلي حتى لو فيه نص إضافي
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
   * 🧠 توليد محتوى فيروسي
   */
  async generateViralContent(userPrompt) {
    try {
      const prompt = `
أنت خبير صناعة محتوى تيك توك احترافي.

الفكرة:
"${userPrompt}"

أرجع JSON فقط بدون أي نص إضافي:

{
  "script": "string",
  "hashtags": ["string"],
  "ideas": ["string"],
  "bestTime": "string"
}

الشروط:
- script: سكربت قوي قصير ومؤثر
- hashtags: 10 هاشتاقات دقيقة
- ideas: 5 أفكار مرتبطة بنفس المحتوى
- bestTime: وقت النشر الأمثل
- لا تكتب أي شيء خارج JSON نهائياً
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const text = response.text;
      const parsed = cleanAndParseResponse(text);

      if (!parsed) {
        throw new Error("Gemini returned invalid JSON");
      }

      return parsed;

    } catch (error) {
      console.error("Gemini Error:", error.message);
      throw new Error("فشل توليد المحتوى");
    }
  },

  /**
   * 🔬 تحليل الفيروسية
   */
  async analyzeViralMetrics(scriptText) {
    try {
      const prompt = `
حلل هذا السكربت من ناحية الفيروسية:

"${scriptText}"

أرجع JSON فقط:

{
  "trendProbability": 0,
  "retentionRate": 0,
  "hookStrength": 0,
  "ctaRating": 0
}

القيم من 0 إلى 100 فقط.
ولا تضف أي شرح خارج JSON.
`;

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt
      });

      const text = response.text;
      const parsed = cleanAndParseResponse(text);

      if (!parsed) {
        throw new Error("Invalid metrics response");
      }

      return parsed;

    } catch (error) {
      console.error("Gemini Metrics Error:", error.message);
      throw new Error("فشل تحليل الفيرال");
    }
  }
};