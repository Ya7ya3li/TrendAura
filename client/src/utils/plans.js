export const plans = [
  {
    id: 'free',
    tier: 1,
    maxGenerations: 5,
    viralMode: false,
    name: 'الباقة المجانية 🟢',
    price: '0',
    desc: 'مناسب للمبتدئين وبداية انطلاقتك في صناعة المحتوى',
    glow: 'none',
    borderColor: '#374151',
    features: [
      '5 توليدات يوميًا',
      'أفكار محتوى أساسية',
      'هاشتاقات جاهزة',
      'سكربتات قصيرة محدودة',
      'تجربة المحرك الأساسي',
      'سرعة توليد عادية',
      'بدون حفظ كامل للسجل'
    ]
  },
  {
    id: 'pro',
    tier: 2,
    maxGenerations: 999999,
    viralMode: false,
    name: 'اشتراك Pro 🔵',
    price: '29',
    desc: 'أدوات احترافية متكاملة لنمو سريع وتصدر المنصات',
    badge: '🔥 الأكثر شعبية',
    glow: '0 0 20px rgba(59, 130, 246, 0.3)',
    borderColor: '#3b82f6',
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
    ]
  },
  {
    id: 'viral_engine',
    tier: 3,
    maxGenerations: 999999,
    viralMode: true,
    name: 'اشتراك Viral Engine 🔴',
    price: '69',
    desc: 'الترسانة الذكية الكاملة والأقوى لصناعة مقاطع مليونية متفجرة',
    badge: '⚡ اختيار صناع المحتوى',
    popular: true,
    glow: '0 0 25px rgba(239, 68, 68, 0.4)',
    borderColor: '#ef4444',
    features: [
      'جميع ميزات Pro',
      'أفكار Viral قوية',
      'سكربتات 60 ثانية احترافية',
      'أسلوب ترندي مخصص لكل منصة',
      'نسخ متعددة لنفس الفكرة',
      'Hooks هجومية عالية التفاعل',
      'تحسين Retention',
      'كتابة محتوى سريع الانتشار',
      'تحليل قوة الهوك',
      'تحليل احتمالية المشاهدات',
      'أوامر خاصة للترندات',
      'توليد بأسلوب مشهورين',
      'أولوية في التوليد',
      'دعم VIP 24/7'
    ]
  }
]

export const getPlanTier = (planName) => {
  const clean = planName?.toLowerCase()?.trim() || 'free'
  if (clean === 'viral_engine' || clean === 'viral engine' || clean === 'pro viral engine' || clean === 'pro_viral') return 3
  if (clean === 'pro') return 2
  return 1
}