import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PLANS } from '../../constants/plans'
import Button from '../common/Button'

/**
 * TrendAura Quick Pricing Plans Preview Section
 */
export default function PricingPreview() {
  const navigate = useNavigate()

  return (
    <section className="w-full py-20 bg-white text-right dir-rtl select-none">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight md:text-3xl">
            استثمر في طموحك الإبداعي اليوم
          </h2>
          <p className="text-[11px] font-bold text-slate-400 mt-2">
            اختر خطة القوة التي تناسب حجم إنتاجك واكتسح المشاهدات
          </p>
        </div>

        {/* شبكة عرض كروت الخطط الثلاثية الفاخرة */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch">
          {PLANS.map((plan) => {
            const isViral = plan.id === 'viral_engine'
            return (
              <div
                key={plan.id}
                className={`rounded-[32px] p-6 flex flex-col justify-between border transition-all duration-300 ${
                  isViral
                    ? 'bg-slate-950 border-slate-800 text-white shadow-xl shadow-purple-950/10 relative scale-102'
                    : 'bg-white border-slate-100 text-slate-800 shadow-sm hover:shadow-md'
                }`}
              >
                {isViral && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-[8px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    الأقوى والطلب الأعلى 🔥
                  </span>
                )}

                <div>
                  <h4 className={`text-xs font-black tracking-tight mb-1 ${isViral ? 'text-blue-400' : 'text-slate-900'}`}>
                    {plan.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-400 mb-5 leading-normal">{plan.desc}</p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-black font-sans tracking-tight">{plan.price}</span>
                    <span className="text-[11px] font-bold text-slate-400 font-sans">{plan.currency} / {plan.period}</span>
                  </div>

                  {/* قائمة الميزات المختصرة للكروت */}
                  <ul className="space-y-3 text-[10px] font-bold mb-8">
                    {plan.features.slice(0, 4).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <span className={isViral ? 'text-purple-400' : 'text-blue-600'}>✓</span>
                        <span className={isViral ? 'text-slate-300' : 'text-slate-600'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => navigate('/register')}
                  variant={isViral ? 'purple' : 'primary'}
                  className="w-full py-3 rounded-xl text-[10px] font-black tracking-wide transform transition-all active:scale-95"
                >
                  {plan.price === '0' ? 'ابدأ التجربة الحرة 🚀' : 'اشترك وفجّر الأرقام ⚡'}
                </Button>
              </div>
            )
          })}
        </div>

      </div>
    </section>
  )
}