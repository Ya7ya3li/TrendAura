/**
 * TrendAura Subscription Plans & Business Logic Engine - V2 Optimized
 * ⚠️ المرجع الأساسي لجميع القيود المنطقية وصلاحيات المحرك
 */

export const PLANS = [
  {
    id: 'free',
    tier: 1,
    name: 'الباقة المجانية ⚪️',
    price: '0',
    currency: 'ريال',
    period: 'شهر',
    tokensReward: 5000,
    desc: 'مناسب للمبتدئين وبداية انطلاقتك في صناعة المحتوى',
    features: [
      '5 توليدات يوميًا',
      'أفكار محتوى أساسية',
      'هاشتاقات جاهزة',
      'سكربتات قصيرة محدودة',
      'تجربة المحرك الأساسي',
      'سرعة توليد عادية',
      'بدون حفظ كامل للسجل'
    ],
    buttonText: 'المستوى الحالي'
  },
  {
    id: 'pro',
    tier: 2,
    name: 'الأكثر شعبية Pro 🟢',
    price: '29',
    currency: 'ريال',
    period: 'شهر',
    tokensReward: 50000,
    desc: 'أدوات احترافية متكاملة لنمو سريع وتصدر المنصات',
    features: [
      'توليد غير محدود',
      'Hooks احترافية',
      'سكربتات قصيرة جاهزة',
      'عناوين تجذب المشاهدات',
      'تحسين جودة السكربت',
      'سرعة توليد أعلى',
      'حفظ السكربتات',
      'إعادة توليد السكربت',
      'دعم VIP 24/7',
      'إزالة حدود الانتظار',
      'تحسين CTA للنهاية',
      'توليد أفكار يومية ترند'
    ],
    buttonText: 'ترقية إلى Pro'
  },
  {
    id: 'viral_engine',
    tier: 3,
    name: 'اختيار صناع المحتوى • Viral Engine 🔴',
    price: '69',
    currency: 'ريال',
    period: 'شهر',
    tokensReward: 999999,
    desc: 'الترسانة الذكية الكاملة والأقوى لصناعة مقاطع مليونية متفجرة',
    features: [
      'جميع ميزات Pro',
      'أفكار Viral قوية',
      'سكربتات 60 ثانية احترافية',
      'أسلوب ترندي مخصص',
      'نسخ متعددة لنفس الفكرة',
      'Hooks هجومية عالية التفاعل',
      'تحسين Retention',
      'كتابة محتوى سريع الانتشار',
      'تحليل قوة الهوك',
      'تحليل احتمالية المشاهدات',
      'أوامر خاصة للترندات',
      'توليد بأسلوب مشهورين',
      'أولوية مطلقة في التوليد',
      'دعم VIP 24/7'
    ],
    buttonText: 'تفعيل المحرك'
  }
];

const PLANS_MAP = new Map(PLANS.map(p => [p.id, p]));

export const getPlanTier = (planId) => {
  const plan = PLANS_MAP.get(planId?.toLowerCase()?.trim());
  return plan ? plan.tier : 1;
};

export const getPlanConfig = (planId) => {
  return PLANS_MAP.get(planId?.toLowerCase()?.trim()) || PLANS[0];
};

export const hasFeature = (userPlanId, requiredTier) => {
  return getPlanTier(userPlanId) >= requiredTier;
};