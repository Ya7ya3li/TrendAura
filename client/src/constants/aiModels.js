/**
 * TrendAura AI Language Model Constraints
 */
export const AI_MODELS = {
  PRIMARY_CORE: {
    id: 'nex-agi/nex-n2-pro:free', // 🚀 ربط متناسق ومطابق 100% مع الباك إند
    name: 'TrendAura Turbo Core',
    provider: 'OpenRouter',
    temperature: 0.7,
    maxTokens: {
      free: 400,
      pro: 800,
      viral_engine: 1500
    }
  },
  ANALYTICS_CORE: {
    id: 'nex-agi/nex-n2-pro:free',
    name: 'TrendAura Analytics Engine',
    provider: 'OpenRouter',
    temperature: 0.3 
  }
};