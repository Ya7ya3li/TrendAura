/**
 * TrendAura Proprietary Viral Psychological Analytical Engine
 */
export const viralEngineService = {
  calculateViralPotential: (hookText = '', bodyText = '') => {
    const combined = (hookText + ' ' + bodyText).toLowerCase();
    
    // 🧠 مصفوفة الكلمات والمحفزات السلوكية الأعلى تفاعلاً في خوارزميات السوشيال ميديا لعام 2026
    const highEngagementTriggers = [
      'سر', 'خطير', 'مجاناً', 'تطور', 'خطوات', 'أخطاء', 'تمنعك', 'تندم', 'كيف', 'تضاعف',
      'secret', 'viral', 'stop', 'hacks', 'grow', 'mistakes', 'proven'
    ];

    let matchCount = 0;
    highEngagementTriggers.forEach(trigger => {
      if (combined.includes(trigger)) matchCount++;
    });

    // 📐 معادلة هندسية تقديرية لحساب التقييم من 100 بناءً على كثافة المحفزات وطول النص
    let calculatedScore = 75 + (matchCount * 4);
    if (hookText.length > 15 && hookText.length < 65) calculatedScore += 5; // طول مثالي للخطاف
    if (calculatedScore > 100) calculatedScore = 100;

    // حساب منحنى بقاء واحتفاظ الجماهير التقديري (Retention Rate)
    let estimatedRetention = 60 + (matchCount * 5);
    if (estimatedRetention > 96) estimatedRetention = 96;

    return {
      aiScore: calculatedScore,
      retentionRate: estimatedRetention,
      triggerDensity: matchCount
    };
  }
};