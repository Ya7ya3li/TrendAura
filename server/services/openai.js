export const askAI = async (prompt, planType = 'free') => {
  try {
    // 🌟 استخدمنا الموديل الاقتصادي والذكي جداً عشان يشتغل مع رصيدك الحالي براحة
    const selectedModel = 'openai/gpt-4o-mini'; 

    console.log(`🤖 NEW CODE RUNNING: Requesting ${selectedModel} with max_tokens: 500`);

    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'https://trendaura-two.vercel.app', 
          'X-Title': 'TrendAura'
        },
        body: JSON.stringify({
          model: selectedModel,
          messages: [
            {
              role: 'user',
              content: prompt
            }
          ],
          // حددناها بـ 500 كلمة فقط عشان يقبلها غصب
          max_tokens: 500,
          temperature: 0.7
        })
      }
    )

    const data = await response.json()

    if (!response.ok) {
      console.error("❌ OpenRouter Error:", data);
      throw new Error(data?.error?.message || 'OpenRouter Error')
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format')
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error("❌ askAI error:", error.message)
    throw new Error(error.message)
  }
}