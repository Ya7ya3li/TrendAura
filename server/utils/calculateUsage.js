/**
 * TrendAura Mathematical Token Quota & Usage Calculator
 */
export const calculateUsage = (generationCount = 0, dailyMaxLimit = 5) => {
  const used = Math.min(generationCount, dailyMaxLimit);
  const remaining = Math.max(0, dailyMaxLimit - used);
  const usagePercentage = (used / dailyMaxLimit) * 100;

  return {
    used,
    remaining,
    percentage: Math.round(usagePercentage),
    isDangerZone: usagePercentage >= 80, // إطلاق تنبيه الخطر المالي عند استهلاك 80% من الحصة المتاحة للحساب
    canGenerate: remaining > 0
  };
};