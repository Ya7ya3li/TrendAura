/**
 * TrendAura Subscription Plans & Business Logic Metrics V2
 * Purely localized copy matching exact pricing tiers and features list.
 */
export const PLANS = [
  {
    id: 'free',
    tier: 1,
    name: 'الباقة المجانية ⚪️',
    price: '0',
    currency: 'ريال',
    period: 'شهر',
    desc: 'مناسب للمبتدئين وبداية انطلاقتك في صناعة المحتوى',
    features: [
      '5 توليدات يوميًا',
      'أفكار محتوى أساسية',
      'هاشتاقات جاهزة',
      'سكربتات قصيرة محدودة',
      'تجربة المحرك الأساسي',
      'سرعة توليد عادية',
      'بدون حفظ كامل للسجل.'
    ],
    buttonText: 'اشترك الان'
  },
  {
    id: 'pro',
    tier: 2,
    name: 'الأكثر شعبية Pro 🟢',
    price: '29',
    currency: 'ريال',
    period: 'شهر',
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
      'VIP 24/7 دعم',
      'إزالة حدود الانتظار',
      'تحسين CTA للنهاية',
      'توليد أفكار يومية ترند'
    ],
    buttonText: 'اشترك الآن'
  },
  {
    id: 'viral_engine',
    tier: 3,
    name: 'اختيار صناع المحتوى • Viral Engine 🔴',
    price: '69',
    currency: 'ريال',
    period: 'شهر',
    desc: 'الترسانة الذكية الكاملة والأقوى لصناعة مقاطع مليونية متفجرة',
    features: [
      'جميع ميزات Pro',
      'أفكار Viral قوية',
      'سكربتات 60 ثانية احترافية',
      'أسلوب ترندي مخصص لكل منصة',
      'نسخ متعددة لنفس الفكرة',
      'Hooks هجومية عالية التفاعل',
      'Retention تحسين',
      'كتابة محتوى سريع الانتشار',
      'تحليل قوة الهوك',
      'تحليل احتمالية المشاهدات',
      'أوامر خاصة للترندات',
      'توليد بأسلوب مشهورين',
      'أولوية في التوليد',
      'VIP 24/7 دعم'
    ],
    buttonText: 'اشترك الآن.'
  }
];

export const getPlanTier = (planId) => {
  const cleanId = planId?.toLowerCase()?.trim() || 'free';
  if (cleanId === 'viral_engine' || cleanId === 'viral engine') return 3;
  if (cleanId === 'pro') return 2;
  return 1;
};

export const getPlanConfig = (planId) => {
  const cleanId = planId?.toLowerCase()?.trim() || 'free';
  return PLANS.find(p => p.id === cleanId) || PLANS[0];
};