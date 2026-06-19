import axios from 'axios';
import { env } from '../config/env.js';

// 🧹 دالة تنظيف ومطابقة الـ JSON (لحماية الواجهة الأمامية من أي نصوص زائدة)
const cleanAndParseResponse = (text) => {
    try {
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("❌ JSON Parse Error:", error.message);
        return null; // إذا فشل التحويل
    }
};

// 1️⃣ مزود المستوى الأول: Gemini
const callGemini = async (prompt) => {
    // استخدمنا الإصدار اللي تفضله 2.5-flash أو 1.5-flash المتاح
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${env.geminiApiKey}`;
    const response = await axios.post(url, {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: "application/json" } // إجبار جيميناي على JSON
    });
    return response.data.candidates[0].content.parts[0].text;
};

// 2️⃣ مزود المستوى الثاني: Groq (سريع كالبرق)
const callGroq = async (prompt) => {
    if (!env.groqApiKey) throw new Error("Groq API Key is missing");
    const response = await axios.post('[https://api.groq.com/openai/v1/chat/completions](https://api.groq.com/openai/v1/chat/completions)', {
        model: 'llama3-8b-8192',
        response_format: { type: "json_object" }, // إجبار قروق على JSON
        messages: [{ role: 'user', content: prompt }]
    }, { headers: { 'Authorization': `Bearer ${env.groqApiKey}` } });
    return response.data.choices[0].message.content;
};

// 3️⃣ مزود المستوى الثالث: OpenRouter (القلعة الأخيرة)
const callOpenRouter = async (prompt, modelName) => {
    if (!env.openRouterApiKey) throw new Error("OpenRouter API Key is missing");
    const response = await axios.post('[https://openrouter.ai/api/v1/chat/completions](https://openrouter.ai/api/v1/chat/completions)', {
        model: modelName,
        response_format: { type: "json_object" }, // إجبار أوبن راوتر على JSON
        messages: [{ role: 'user', content: prompt }]
    }, {
        headers: {
            'Authorization': `Bearer ${env.openRouterApiKey}`,
            'HTTP-Referer': '[https://trendaura.app](https://trendaura.app)',
            'X-Title': 'TrendAura SaaS'
        }
    });
    return response.data.choices[0].message.content;
};

// 🚀 قلب المحرك: سلسلة الطوارئ (Fallback Chain)
const executeFallbackChain = async (fullPrompt) => {
    console.log("⚡ [AI Engine]: Initiating Fallback Protocol...");
    let rawText = "";
    let finalProvider = "";

    try {
        console.log("🧠 Attempting Gemini...");
        rawText = await callGemini(fullPrompt);
        finalProvider = 'Gemini';
    } catch (err) {
        console.warn("⚠️ Gemini Failed. Shifting to Groq...");
        try {
            console.log("🧠 Attempting Groq...");
            rawText = await callGroq(fullPrompt);
            finalProvider = 'Groq';
        } catch (err) {
            console.warn("⚠️ Groq Failed. Shifting to OpenRouter...");
            const openRouterModels = [
                'meta-llama/llama-3-8b-instruct',
                'mistralai/mistral-7b-instruct',
                'qwen/qwen-2.5-72b-instruct'
            ];

            let success = false;
            for (const model of openRouterModels) {
                try {
                    console.log(`🧠 Attempting OpenRouter -> ${model}...`);
                    rawText = await callOpenRouter(fullPrompt, model);
                    finalProvider = `OpenRouter-${model.split('/')[0]}`;
                    success = true;
                    break; // إذا نجح، أوقف اللوب
                } catch (err) {
                    console.warn(`⚠️ OpenRouter (${model}) Failed. Trying next...`);
                }
            }
            if (!success) throw new Error("جميع محركات الذكاء الاصطناعي تواجه ضغطاً هائلاً حالياً.");
        }
    }

    // 👑 النقطة الأهم: تنظيف النص وتحويله لكائن JSON للواجهة
    const parsedData = cleanAndParseResponse(rawText);
    if (!parsedData) {
        throw new Error(`الذكاء الاصطناعي (${finalProvider}) أرجع بيانات غير صالحة.`);
    }

    return { parsedData, provider: finalProvider };
};

// 👑 تصدير الخدمة مطابقة تماماً للملف القديم
export const aiEngine = {
    async generateViralContent(userPrompt) {
        const fullPrompt = `أنت خبير صناعة محتوى تيك توك.

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
- لا تكتب أي شيء خارج JSON نهائياً.`;

        return await executeFallbackChain(fullPrompt);
    },

    async analyzeViralMetrics(scriptText) {
        const fullPrompt = `حلل هذا السكربت من ناحية الفيروسية:
"${scriptText}"

أرجع JSON فقط:
{
  "trendProbability": 85,
  "retentionRate": 78,
  "hookStrength": "قوي وممتاز",
  "ctaRating": "ممتاز وموجه",
  "tips": ["نصيحة بصرية أولى", "نصيحة صوتية ثانية", "نصيحة تفاعلية ثالثة"]
}

القيم الرقمية من 0 إلى 100 فقط، ومصفوفة tips إجبارية ولا تضف أي شرح خارج JSON.`;

        return await executeFallbackChain(fullPrompt);
    }
};