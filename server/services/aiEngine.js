import { env } from '../config/env.js';

// 🧹 1) مستخرج JSON الذكي (Depth-Tracking)
const cleanAndParseResponse = (text) => {
    try {
        let start = text.indexOf('{');
        if (start === -1) return null;

        let depth = 0;
        for (let i = start; i < text.length; i++) {
            if (text[i] === '{') depth++;
            if (text[i] === '}') depth--;

            if (depth === 0) {
                const jsonString = text.slice(start, i + 1);
                return JSON.parse(jsonString);
            }
        }
        return null;
    } catch (error) {
        console.error("❌ [JSON Parse Exception]:", error.message);
        return null;
    }
};

// 🧹 2) مطهر النصوص والمصفوفات داخل الكائن (Data Trimming)
const trimObject = (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === "string") {
            obj[key] = obj[key].trim();
        }
        if (Array.isArray(obj[key])) {
            obj[key] = obj[key].map(item => typeof item === "string" ? item.trim() : item);
        }
    }
};

// 🎯 3) مطبع ومحصن النسب المئوية
const normalizePercentage = (value) => {
    if (value === undefined || value === null) return 0;
    const num = Number(String(value).replace("%", "").trim());
    return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 0;
};

// 🔄 4) نظام إعادة المحاولة الذكي (يتخطى الأخطاء القاتلة)
const retry = async (fn, retries = 1) => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (error) {
            const message = error.message || "";
            // التقاط أخطاء الشبكة والـ AbortController فقط
            const retryable =
                message.includes("Timeout") ||
                message.includes("fetch") ||
                message.includes("ECONNRESET") ||
                message.includes("ETIMEDOUT") ||
                error.name === 'AbortError';

            if (!retryable || i === retries) {
                throw error;
            }
            console.warn(`⏳ [Retry]: Network/Timeout issue detected. Retrying...`);
        }
    }
};

// 1️⃣ مزود المستوى الأول: Gemini
const callGemini = async (prompt) => {
    // 👑 إزالة المفتاح من الرابط لأسباب أمنية
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': env.geminiApiKey // 👑 تمرير المفتاح في الـ Headers
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 700 // 👑 تقييد التوكنز للسرعة والتكلفة
                }
            })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Gemini returned empty response structure");

        return text;
    } finally {
        clearTimeout(timeoutId);
    }
};

// 2️⃣ مزود المستوى الثاني: Groq
const callGroq = async (prompt) => {
    if (!env.groqApiKey) throw new Error("Groq API Key is missing");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Authorization': `Bearer ${env.groqApiKey}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: 'llama-3.1-8b-instant',
                temperature: 0.7,
                max_tokens: 700, // 👑 تقييد التوكنز
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        const text = data?.choices?.[0]?.message?.content;
        if (!text) throw new Error("Groq returned empty response structure");

        return text;
    } finally {
        clearTimeout(timeoutId);
    }
};

// 3️⃣ مزود المستوى الثالث: OpenRouter
const callOpenRouter = async (prompt, modelName) => {
    if (!env.openRouterApiKey) throw new Error("OpenRouter API Key is missing");

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Authorization': `Bearer ${env.openRouterApiKey}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': 'https://trendaura-two.vercel.app',
                'X-Title': 'TrendAura SaaS'
            },
            body: JSON.stringify({
                model: modelName,
                temperature: 0.7,
                max_tokens: 700, // 👑 تقييد التوكنز
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        const text = data?.choices?.[0]?.message?.content;
        if (!text) throw new Error(`OpenRouter (${modelName}) returned empty response structure`);

        return text;
    } finally {
        clearTimeout(timeoutId);
    }
};

// 🚀 قلب المحرك: سلسلة الطوارئ المقاومة للأعطال
const executeFallbackChain = async (fullPrompt, requiredFields) => {
    console.log("⚡ [AI Engine]: Initiating Fallback Protocol...");
    let rawText = "";
    let finalProvider = "";

    try {
        console.log("🧠 Attempting Gemini...");
        rawText = await retry(() => callGemini(fullPrompt), 1);
        finalProvider = 'Gemini';
    } catch (err) {
        console.warn("⚠️ Gemini Failed. Reason:", err.name === 'AbortError' ? 'Timeout' : err.message);

        try {
            console.log("🧠 Attempting Groq...");
            rawText = await retry(() => callGroq(fullPrompt), 1);
            finalProvider = 'Groq';
        } catch (err) {
            console.warn("⚠️ Groq Failed. Reason:", err.name === 'AbortError' ? 'Timeout' : err.message);

            const openRouterModels = [
                'deepseek/deepseek-chat-v3',
                'qwen/qwen3-32b',
                'mistralai/mistral-small',
                'meta-llama/llama-3.3-70b-instruct'
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
                    console.warn(`⚠️ OpenRouter (${model}) Failed. Reason:`, err.name === 'AbortError' ? 'Timeout' : err.message);
                }
            }
            if (!success) throw new Error("جميع محركات الذكاء الاصطناعي فشلت في الاستجابة حالياً.");
        }
    }

    const parsedData = cleanAndParseResponse(rawText);
    if (!parsedData) {
        throw new Error(`الذكاء الاصطناعي (${finalProvider}) أرجع بيانات غير صالحة ولا يمكن تحويلها لـ JSON.`);
    }

    // 👑 تنفيذ التطهير الشامل للنصوص والفراغات
    trimObject(parsedData);

    // 🎯 تطبيع النسب المئوية
    parsedData.trendProbability = normalizePercentage(parsedData.trendProbability);
    parsedData.retentionRate = normalizePercentage(parsedData.retentionRate);

    // 🛡️ التحقق من وجود الحقول الأساسية
    const missingFields = requiredFields.filter(field => !(field in parsedData));
    if (missingFields.length > 0) {
        throw new Error(`بيانات ناقصة من المزود (${finalProvider}). الحقول المفقودة: [${missingFields.join(",")}]`);
    }

    // 🛡️ التحقق الصارم من هيكل ومحتوى المصفوفات
    if (requiredFields.includes("hashtags") && !Array.isArray(parsedData.hashtags)) {
        throw new Error("Validation Failed: 'hashtags' must be an array.");
    }
    if (requiredFields.includes("ideas") && !Array.isArray(parsedData.ideas)) {
        throw new Error("Validation Failed: 'ideas' must be an array.");
    }
    if (requiredFields.includes("tips")) {
        if (!Array.isArray(parsedData.tips)) {
            throw new Error("Validation Failed: 'tips' must be an array.");
        }
        if (parsedData.tips.length < 3) {
            throw new Error("Validation Failed: 'tips' array is too short (minimum 3 required).");
        }
    }

    return { parsedData, provider: finalProvider };
};

// 👑 تصدير الخدمة
export const aiEngine = {
    async generateViralContent(userPrompt) {
        const requiredFields = [
            "hook", "script", "cta", "hashtags", "ideas", "bestTime",
            "trendProbability", "retentionRate", "hookStrength", "ctaRating", "tips"
        ];

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

        return await executeFallbackChain(fullPrompt, requiredFields);
    },

    async analyzeViralMetrics(scriptText) {
        const requiredFields = [
            "trendProbability", "retentionRate", "hookStrength", "ctaRating", "tips"
        ];

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

        return await executeFallbackChain(fullPrompt, requiredFields);
    }
};