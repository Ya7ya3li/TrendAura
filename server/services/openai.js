export const askAI = async (prompt) => {
  try {
    const response = await fetch(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000',
          'X-Title': 'TrendAura'
        },
        body: JSON.stringify({
          model: 'openai/gpt-4o-mini',
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

    console.log("OPENROUTER RESPONSE:", data)

    if (!response.ok) {
      throw new Error(data?.error?.message || 'OpenRouter Error')
    }

    if (!data.choices?.[0]?.message?.content) {
      throw new Error('Invalid AI response format')
    }

    return data.choices[0].message.content
  } catch (error) {
    console.error("askAI error:", error.message)
    return "AI service temporarily unavailable"
  }
}