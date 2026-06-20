import { env } from '../config/env.js';

// ⏳ إعدادات النظام
const API_TIMEOUT = 12000; // 12 ثانية لتجنب القتل المبكر في Railway

// 🧹 1) مستخرج JSON الذكي والمدرع (يعالج الأقواس داخل النصوص والهروب)
const cleanAndParseResponse = (text) => {
    try {
        let start = text.indexOf('{');
        if (start === -1) return null;

        let depth = 0;
        let inString = false;
        let escaped = false;

        for (let i = start; i < text.length; i++) {
            const char = text[i];

            if (escaped) {
                escaped = false;
                continue;
            }

            if (char === '\\') {
                escaped = true;
                continue;
            }

            if (char === '"') {
                inString = !inString;
            }

            if (!inString) {
                if (char === '{') depth++;
                if (char === '}') depth--;

                if (depth === 0) {
                    return JSON.parse(text.slice(start, i + 1));
                }
            }
        }

        return null;

    } catch (error) {
        console.error("❌ [JSON Parse Exception]:", error.message);
        return null;
    }
};

// 🧹 2) مطهر النصوص والمصفوفات (النسخة المدرعة ضد الكائنات)
const trimObject = (obj) => {
    for (const key in obj) {
        if (typeof obj[key] === "string") {
            obj[key] = obj[key].trim();
        }
        if (Array.isArray(obj[key])) {
            obj[key] = obj[key].map(item => {
                // إذا كان نصاً عادياً، نظفه
                if (typeof item === "string") return item.trim();

                // 🛡️ إذا تفلسف الذكاء الاصطناعي وأرجع كائن {title, description}، ادمجهم كنص!
                if (typeof item === "object" && item !== null) {
                    return Object.values(item).join(" - ").trim();
                }

                // لأي نوع آخر
                return String(item);
            });
        }
    }
};

// 🎯 3) مطبع ومحصن النسب المئوية
const normalizePercentage = (value) => {
    if (value === undefined || value === null) return 0;
    const num = Number(String(value).replace("%", "").trim());
    return Number.isFinite(num) ? Math.max(0, Math.min(100, num)) : 0;
};

// 🔄 4) نظام إعادة المحاولة الذكي
const retry = async (fn, retries = 1) => {
    for (let i = 0; i <= retries; i++) {
        try {
            return await fn();
        } catch (error) {
            const message = error.message || "";
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
    const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

    try {
        const response = await fetch(url, {
            method: 'POST',
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                'x-goog-api-key': env.geminiApiKey
            },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.9,
                    maxOutputTokens: 1500, // 👑 رفع السعة لدعم النصوص العربية الطويلة
                    responseMimeType: "application/json"
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
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

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
                max_tokens: 1500, // 👑 رفع السعة
                response_format: { type: "json_object" },
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
    const timeoutId = setTimeout(() => controller.abort(), API_TIMEOUT);

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
                max_tokens: 1500, // 👑 رفع السعة
                response_format: { type: "json_object" },
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

    const validateResponse = (rawText, providerName) => {
        const parsed = cleanAndParseResponse(rawText);
        if (!parsed) {
            console.error(`❌ [${providerName} Raw Output Failed]:`, rawText);
            throw new Error(`فشل استخراج JSON صالح من ${providerName}`);
        }

        trimObject(parsed);
        parsed.trendProbability = normalizePercentage(parsed.trendProbability);
        parsed.retentionRate = normalizePercentage(parsed.retentionRate);

        const missingFields = requiredFields.filter(field => !(field in parsed));
        if (missingFields.length > 0) {
            throw new Error(`بيانات ناقصة من المزود (${providerName}). المفقود: [${missingFields.join(",")}]`);
        }

        if (requiredFields.includes("hashtags") && !Array.isArray(parsed.hashtags)) throw new Error("Validation Failed: 'hashtags' must be an array.");
        if (requiredFields.includes("ideas") && !Array.isArray(parsed.ideas)) throw new Error("Validation Failed: 'ideas' must be an array.");
        if (requiredFields.includes("tips")) {
            if (!Array.isArray(parsed.tips)) throw new Error("Validation Failed: 'tips' must be an array.");
            if (parsed.tips.length < 3) throw new Error("Validation Failed: 'tips' array is too short.");
        }

        return parsed;
    };

    let finalProvider = "";
    let finalParsedData = null;

    try {
        console.log("🧠 Attempting Gemini...");
        const rawText = await retry(() => callGemini(fullPrompt), 1);
        finalProvider = 'Gemini';
        finalParsedData = validateResponse(rawText, finalProvider);
    } catch (err) {
        console.warn("⚠️ Gemini Failed. Reason:", err.name === 'AbortError' ? 'Timeout' : err.message);

        try {
            console.log("🧠 Attempting Groq...");
            const rawText = await retry(() => callGroq(fullPrompt), 1);
            finalProvider = 'Groq';
            finalParsedData = validateResponse(rawText, finalProvider);
        } catch (err) {
            console.warn("⚠️ Groq Failed. Reason:", err.name === 'AbortError' ? 'Timeout' : err.message);

            // 👑 قائمة النماذج السريعة والفعالة للتوسع
            const openRouterModels = [
                'deepseek/deepseek-chat-v3',
                'qwen/qwen3-32b',
                'mistralai/mistral-small',
                'meta-llama/llama-3.1-8b-instruct'
            ];

            let success = false;
            for (const model of openRouterModels) {
                try {
                    console.log(`🧠 Attempting OpenRouter -> ${model}...`);
                    const rawText = await callOpenRouter(fullPrompt, model);
                    finalProvider = `OpenRouter-${model.split('/')[0]}`;
                    finalParsedData = validateResponse(rawText, finalProvider);
                    success = true;
                    break;
                } catch (err) {
                    console.warn(`⚠️ OpenRouter (${model}) Failed. Reason:`, err.name === 'AbortError' ? 'Timeout' : err.message);
                }
            }
            if (!success) throw new Error("جميع محركات الذكاء الاصطناعي فشلت في الاستجابة حالياً.");
        }
    }

    return { parsedData: finalParsedData, provider: finalProvider };
};

// 👑 تصدير الخدمة
export const aiEngine = {
    async generateViralContent(userPrompt) {
        if (!userPrompt || !userPrompt.trim()) {
            throw new Error("الرجاء إدخال فكرة للمحتوى قبل البدء بالتوليد.");
        }

        const requiredFields = [
            "hook", "script", "cta", "hashtags", "ideas", "bestTime",
            "trendProbability", "retentionRate", "hookStrength", "ctaRating", "tips"
        ];

        const fullPrompt = `أنت API لإنتاج محتوى تيك توك فيروسي احترافي.

مهم جداً جداً (قواعد اللغة والمحتوى):
- استخدم لغة عربية طبيعية وجذابة (لهجة بيضاء أو سعودية دارجة).
- ممنوع منعاً باتاً الترجمة الحرفية من الإنجليزية (مثل: "هجومي الناري" أو "اقشع").
- استخدم مصطلحات التيك توك الحقيقية (مثل: "سوايب"، "حركة الإكسبلور"، "رابط في البايو").
- المحتوى يجب أن يكون منطقياً، متسلسلاً، وخالياً من الدراما المبالغ فيها أو الكلمات الغريبة.

مهم جداً (قواعد النظام):
- أعد JSON صالح فقط.
- ممنوع كتابة Markdown أو أي نص خارج JSON.
- يجب أن يكون المحتوى أصلياً ومخصصاً للفكرة.
- trendProbability رقم من 0–100.
- retentionRate رقم من 0–100.
- hashtags تحتوي 10 عناصر.
- ideas تحتوي 5 عناصر.
- tips تحتوي 3 عناصر.

الفكرة:
"${userPrompt}"

الرد يجب أن يطابق هذا الهيكل حرفياً:
{
  "hook": "",
  "script": "",
  "cta": "",
  "hashtags": [],
  "ideas": [],
  "bestTime": "",
  "trendProbability": 0,
  "retentionRate": 0,
  "hookStrength": "",
  "ctaRating": "",
  "tips": []
}`;

        return await executeFallbackChain(fullPrompt, requiredFields);
    },

    async analyzeViralMetrics(scriptText) {
        if (!scriptText || !scriptText.trim()) {
            throw new Error("الرجاء إدخال السكريبت المطلوب تحليله.");
        }

        const requiredFields = [
            "trendProbability", "retentionRate", "hookStrength", "ctaRating", "tips"
        ];

        const fullPrompt = `أنت API لتحليل محتوى تيك توك وتقييم فيروسيته.

مهم جداً:
- أعد JSON صالح فقط.
- ممنوع كتابة Markdown.
- ممنوع كتابة شرح.
- ممنوع كتابة أي نص خارج JSON.
- يجب أن يكون التحليل دقيقاً ومبنياً على السكريبت المدخل.
- trendProbability رقم من 0–100.
- retentionRate رقم من 0–100.
- tips تحتوي 3 عناصر.

السكريبت:
"${scriptText}"

الرد يجب أن يطابق هذا الهيكل حرفياً:
{
  "trendProbability": 0,
  "retentionRate": 0,
  "hookStrength": "",
  "ctaRating": "",
  "tips": []
}`;

        return await executeFallbackChain(fullPrompt, requiredFields);
    }
};