/**
 * TrendAura Proprietary Viral Psychological Analytical Engine
 * Evaluates layout structures using algorithmic weights for Tik-Tok standards.
 */
export const viralEngineService = {
  /**
   * حساب وتقدير نسب الصعود للاكسبلور ومستويات التفاعل النفسي
   */
  calculateViralPotential: (hookText = '', bodyText = '') => {
    const combined = (hookText + ' ' + bodyText).toLowerCase();
    
    // محفزات سيكولوجية الجماهير الأعلى نمواً واختراقاً للخوارزميات لعام 2026
    const highEngagementTriggers = [
      'سر', 'خطير', 'مجاناً', 'تطور', 'خطوات', 'أخطاء', 'تمنعك', 'تندم', 'كيف', 'تضاعف',
      'secret', 'viral', 'stop', 'hacks', 'grow', 'mistakes', 'proven', 'صادم', 'احذر'
    ];

    let matchCount = 0;
    highEngagementTriggers.forEach(trigger => {
      if (combined.includes(trigger)) matchCount++;
    });

    // معادلة هندسية تقديرية لحساب تقييم الـ AI Score من 100
    let calculatedScore = 75 + (matchCount * 4);
    if (hookText.length > 15 && hookText.length < 65) calculatedScore += 5; // الحيز البصري المثالي لطول الخطاف
    if (calculatedScore > 100) calculatedScore = 100;

    // حساب نسبة البقاء التقديرية التنافسية (Retention Rate Curve)
    let estimatedRetention = 60 + (matchCount * 5);
    if (estimatedRetention > 96) estimatedRetention = 96;

    return {
      aiScore: calculatedScore,
      retentionRate: estimatedRetention,
      triggerDensity: matchCount
    };
  }
};