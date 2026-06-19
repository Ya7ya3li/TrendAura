import { env } from '../config/env.js';

// 🧹 1) مستخرج ومطهر كتل JSON الفولاذي باستخدام العبارات النمطية (Regex)
const cleanAndParseResponse = (text) => {
    try {
        // استخراج أول كائن JSON يبدأ بـ { وينتهي بـ } بغض النظر عن النصوص المحيطة
        const jsonMatch = text.match(/\{[\s\S]*\}/);

        if (!jsonMatch) {
            console.error("❌ [Sanitizer Error]: No valid JSON block discovered in the output.");
            return null;
        }

        return JSON.parse(jsonMatch[0]);
    } catch (error) {
        console.error("❌ [JSON Parse Exception]:", error.message);
        return null;
    }
};

// 1️⃣ مزود المستوى الأول: Gemini
const callGemini = async (prompt) => {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${env.geminiApiKey}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    try {
        const response = await fetch(url, {
            method: 'POST',
            signal: controller.signal,
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7 // 🎯 2) تثبيت معيار التوازن الإبداعي
                }
            })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        // 🛡️ 3) حماية متقدمة للردود الناقصة لمنع العطل المتقطع
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Gemini payload validation failed: Empty content parts");

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
                temperature: 0.7, // 🎯 2) ضبط ريتم التوليد
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        const text = data?.choices?.[0]?.message?.content;
        if (!text) throw new Error("Groq payload validation failed: Empty choices");

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
                temperature: 0.7, // 🎯 2) توحيد جودة الردود سحابياً
                messages: [{ role: 'user', content: prompt }]
            })
        });

        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();

        const text = data?.choices?.[0]?.message?.content;
        if (!text) throw new Error(`OpenRouter [${modelName}] payload validation failed: Empty choices`);

        return text;
    } finally {
        clearTimeout(timeoutId);
    }
};

// 🚀 قلب المحرك: سلسلة الطوارئ المزودة بالفحص والتطبيع الهيكلي
const executeFallbackChain = async (fullPrompt, requiredFields) => {
    console.log("⚡ [AI Engine]: Initiating Fallback Protocol...");
    let rawText = "";
    let finalProvider = "";

    try {
        console.log("🧠 Attempting Gemini...");
        rawText = await callGemini(fullPrompt);
        finalProvider = 'Gemini';
    } catch (err) {
        console.warn("⚠️ Gemini Failed. Reason:", err.name === 'AbortError' ? 'Timeout (8s exceeded)' : err.message);

        try {
            console.log("🧠 Attempting Groq...");
            rawText = await callGroq(fullPrompt);
            finalProvider = 'Groq';
        } catch (err) {
            console.warn("⚠️ Groq Failed. Reason:", err.name === 'AbortError' ? 'Timeout (8s exceeded)' : err.message);

            // 👑 4) مصفوفة سلاسل OpenRouter المحدثة والذكية
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
                    console.warn(`⚠️ OpenRouter (${model}) Failed. Reason:`, err.name === 'AbortError' ? 'Timeout (8s exceeded)' : err.message);
                }
            }
            if (!success) throw new Error("جميع محركات الذكاء الاصطناعي فشلت في الاستجابة أو انتهت مهلتها.");
        }
    }

    // استخراج الكائن وتنظيفه
    const parsedData = cleanAndParseResponse(rawText);
    if (!parsedData) {
        throw new Error(`فشل استخراج كائن JSON صالح من استجابة المزود (${finalProvider})`);
    }

    // 🎯 3) تطبيع وتطهير النسب المئوية لضمان العمليات الحسابية في الواجهة
    if (parsedData.trendProbability !== undefined) {
        parsedData.trendProbability = Number(String(parsedData.trendProbability).replace("%", "").trim());
    }
    if (parsedData.retentionRate !== undefined) {
        parsedData.retentionRate = Number(String(parsedData.retentionRate).replace("%", "").trim());
    }

    // 🛡️ 4) التحقق الصارم من سلامة الهيكل واكتمال الكروت المطلوبة
    const missingFields = requiredFields.filter(field => !(field in parsedData));
    if (missingFields.length > 0) {
        throw new Error(`بنية البيانات ناقصة من المزود (${finalProvider})، الحقول المفقودة: [${missingFields.join(", ")}]`);
    }

    return { parsedData, provider: finalProvider };
};

// 👑 تصدير الخدمة مطابقة ومعززة بصمامات الأمان
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