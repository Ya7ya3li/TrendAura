import React from 'react'
import { useNavigate } from 'react-router-dom'
import { PLANS } from '../../constants/plans.js'
import { ROUTES } from '../../constants/routes.js'
import Button from '../common/Button.jsx'

/**
 * TrendAura Quick Pricing Plans Preview Section - Enterprise V2 Certified
 */
export default function PricingPreview() {
  const navigate = useNavigate()

  return (
    <section id="pricing" className="w-full py-20 bg-slate-950 border-t border-slate-900 text-right dir-rtl select-none">
      <div className="max-w-6xl mx-auto px-4">
        
        <div className="text-center mb-16">
          <h2 className="text-2xl font-black text-white tracking-tight md:text-3xl">
            استثمر في طموحك الإبداعي اليوم
          </h2>
          <p className="text-[11px] font-bold text-slate-500 mt-2">
            اختر خطة القوة التي تناسب حجم إنتاجك واكتسح خوارزميات المشاهدات حياً
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto items-stretch px-4">
          {PLANS.map((plan) => {
            const isViral = plan.id === 'viral_engine'
            
            return (
              <div
                key={plan.id}
                className={`rounded-[32px] p-6 flex flex-col justify-between border transition-all duration-300 relative ${
                  isViral
                    ? 'bg-slate-900 border-slate-800 text-white shadow-2xl scale-102 z-10'
                    : 'bg-slate-950 border-slate-900 text-slate-100 shadow-sm hover:border-slate-800'
                }`}
              >
                {isViral && (
                  <span className="absolute top-4 left-4 bg-gradient-to-r from-purple-600 to-pink-500 text-white font-black text-[8px] px-2.5 py-0.5 rounded-md uppercase tracking-wider">
                    الأقوى والأكثر طلباً
                  </span>
                )}

                <div>
                  <h4 className={`text-xs font-black tracking-tight mb-1 ${isViral ? 'text-cyan-400' : 'text-white'}`}>
                    {plan.name}
                  </h4>
                  <p className="text-[10px] font-bold text-slate-500 mb-5 leading-normal h-8">{plan.desc}</p>
                  
                  <div className="flex items-baseline gap-1 mb-6">
                    <span className="text-2xl font-black font-sans tracking-tight text-white">{plan.price}</span>
                    <span className="text-[11px] font-bold text-slate-500">{plan.currency} / {plan.period}</span>
                  </div>

                  {/* قائمة الميزات محولة الـ SVG بالملي */}
                  <ul className="space-y-3 text-[10px] font-bold mb-8">
                    {plan.features.slice(0, 5).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-2">
                        <svg className={`w-3.5 h-3.5 shrink-0 ${isViral ? 'text-cyan-400' : 'text-blue-500'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                        <span className={isViral ? 'text-slate-300' : 'text-slate-400'}>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Button
                  onClick={() => navigate(ROUTES.REGISTER)} // تدمير تسريب المسار النصي الصلب
                  variant={isViral ? 'purple' : 'primary'}
                  className="w-full py-3 rounded-xl text-[10px] font-black transform transition-all border-none"
                >
                  {plan.buttonText}
                </Button>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}