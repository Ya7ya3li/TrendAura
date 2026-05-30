import React from 'react'
import UpgradeButton from './UpgradeButton'

/**
 * TrendAura Premium Cyberpunk Pricing Panel - V2 Elite Image Match Edition
 * Re-engineered to precisely mirror the absolute neon glow, custom color tags, and glassmorphic tiers.
 */
export default function PricingCard({ plan, isCurrent, userId }) {
  const planId = plan.id?.toLowerCase()?.trim()
  const isViral = planId === 'viral_engine' || planId === 'viral engine'
  const isPro = planId === 'pro'
  const isFree = planId === 'free'

  // 🧬 تفكيك وحقن التوهج والمظهر الزجاجي الداكن لكل خطة بناءً على الصورة بالملّي
  let cardStyle = "bg-[#111625]/90 border-slate-800 text-white"
  if (isViral) {
    cardStyle = "bg-[#111625]/95 border-rose-500 shadow-[0_0_25px_rgba(244,63,94,0.25)] text-white relative z-10 scale-[1.02] md:-translate-y-1"
  } else if (isPro) {
    cardStyle = "bg-[#111625]/95 border-blue-500 shadow-[0_0_25px_rgba(59,130,246,0.25)] text-white relative z-10"
  } else {
    cardStyle = "bg-[#111625]/60 border-slate-800/80 text-white opacity-95"
  }

  return (
    <div className={`rounded-[28px] p-6 flex flex-col justify-between border transition-all duration-300 relative select-none text-right dir-rtl ${cardStyle}`}>
      
      {/* ⚡ اللافتات العلوية المضيئة المدمجة في الهيكل المركزي بالملّي */}
      {isViral && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-rose-600 to-orange-500 text-white font-black text-[9px] px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-rose-600/30 whitespace-nowrap flex items-center gap-1">
          <span>⚡</span> اختيار صناع المحتوى
        </div>
      )}

      {isPro && (
        <div className="absolute -top-3.5 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-black text-[9px] px-4 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-blue-600/30 whitespace-nowrap flex items-center gap-1">
          <span>🔥</span> الأكثر شعبية
        </div>
      )}

      <div>
        {/* 🟢 اسم الباقة والأيقونة الدائرية الملونة المطابقة للقطتك */}
        <div className="flex items-center justify-center gap-2 mb-4 mt-2">
          {isViral && <span className="w-2.5 h-2.5 rounded-full bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.9)] shrink-0" />}
          {isPro && <span className="w-2.5 h-2.5 rounded-full bg-blue-400 shadow-[0_0_8px_rgba(96,165,250,0.9)] shrink-0" />}
          {isFree && <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.9)] shrink-0" />}
          
          <h3 className="text-sm font-black tracking-tight text-white">
            {plan.name}
          </h3>
        </div>

        {/* 💰 هندسة كتلة السعر الكبيرة الملوكية */}
        <div className="text-center mb-2">
          <span className="text-4xl font-black font-sans tracking-tight text-white block">
            {plan.price}
          </span>
          <span className="text-[10px] font-bold text-slate-400 mt-1 block">
            {plan.currency || 'ريال'} / {plan.period || 'شهر'}
          </span>
        </div>

        {/* 📄 الوصف التسويقي القصير أسفل العملة */}
        <p className="text-[10px] font-semibold text-slate-400 text-center leading-relaxed mb-5 min-h-[32px] px-2">
          {plan.desc}
        </p>

        <div className="border-t border-slate-800/50 my-4" />

        {/* 📋 مصفوفة الميزات وعلامات الاختيار (Checkmarks) الملونة حسب الباقة */}
        <div className="mb-6">
          <ul className="space-y-3 text-[10px] font-bold text-right">
            {plan.features?.map((feat, idx) => (
              <li key={idx} className="flex items-start gap-2.5 leading-normal">
                <span className={`text-xs shrink-0 ${
                  isViral ? 'text-rose-500' : isPro ? 'text-blue-400' : 'text-emerald-400'
                }`}>✓</span>
                <span className="text-slate-300 font-medium">{feat}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* 💳 زر الترقية والدفع السفلي الفاخر */}
      <div className="mt-auto pt-2 shrink-0">
        <UpgradeButton
          planId={plan.id}
          price={plan.price}
          userId={userId}
          isCurrent={isCurrent}
          customText={plan.buttonText}
        />
      </div>
    </div>
  )
}