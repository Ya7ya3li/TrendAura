export const askAI = async (prompt, planType = 'free') => {
  try {
    // تحديد الموديل بناءً على الباقة
    let selectedModel = 'openai/gpt-4o-mini'; // الموديل الافتراضي والاقتصادي للمجاني و Pro

    // إذا كانت الباقة هي Viral Engine، نستخدم موديل أقوى وأكثر ذكاءً
    if (planType === 'pro_viral') {
      selectedModel = 'openai/gpt-4o'; // يمكنك تغييره لأي موديل قوي آخر مثل anthropic/claude-3.5-sonnet
    }

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://trendaura.com', // يفضل تغييره لرابط موقعك الحقيقي للإنتاج
          'X-Title': 'TrendAura'
        },
        body: JSON.stringify({
          model: selectedModel, // الموديل الديناميكي
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ]
        })
      }
    )

    const data = await response.json()

    // يمكنك إخفاء هذا السطر في الإنتاج لتقليل السجلات (Logs)
    // console.log("OPENROUTER RESPONSE:", data)

    if (!response.ok) {
      throw new Error(data?.error?.message || 'OpenRouter Error')
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format')
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error("askAI error:", error.message)
    return "نأسف، خدمة الذكاء الاصطناعي غير متاحة حالياً. يرجى المحاولة بعد قليل." // تعريب وتلطيف رسالة الخطأ
  }
}