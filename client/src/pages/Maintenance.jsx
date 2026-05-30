import React from 'react'
import { useNavigate } from 'react-router-dom'
import Button from '../components/common/Button'

/**
 * TrendAura Core Maintenance Window Fallback Viewport
 */
export default function Maintenance() {
  const navigate = useNavigate()

  return (
    <div className="min-h-[85vh] flex items-center justify-center p-4 text-center dir-rtl select-none animate-scale-up">
      <div className="bg-white border border-slate-100 rounded-[32px] p-8 max-w-md w-full shadow-lg text-center">
        <div className="text-3xl mb-3 filter drop-shadow-xs">🛠️</div>
        <h2 className="text-sm font-black text-slate-900 tracking-tight mb-1">المنظومة تحت التحديث السريع</h2>
        <p className="text-[10px] font-bold text-slate-400 max-w-xs mx-auto leading-relaxed mb-6">
          نقوم حالياً بحقن وتوسيع خوادم محرك الفايرال لتوفير سرعة توليد مضاعفة لصناع المحتوى المحترفين. لن نستغرق طويلاً.
        </p>

        <Button onClick={() => navigate('/dashboard')} variant="secondary" className="w-full py-2.5">
          إعادة فحص جهوزية السيرفر 🔄
        </Button>
      </div>
    </div>
  )
}