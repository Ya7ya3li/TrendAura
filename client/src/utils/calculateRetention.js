/**
 * TrendAura Retention Prognosis Algorithm
 * Evaluates text properties to predict audience retention rates.
 */
export const calculateRetention = (scriptText) => {
  if (!scriptText || scriptText.trim().length < 10) {
    return { score: 0, grade: 'ضعيف', color: 'text-rose-500' };
  }

  const textLength = scriptText.trim().length;
  let simulatedScore = 65; 

  // 1. معايرة الكلمات المفتاحية الخطافة الحركية
  const viralTriggers = ['سر', 'صادم', 'أسرار', 'لا تتوقع', 'تخيل', 'أخيراً', '90%', 'احذر'];
  viralTriggers.forEach((trigger) => {
    if (scriptText.includes(trigger)) {
      simulatedScore += 4;
    }
  });

  // 2. المعايرة الحجمية المثالية لسكريبتات تيك توك التنافسية
  if (textLength >= 150 && textLength <= 500) {
    simulatedScore += 12;
  } else if (textLength > 800) {
    simulatedScore -= 10; 
  }

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