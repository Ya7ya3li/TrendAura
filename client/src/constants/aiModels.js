export const AI_MODELS = {
  PRIMARY_CORE: {
    id: 'gemini-2.5-flash',
    name: 'TrendAura AI Core',
    provider: 'Google Gemini',
    temperature: 0.7,
    maxTokens: {
      free: 400,
      pro: 800,
      viral_engine: 1500
    }
  },

  ANALYTICS_CORE: {
    id: 'gemini-2.5-flash',
    name: 'TrendAura Analytics Engine',
    provider: 'Google Gemini',
    temperature: 0.3
  }
};