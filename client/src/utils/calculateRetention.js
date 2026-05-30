/**
 * TrendAura Retention Prognosis Algorithm
 * Evaluates text properties to predict audience retention rates.
 */
export const calculateRetention = (scriptText) => {
  if (!scriptText || scriptText.trim().length < 10) {
    return { score: 0, grade: 'ضعيف', color: 'text-rose-500' };
  }

  const textLength = scriptText.trim().length;
  let simulatedScore = 65; // الحد الأدنى القياسي للاحتفاظ بوجود سكريبت مكتمل

  // 1. زيادة الـ Score إذا كان النص يحتوى على كلمات خطافية ومحفزة قوية
  const viralTriggers = ['سر', 'صادم', 'أسرار', 'لا تتوقع', 'تخيل', 'أخيراً', '90%', 'احذر'];
  viralTriggers.forEach((trigger) => {
    if (scriptText.includes(trigger)) {
      simulatedScore += 4;
    }
  });

  // 2. معايرة الحجم (الإيقاع المثالي لسكريبتات تيك توك بين 150 إلى 600 حرف)
  if (textLength >= 150 && textLength <= 500) {
    simulatedScore += 12;
  } else if (textLength > 800) {
    simulatedScore -= 10; // السكريبتات الطويلة جداً تخفض نسب الاحتفاظ تلقائياً
  }

  // تقييد النقاط في السقف الهندسي المسموح (الحد الأقصى 99%)
  const finalScore = Math.min(Math.max(simulatedScore, 40), 99);

  let grade = 'مقبول';
  let color = 'text-amber-500';

  if (finalScore >= 85) {
    grade = 'خارق وفايرال 🚀';
    color = 'text-emerald-500';
  } else if (finalScore >= 70) {
    grade = 'ممتاز ومستقر';
    color = 'text-blue-500';
  }

  return {
    score: finalScore,
    grade,
    color
  };
};