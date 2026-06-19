import { env } from '../config/env.js';

// 🧹 دالة تنظيف ومطابقة الـ JSON
const cleanAndParseResponse = (text) => {
    try {
        const cleaned = text.replace(/```json/gi, '').replace(/```/g, '').trim();
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("❌ JSON Parse Error:", error.message);
        return null;
    }
};

// 1️⃣ مزود المستوى الأول: Gemini
const callGemini = async (prompt) => {
    // 👑 تم التحديث إلى الموديل الخاص بك gemini-2.5-flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.geminiApiKey}`;

    const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
            generationConfig: { responseMimeType: "application/json" }
        })
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return data.candidates[0].content.parts[0].text;
};

// 2️⃣ مزود المستوى الثاني: Groq
const callGroq = async (prompt) => {
    if (!env.groqApiKey) throw new Error("Groq API Key is missing");

    const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.groqApiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            model: 'llama-3.1-8b-instant', // 👑 تم التحديث للموديل السريع الجديد
            response_format: { type: "json_object" },
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return data.choices[0].message.content;
};

// 3️⃣ مزود المستوى الثالث: OpenRouter
const callOpenRouter = async (prompt, modelName) => {
    if (!env.openRouterApiKey) throw new Error("OpenRouter API Key is missing");

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${env.openRouterApiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'https://trendaura.app',
            'X-Title': 'TrendAura SaaS'
        },
        body: JSON.stringify({
            model: modelName,
            response_format: { type: "json_object" },
            messages: [{ role: 'user', content: prompt }]
        })
    });

    if (!response.ok) throw new Error(await response.text());
    const data = await response.json();
    return data.choices[0].message.content;
};

// 🚀 قلب المحرك: سلسلة الطوارئ (الآن محصنة بـ Fetch)
const executeFallbackChain = async (fullPrompt) => {
    console.log("⚡ [AI Engine]: Initiating Fallback Protocol...");
    let rawText = "";
    let finalProvider = "";

    try {
        console.log("🧠 Attempting Gemini...");
        rawText = await callGemini(fullPrompt);
        finalProvider = 'Gemini';
    } catch (err) {
        console.warn("⚠️ Gemini Failed. Reason:", err.message);

        try {
            console.log("🧠 Attempting Groq...");
            rawText = await callGroq(fullPrompt);
            finalProvider = 'Groq';
        } catch (err) {
            console.warn("⚠️ Groq Failed. Reason:", err.message);

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
                    break;
                } catch (err) {
                    console.warn(`⚠️ OpenRouter (${model}) Failed. Reason:`, err.message);
                }
            }
            if (!success) throw new Error("جميع محركات الذكاء الاصطناعي تواجه ضغطاً هائلاً حالياً.");
        }
    }

    const parsedData = cleanAndParseResponse(rawText);
    if (!parsedData) {
        throw new Error(`الذكاء الاصطناعي (${finalProvider}) أرجع بيانات غير صالحة.`);
    }

    return { parsedData, provider: finalProvider };
};

// 👑 تصدير الخدمة
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