import React from 'react';

export const PLANS = [
  {
    id: 'free',
    tier: 1,
    name: 'الباقة المجانية',
    price: '0',
    currency: 'ريال',
    period: 'شهر',
    tokensReward: 100, // 🚀 رصيد ترحيبي أساسي عند التسجيل
    desc: 'مناسب للمبتدئين وبداية انطلاقتك في صناعة المحتوى',
    icon: (
      <svg className="w-6 h-6 text-slate-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    ),
    features: [
      '5 توليدات مجانية يوميًا',
      'رصيد ترحيبي 100 توكن عند البدء',
      'أفكار محتوى أساسية',
      'أول 3 هاشتاقات ترندية مجاناً',
      'سكربتات قصيرة محدودة',
      'تجربة المحرك الأساسي',
      'سرعة توليد عادية',
      'بدون حفظ كامل للسجل والأرشيف'
    ],
    buttonText: 'المستوى الحالي'
  },
  {
    id: 'pro',
    tier: 2,
    name: 'Pro VIP Pack',
    price: '29',
    currency: 'ريال',
    period: 'شهر',
    tokensReward: 1000, // 🚀 شحن 1000 توكن إضافي تراكمي فوق الرصيد الحالي
    desc: 'أدوات احترافية متكاملة لنمو سريع وتصدر المنصات',
    icon: (
      <svg className="w-6 h-6 text-amber-400 shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138z" />
      </svg>
    ),
    features: [
      'توليد مكثف (شحن 1000 توكن إضافي)',
      'Hooks احترافية خاطفة',
      'سكربتات قصيرة جاهزة بالملي',
      'عناوين تجذب المشاهدات وتمنع التمرير',
      'تحسين جودة السكربت تلقائياً',
      'سرعة توليد معالجة أعلى',
      'أرشيف مخصص لحفظ السكربتات',
      'إعادة توليد ذكية بنقرة واحدة',
      'دعم ممتاز للمشتركين 24/7',
      'إزالة حدود الانتظار الخوارزمية',
      'تحسين CTA للنهاية لزيادة المتابعين',
      'توليد أفكار يومية ترند مواكبة حياً'
    ],
    buttonText: 'اشترك الآن'
  },
  {
    id: 'viral_engine',
    tier: 3,
    name: 'Viral Engine',
    price: '69',
    currency: 'ريال',
    period: 'شهر',
    tokensReward: 10000, // 🚀 شحن 10000 توكن إضافي تراكمي فوق الرصيد الحالي
    desc: 'الترسانة الذكية الكاملة والأقوى لصناعة مقاطع مليونية متفجرة',
    icon: (
      <svg className="w-6 h-6 text-blue-500 dark:text-cyan-400 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    features: [
      'جميع ميزات باقة Pro VIP',
      'شحن 10000 توكن تراكمي إضافي',
      'أفكار Viral هجومية شديدة الانتشار',
      'سكربتات 60 ثانية احترافية متكاملة',
      'أسلوب ترندي مخصص يحاكي المشاهير',
      'نسخ متعددة ومختلفة لنفس الفكرة',
      'Hooks هجومية نفسية عالية التفاعل',
      'أدوات تحسين وتحليل الـ Retention',
      'Kتابة محتوى مخصص ومضمون للانتشار',
      'تحليل مجهري لقوة الهوك قبل النشر',
      'حساب احتمالية ونسب المشاهدات المتوقعة',
      'أوامر خاصة مجهزة لاقتناص الترندات',
      'أولوية مطلقة فورية على خوادم الـ AI',
      'دعم مباشر وخاص VIP على مدار الساعة'
    ],
    buttonText: 'اشترك الآن'
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